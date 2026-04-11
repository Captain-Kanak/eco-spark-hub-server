import express, { Application, Request, Response } from "express";
import status from "http-status";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./config/env.js";
import { IndexRoutes } from "./routes/index.js";
import globalErrorHandler from "./app/middlewares/error-middleware.js";
import path from "path";

const app: Application = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/app/templates"));

app.set("query parser", "extended");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [env.FRONTEND_URL, env.BETTER_AUTH_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.status(status.OK).json({
    success: true,
    message: "Eco Spark Hub Server is running",
  });
});

app.use("/api/v1", IndexRoutes);

app.use((req: Request, res: Response) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: "Route Not Found",
    route: req.originalUrl,
  });
});

app.use(globalErrorHandler);

export default app;
