import { User, UserRole } from "@prisma/client";
import AppError from "../../errors/app-error";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import status from "http-status";

const registerUser = async (
  payload: IRegisterUser,
): Promise<{ token: null; user: Partial<User> }> => {
  try {
    const { name, email, password } = payload;

    const isUserExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isUserExist) {
      throw new AppError("User already exist", status.BAD_REQUEST);
    }

    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    return {
      token: null,
      user: {
        ...result.user,
        role: result.user.role as UserRole,
        isDeleted: result.user.isDeleted as boolean,
      },
    };
  } catch (error: any) {
    throw new AppError(error.message || "Failed to register user", 400);
  }
};

const loginUser = async (payload: ILoginUser) => {};

export const AuthServices = {
  registerUser,
  loginUser,
};
