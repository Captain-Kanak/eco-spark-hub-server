import status from "http-status";
import AppError from "../../errors/app-error.js";
import { CreateCategory, UpdateCategory } from "./category.interface.js";
import { prisma } from "../../lib/prisma.js";
import { Category, Prisma } from "@prisma/client";
import {
  categoryFilterableFields,
  categorySearchableFields,
} from "./category.constant.js";
import { generateUniqueSlug } from "../../utils/generate-slug.js";
import {
  QueryBuilderParams,
  QueryBuilderResult,
} from "../../query-builder/query-builder.interface.js";
import { QueryBuilder } from "../../query-builder/query-builder.js";

const createCategory = async (payload: CreateCategory): Promise<Category> => {
  try {
    const slug = generateUniqueSlug(payload.name);

    const category = await prisma.category.create({
      data: {
        ...payload,
        slug,
      },
    });

    return category;
  } catch (error) {
    throw error;
  }
};

const getCategories = async (
  query: QueryBuilderParams,
): Promise<QueryBuilderResult<Category>> => {
  try {
    const queryBuilder = new QueryBuilder<
      Category,
      Prisma.CategoryWhereInput,
      Prisma.CategoryInclude
    >(prisma.category, query, {
      searchableFields: categorySearchableFields,
      filterableFields: categoryFilterableFields,
    });

    const result = await queryBuilder
      .pagination()
      .where({
        deletedAt: null,
      })
      .search()
      .filter()
      .sort()
      .select()
      .include({
        _count: true,
      })
      .execute();

    return result;
  } catch (error) {
    throw error;
  }
};

const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const category = await prisma.category.findUnique({
      where: { id, deletedAt: null },
      include: {
        _count: true,
        ideas: true,
      },
    });

    if (!category) {
      throw new AppError("Category not found", status.NOT_FOUND);
    }

    return category;
  } catch (error) {
    throw error;
  }
};

const updateCategoryById = async (
  id: string,
  payload: UpdateCategory,
): Promise<Category> => {
  try {
    const category = await prisma.category.findUnique({
      where: { id, deletedAt: null },
    });

    if (!category) {
      throw new AppError("Category not found", status.NOT_FOUND);
    }

    const slug = payload.name
      ? generateUniqueSlug(payload.name)
      : category.slug;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...payload,
        slug,
      },
    });

    return updatedCategory;
  } catch (error) {
    throw error;
  }
};

const deleteCategoryById = async (id: string): Promise<Category> => {
  try {
    const category = await prisma.category.findUnique({
      where: { id, deletedAt: null },
    });

    if (!category) {
      throw new AppError("Category not found", status.NOT_FOUND);
    }

    const result = await prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const CategoryService = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
