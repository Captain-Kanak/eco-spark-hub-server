import ms, { StringValue } from "ms";
import { jwtUtil } from "./jwt.js";
import { SignOptions } from "jsonwebtoken";
import { cookieUtils } from "./cookie.js";
import { Response } from "express";
import { env } from "../config/env.js";
import { JWTUser } from "../interfaces/auth.js";

const secret = "secret";
const expiresIn = "1d";

const generateAccessToken = (payload: JWTUser): string => {
  return jwtUtil.createToken(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  } as SignOptions);
};

const generateRefreshToken = (payload: JWTUser): string => {
  return jwtUtil.createToken(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  } as SignOptions);
};

const setBetterAuthSessionToken = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    secure: true,
    sameSite: "none",
    httpOnly: true,
    path: "/",
    maxAge: Math.floor(ms(env.BETTER_AUTH_SESSION_EXPIRES_IN as StringValue)),
  });
};

const setAccessTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: Math.floor(ms(expiresIn as StringValue)),
  });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    secure: true,
    sameSite: "none",
    httpOnly: true,
    path: "/",
    maxAge: Math.floor(ms(expiresIn as StringValue)),
  });
};

export const tokenUtil = {
  generateAccessToken,
  generateRefreshToken,
};

export const cookieUtil = {
  setBetterAuthSessionToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
};
