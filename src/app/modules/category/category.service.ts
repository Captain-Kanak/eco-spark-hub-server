import status from "http-status";
import AppError from "../../errors/app-error";
import { ICreateCategory } from "./category.interface";
import { prisma } from "../../lib/prisma";
import { Category } from "@prisma/client";

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

export const CategoryServices = {
  createCategory,
};
