import { User, UserRole, UserStatus } from "@prisma/client";
import AppError from "../../errors/app-error.js";
import { auth } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";
import {
  LoginUser,
  RegisterUser,
  userResponse,
  UserResponse,
  VerifyEmail,
} from "./auth.interface.js";
import status from "http-status";
import { Session } from "better-auth";

const registerUser = async (payload: RegisterUser): Promise<UserResponse> => {
  try {
    const { name, email, password } = payload;

    const isUserExist = await prisma.user.findUnique({
      where: { email },
    });

    if (isUserExist) {
      throw new AppError(
        "User already exist with this email",
        status.BAD_REQUEST,
      );
    }

    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    return userResponse(result.user as User);
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError("Failed to register user", status.INTERNAL_SERVER_ERROR);
  }
};

const verifyEmail = async (payload: VerifyEmail): Promise<void> => {
  try {
    const { email, otp } = payload;

    const result = await auth.api.verifyEmailOTP({
      body: {
        email,
        otp,
      },
    });

    if (result.status && !result.user.emailVerified) {
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          emailVerified: true,
        },
      });
    }
  } catch (error) {
    throw new AppError("Failed to verify email", status.INTERNAL_SERVER_ERROR);
  }
};

const loginUser = async (
  payload: LoginUser,
): Promise<{
  redirect: boolean;
  token: string;
  url?: string | undefined;
  user: UserResponse;
}> => {
  try {
    const { email, password } = payload;

    const isUserExist = await prisma.user.findUnique({
      where: {
        email,
        isDeleted: false,
      },
    });

    if (!isUserExist) {
      throw new AppError("User not exist with this email", status.NOT_FOUND);
    }

    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return {
      redirect: result.redirect,
      token: result.token,
      url: result.url,
      user: userResponse(result.user as User),
    };
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError("Failed to login user", status.INTERNAL_SERVER_ERROR);
  }
};

const googleLoginSuccess = async (
  sessionToken: string,
): Promise<{ session: Session | null; user: User | null }> => {
  try {
    const session = await auth.api.getSession({
      headers: {
        Cookie: `better-auth.session_token=${sessionToken}`,
      },
    });

    if (!session?.session || !session?.user) {
      return { session: null, user: null };
    }

    return {
      session: session.session,
      user: session.user as User,
    };
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to google login",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const AuthServices = {
  registerUser,
  verifyEmail,
  loginUser,
  googleLoginSuccess,
};
