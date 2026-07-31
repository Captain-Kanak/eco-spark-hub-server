import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { CategoryService } from "./category.service.js";
import { sendResponse } from "../../utils/send-response.js";
import status from "http-status";
import { QueryBuilderParams } from "../../query-builder/query-builder.interface.js";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    icon: req.file?.path,
  };

  const result = await CategoryService.createCategory(payload);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await CategoryService.getCategories(
    query as QueryBuilderParams,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Categories fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CategoryService.getCategoryById(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category fetched successfully",
    data: result,
  });
});

const updateCategoryById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = {
    ...req.body,
    icon: req.file?.path,
  };

  const result = await CategoryService.updateCategoryById(
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

  const result = await CategoryService.deleteCategoryById(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
