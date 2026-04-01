import { User, UserRole, UserStatus } from "@prisma/client";
import AppError from "../../errors/app-error";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import status from "http-status";
import { tokenUtils } from "../../utils/token";

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
        status: result.user.status as UserStatus,
        isDeleted: result.user.isDeleted as boolean,
      },
    };
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to register user",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const loginUser = async (
  payload: ILoginUser,
): Promise<{
  redirect: boolean;
  token: string;
  accessToken: string;
  refreshToken: string;
  url?: string | undefined;
  user: Partial<User>;
}> => {
  try {
    const { email, password } = payload;

    const isUserExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!isUserExist) {
      throw new AppError("User not found", status.NOT_FOUND);
    }

    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    const accessToken = tokenUtils.generateAccessToken({
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      emailVerified: result.user.emailVerified,
      role: result.user.role,
      isDeleted: result.user.isDeleted,
    });

    const refreshToken = tokenUtils.generateRefreshToken({
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      emailVerified: result.user.emailVerified,
      role: result.user.role,
      isDeleted: result.user.isDeleted,
    });

    return {
      redirect: result.redirect,
      token: result.token,
      accessToken,
      refreshToken,
      url: result.url,
      user: {
        ...result.user,
        role: result.user.role as UserRole,
        status: result.user.status as UserStatus,
        isDeleted: result.user.isDeleted as boolean,
      },
    };
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to login user",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const AuthServices = {
  registerUser,
  loginUser,
};
