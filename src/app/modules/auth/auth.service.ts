import { User, UserRole, UserStatus } from "@prisma/client";
import AppError from "../../errors/app-error.js";
import { auth } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";
import { LoginUser, RegisterUser, UserResponse } from "./auth.interface.js";
import status from "http-status";
import { Session } from "better-auth";

const registerUser = async (
  payload: RegisterUser,
): Promise<{ user: UserResponse }> => {
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

    return {
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        emailVerified: result.user.emailVerified,
        image: result.user.image || "",
        role: result.user.role as UserRole,
        status: result.user.status as UserStatus,
        phone: result.user.phone || "",
        address: result.user.address || "",
        date_of_birth: result.user.date_of_birth ?? undefined,
        createdAt: result.user.createdAt,
        updatedAt: result.user.updatedAt,
      },
    };
  } catch (error) {
    throw new AppError("Failed to register user", status.INTERNAL_SERVER_ERROR);
  }
};

const verifyEmail = async (payload: {
  email: string;
  otp: string;
}): Promise<void> => {
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
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      error.message || "Failed to verify email",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const loginUser = async (
  payload: LoginUser,
): Promise<{
  redirect: boolean;
  token: string;
  url?: string | undefined;
  user: Partial<User>;
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
      throw new AppError("User not found", status.NOT_FOUND);
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

const googleLoginSuccess = async (
  sessionToken: string,
): Promise<{ session: Session | null; user: User | null }> => {
  try {
    const session = await auth.api.getSession({
      headers: {
        Cookie: `better-auth.session_token=${sessionToken}`,
      },
    });

    if (!session?.user) {
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
