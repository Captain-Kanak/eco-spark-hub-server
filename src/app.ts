import express, { Application } from "express";
import status from "http-status";
import { IndexRoutes } from "./routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./config/env";

const app: Application = express();

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

app.get("/", (req, res) => {
  res.status(status.OK).json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/v1", IndexRoutes);

export default app;
