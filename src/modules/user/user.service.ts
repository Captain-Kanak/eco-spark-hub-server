import { Prisma, User, UserStatus } from "@prisma/client";
import { UpdateUser } from "./user.interface.js";
import AppError from "../../errors/app-error.js";
import status from "http-status";
import { prisma } from "../../lib/prisma.js";
import {
  QueryBuilderParams,
  QueryBuilderResult,
} from "../../query-builder/query-builder.interface.js";
import { QueryBuilder } from "../../query-builder/query-builder.js";
import { userFilterableFields, userSearchableFields } from "./user.constant.js";

const getUsers = async (
  query: QueryBuilderParams,
): Promise<QueryBuilderResult<User>> => {
  try {
    const queryBuilder = new QueryBuilder<
      User,
      Prisma.UserWhereInput,
      Prisma.UserInclude
    >(prisma.user, query, {
      searchableFields: userSearchableFields,
      filterableFields: userFilterableFields,
    });

    const result = await queryBuilder
      .pagination()
      .sort()
      .where({
        deletedAt: null,
      })
      .search()
      .filter()
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

const updateProfile = async (
  userId: string,
  payload: UpdateUser,
): Promise<User> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && user.deletedAt !== null) {
      throw new AppError(
        "You account has been suspended, please contact support",
        status.BAD_REQUEST,
      );
    } else if (user && user.status === UserStatus.BLOCKED) {
      throw new AppError(
        "You account has been blocked, please contact support",
        status.BAD_REQUEST,
      );
    } else if (!user) {
      throw new AppError("User not found", status.NOT_FOUND);
    }

    const result = await prisma.user.update({
      where: { id: userId },
      data: payload,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const blockUser = async (id: string): Promise<User> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (user && user.deletedAt !== null) {
      throw new AppError(
        "This account has been already deleted",
        status.BAD_REQUEST,
      );
    } else if (user && user.status === UserStatus.BLOCKED) {
      throw new AppError(
        "This account has been already blocked",
        status.BAD_REQUEST,
      );
    } else if (!user) {
      throw new AppError("User not found", status.NOT_FOUND);
    }

    const result = await prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.BLOCKED,
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id: string): Promise<User> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (user && user.deletedAt !== null) {
      throw new AppError(
        "This account has been already deleted",
        status.BAD_REQUEST,
      );
    } else if (!user) {
      throw new AppError("User not found", status.NOT_FOUND);
    }

    const result = await prisma.user.update({
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

export const userService = {
  getUsers,
  updateProfile,
  blockUser,
  deleteUser,
};
