import express, { Application, Request, Response } from "express";
import status from "http-status";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./config/env.js";
import { IndexRouter } from "./routes/index.js";
import globalErrorHandler from "./middlewares/error-middleware.js";
import path from "path";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

// create express app
const app: Application = express();

// view engine setup for EJS
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/templates"));

// query parser
app.set("query parser", "extended");

// body parser for json
app.use(express.json());

// urlencoded parser for form data
app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser());

// cors middleware
app.use(
  cors({
    origin: [env.FRONTEND_URL, env.BETTER_AUTH_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// default route
app.get("/", (req: Request, res: Response) => {
  res.status(status.OK).json({
    success: true,
    message: "Eco Spark Hub Server is running",
  });
});

// better auth api routes
app.use("/api/auth", toNodeHandler(auth));

// index routes for custom api
app.use("/api/v1", IndexRouter);

// 404 route handler
app.use((req: Request, res: Response) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: "Route Not Found",
    route: req.originalUrl,
  });
});

// global error handler
app.use(globalErrorHandler);

export default app;
