import { NextFunction, Request, Response } from "express";
import status from "http-status";
import * as z from "zod";
import { ErrorSourceType } from "../interfaces/error.interface.js";
import { env } from "../config/env.js";
import { handleZodError } from "../errors/zod-error.js";
import AppError from "../errors/app-error.js";
import { Prisma } from "@prisma/client";
import { handlePrismaError } from "../errors/prisma-error.js";

async function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server Error";
  let errorSources: ErrorSourceType[] = [];

  if (env.NODE_ENV === "development") {
    console.error(err);
  }

  if (err instanceof z.ZodError) {
    ({ statusCode, message, errorSources } = handleZodError(err));
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    ({ statusCode, message, errorSources } = handlePrismaError(err));
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  } else {
    message = "Something went wrong";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

export default globalErrorHandler;
