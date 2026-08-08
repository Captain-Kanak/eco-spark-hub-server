import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { sendResponse } from "../../utils/send-response.js";
import status from "http-status";
import { AuthService } from "./auth.service.js";
import { tokenUtil } from "../../utils/token.js";
import { User } from "@prisma/client";
import { env } from "../../config/env.js";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.verifyEmail(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Email verified successfully",
    data: result,
  });
});

const resendVerification = catchAsync(async (req, res) => {
  const result = await AuthService.resendVerification(req.body.email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Verification code sent successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);

  tokenUtil.setBetterAuthToken(res, result.token);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
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
  const sessionToken = tokenUtil.getBetterAuthToken(req);

  if (!sessionToken) {
    return res.redirect(`${env.FRONTEND_URL}/login?error=oauth_failed`);
  }

  const result = await AuthService.googleLoginSuccess(sessionToken);

  if (!result.session) {
    return res.redirect(`${env.FRONTEND_URL}/login?error=no_session_found`);
  }

  if (!result.user) {
    return res.redirect(`${env.FRONTEND_URL}/login?error=no_user_found`);
  }

  tokenUtil.setBetterAuthToken(res, result.session.token);

  const isValidRedirectPath =
    redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/";

  return res.redirect(`${env.FRONTEND_URL}${finalRedirectPath}?auth=success`);
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

export const AuthController = {
  registerUser,
  verifyEmail,
  resendVerification,
  loginUser,
  googleLogin,
  googleLoginSuccess,
  getMe,
};
