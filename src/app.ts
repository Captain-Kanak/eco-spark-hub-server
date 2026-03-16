import express, { Application } from "express";
import status from "http-status";

const app: Application = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(status.OK).json({
    success: true,
    message: "Server is running",
  });
});

export default app;
