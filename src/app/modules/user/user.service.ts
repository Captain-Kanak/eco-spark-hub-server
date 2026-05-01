import { User } from "@prisma/client";
import { IUpdateUser } from "./user.interface.js";
import AppError from "../../errors/app-error.js";
import status from "http-status";
import { prisma } from "../../lib/prisma.js";

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

export const userService = {
  updateProfile,
};
