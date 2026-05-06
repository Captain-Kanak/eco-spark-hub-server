import { Prisma, User, UserRole } from "@prisma/client";
import { IUpdateUser } from "./user.interface.js";
import AppError from "../../errors/app-error.js";
import status from "http-status";
import { prisma } from "../../lib/prisma.js";
import { QueryBuilder } from "../../utils/query-builder.js";
import {
  IQueryParams,
  QueryResult,
} from "../../../interfaces/query-builder.interface.js";

const updateProfile = async (
  payload: IUpdateUser,
  userId: string,
): Promise<User> => {
  try {
    const isUserExist = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!isUserExist) {
      throw new AppError("User not found", status.NOT_FOUND);
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: payload,
    });

    return user;
  } catch (error: any) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      error.message || "Failed to update user",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const getUsers = async (query: IQueryParams): Promise<QueryResult<User>> => {
  try {
    const queryBuilder = new QueryBuilder<
      User,
      Prisma.UserWhereInput,
      Prisma.UserInclude
    >(prisma.user, query, {});

    const result = await queryBuilder
      .pagination()
      .where({ isDeleted: false, role: UserRole.MEMBER })
      .search()
      .filter()
      .sort()
      .select()
      .includes({ _count: true })
      .execute();

    return result;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to get users",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const deleteUser = async (id: string): Promise<void> => {
  try {
    const isUserExist = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!isUserExist) {
      throw new AppError("User not found", status.NOT_FOUND);
    }

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  } catch (error: any) {
    throw new AppError(
      error instanceof Error ? error.message : "Failed to delete user",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const userService = {
  updateProfile,
  getUsers,
  deleteUser,
};
