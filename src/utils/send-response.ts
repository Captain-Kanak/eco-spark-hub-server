import { Response } from "express";
import { PaginationMeta } from "../query-builder/query-builder.interface.js";

interface ResponseData<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export const sendResponse = <T>(res: Response, resData: ResponseData<T>) => {
  const { statusCode, success, message, data, meta } = resData;

  return res.status(statusCode).json({
    success,
    message,
    data,
    meta,
  });
};
