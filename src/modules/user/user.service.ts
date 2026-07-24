import { Prisma, User, UserRole } from "@prisma/client";
import { UpdateUser } from "./user.interface.js";
import AppError from "../../errors/app-error.js";
import status from "http-status";
import { prisma } from "../../lib/prisma.js";
import { QueryBuilder } from "../../utils/query-builder.js";
import { AuthResponse, authResponse } from "../auth/auth.interface.js";
import {
  IQueryParams,
  QueryResult,
} from "../../interfaces/query-builder.interface.js";

const getUsers = async (query: IQueryParams): Promise<QueryResult<User>> => {
  try {
    const queryBuilder = new QueryBuilder<
      User,
      Prisma.UserWhereInput,
      Prisma.UserInclude
    >(prisma.user, query, {});

    const result = await queryBuilder
      .pagination()
      .where({
        deletedAt: null,
        role: UserRole.MEMBER,
      })
      .search()
      .filter()
      .sort()
      .select()
      .includes({ _count: true })
      .execute();

    return result;
  } catch (error) {
    throw error;
  }
};

const updateProfile = async (
  payload: UpdateUser,
  userId: string,
): Promise<AuthResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new AppError("User not found", status.NOT_FOUND);
    }

    const result = await prisma.user.update({
      where: { id: userId },
      data: payload,
    });

    return authResponse(result);
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id: string): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new AppError("User not found", status.NOT_FOUND);
    }

    await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    throw error;
  }
};

export const userService = {
  getUsers,
  updateProfile,
  deleteUser,
};
