import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { sendResponse } from "../../utils/send-response.js";
import status from "http-status";
import { AuthServices } from "./auth.service.js";
import { tokenUtils } from "../../utils/token.js";
import { User } from "@prisma/client";
import { env } from "../../../config/env.js";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.registerUser(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);
  const { token } = result;

  tokenUtils.setBetterAuthSessionCookie(res, token);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as User;

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const redirectPath = req.query.redirect || "/";
  const encodedRedirectPath = encodeURIComponent(redirectPath as string);
  const callbackURL = `${env.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;

  return res.render("googleRedirect", {
    betterAuthUrl: env.BETTER_AUTH_URL,
    callbackURL,
  });
});

const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
  const redirectPath = (req.query.redirect as string) || "/";
  const sessionToken = req.cookies["better-auth.session_token"];

  if (!sessionToken) {
    return res.redirect(`${env.FRONTEND_URL}/login?error=oauth_failed`);
  }

  const result = await AuthServices.googleLoginSuccess(sessionToken);
  const { session, user } = result;

  if (!session) {
    return res.redirect(`${env.FRONTEND_URL}/login?error=no_session_found`);
  }

  if (!user) {
    return res.redirect(`${env.FRONTEND_URL}/login?error=no_user_found`);
  }

  tokenUtils.setBetterAuthSessionCookie(res, session.token);

  const isValidRedirectPath =
    redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/";

  return res.redirect(`${env.FRONTEND_URL}${finalRedirectPath}?auth=success`);
});

export const AuthControllers = {
  registerUser,
  loginUser,
  getMe,
  googleLogin,
  googleLoginSuccess,
};
