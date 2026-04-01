import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { CategoryServices } from "./category.service.js";
import { sendResponse } from "../../utils/send-response.js";
import status from "http-status";
import { IQueryParams } from "../../../interfaces/query-builder.interface.js";

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

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CategoryServices.getCategoryById(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category fetched successfully",
    data: result,
  });
});

const updateCategoryById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;

  const result = await CategoryServices.updateCategoryById(
    id as string,
    payload,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategoryById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CategoryServices.deleteCategoryById(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
