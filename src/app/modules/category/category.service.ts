import status from "http-status";
import AppError from "../../errors/app-error.js";
import { ICreateCategory, IUpdateCategory } from "./category.interface.js";
import { prisma } from "../../lib/prisma.js";
import { Category, Prisma } from "@prisma/client";
import {
  IQueryParams,
  QueryResult,
} from "../../../interfaces/query-builder.interface.js";
import { QueryBuilder } from "../../utils/query-builder.js";
import { categorySearchableFields } from "./category.constant.js";

const createCategory = async (payload: ICreateCategory): Promise<Category> => {
  try {
    const category = await prisma.category.create({
      data: payload,
    });

    return category;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to create category",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const getCategories = async (
  query: IQueryParams,
): Promise<QueryResult<Category>> => {
  const queryBuilder = new QueryBuilder<
    Category,
    Prisma.CategoryWhereInput,
    Prisma.CategoryInclude
  >(prisma.category, query, {
    searchableFields: categorySearchableFields,
    filterableFields: categorySearchableFields,
  });

  const result = await queryBuilder
    .pagination()
    .where({ isDeleted: false })
    .search()
    .filter()
    .sort()
    .select()
    .includes({
      _count: true,
    })
    .execute();

  return result;
};

const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        _count: true,
        ideas: true,
      },
    });

    if (!category) {
      throw new AppError("Category not found", status.NOT_FOUND);
    }

    return category;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to get category",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const updateCategoryById = async (
  id: string,
  payload: IUpdateCategory,
): Promise<Category | null> => {
  try {
    const isCategoryExist = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!isCategoryExist) {
      throw new AppError("Category not found", status.NOT_FOUND);
    }

    const category = await prisma.category.update({
      where: {
        id,
      },
      data: payload,
    });

    return category;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to update category",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const deleteCategoryById = async (id: string): Promise<Category> => {
  try {
    const isCategoryExist = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!isCategoryExist) {
      throw new AppError("Category not found", status.NOT_FOUND);
    }

    if (isCategoryExist.isDeleted === true) {
      throw new AppError("Category already deleted", status.BAD_REQUEST);
    }

    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return category;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to delete category",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const CategoryServices = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
