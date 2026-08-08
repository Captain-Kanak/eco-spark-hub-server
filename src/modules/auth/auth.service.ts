import { User, UserStatus } from "@prisma/client";
import AppError from "../../errors/app-error.js";
import { auth } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";
import { LoginUser, RegisterUser, VerifyEmail } from "./auth.interface.js";
import status from "http-status";
import { Session } from "better-auth";

const registerUser = async (payload: RegisterUser): Promise<User> => {
  try {
    const { name, email, password } = payload;

    const user = await prisma.user.findUnique({ where: { email } });

    if (user && user.deletedAt !== null) {
      throw new AppError(
        "Your account has been suspended, please contact support or try different email",
        status.BAD_REQUEST,
      );
    } else if (user && user.status === UserStatus.BLOCKED) {
      throw new AppError(
        "Your account has been blocked, please contact support",
        status.BAD_REQUEST,
      );
    } else if (user) {
      throw new AppError("User already exist", status.BAD_REQUEST);
    }

    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    return result.user as User;
  } catch (error) {
    throw error;
  }
};

const verifyEmail = async (
  payload: VerifyEmail,
): Promise<{ status: boolean; token: string | null; user: Partial<User> }> => {
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
        where: { email },
        data: {
          emailVerified: true,
        },
      });
    }

    return result;
  } catch (error) {
    throw error;
  }
};

const resendVerification = async (
  email: string,
): Promise<{ success: boolean }> => {
  return await auth.api.sendVerificationOTP({
    body: {
      email,
      type: "email-verification",
    },
  });
};

const loginUser = async (
  payload: LoginUser,
): Promise<{
  redirect: boolean;
  token: string;
  url?: string | undefined;
  user: User;
}> => {
  try {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({ where: { email } });

    if (user && user.deletedAt !== null) {
      throw new AppError(
        "Your account has been suspended, please contact support",
        status.BAD_REQUEST,
      );
    } else if (user && user.status === UserStatus.BLOCKED) {
      throw new AppError(
        "Your account has been blocked, please contact support",
        status.BAD_REQUEST,
      );
    } else if (!user) {
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
      user: result.user as User,
    };
  } catch (error) {
    throw error;
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

export const AuthService = {
  registerUser,
  verifyEmail,
  resendVerification,
  loginUser,
  googleLoginSuccess,
};
