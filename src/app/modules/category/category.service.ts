import status from "http-status";
import AppError from "../../errors/app-error";
import { ICreateCategory } from "./category.interface";
import { prisma } from "../../lib/prisma";
import { Category, Prisma } from "@prisma/client";
import {
  IQueryParams,
  QueryResult,
} from "../../../interfaces/query-builder.interface";
import { QueryBuilder } from "../../utils/query-builder";
import { categorySearchableFields } from "./category.constant";

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

export const CategoryServices = {
  createCategory,
  getCategories,
  getCategoryById,
};
