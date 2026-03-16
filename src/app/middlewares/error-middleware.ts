import { NextFunction, Request, Response } from "express";
import { env } from "../../config/env";
import status from "http-status";
import AppError from "../errors/app-error";

async function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server Error";

  if (env.NODE_ENV === "development") {
    console.error(err);
  }

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

export default globalErrorHandler;
