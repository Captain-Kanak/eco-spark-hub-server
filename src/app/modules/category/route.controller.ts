import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { CategoryServices } from "./category.service";
import { sendResponse } from "../../utils/send-response";
import status from "http-status";
import { IQueryParams } from "../../../interfaces/query-builder.interface";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.createCategory(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await CategoryServices.getCategories(query as IQueryParams);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Categories fetched successfully",
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  getCategories,
};
