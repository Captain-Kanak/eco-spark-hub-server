import ms, { StringValue } from "ms";
import { env } from "../../config/env";
import { jwtUtils } from "./jwt";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { cookieUtils } from "./cookie";
import { Response } from "express";

const generateAccessToken = (payload: JwtPayload) => {
  const accessToken = jwtUtils.createToken(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: Math.floor(
      ms(env.ACCESS_TOKEN_EXPIRES_IN as StringValue) / 1000,
    ),
  } as SignOptions);

  return accessToken;
};

const generateRefreshToken = (payload: JwtPayload) => {
  const refreshToken = jwtUtils.createToken(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: Math.floor(
      ms(env.REFRESH_TOKEN_EXPIRES_IN as StringValue) / 1000,
    ),
  } as SignOptions);

  return refreshToken;
};

const setBetterAuthSessionCookie = (res: Response, token: string) => {
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
    maxAge: Math.floor(ms(env.ACCESS_TOKEN_EXPIRES_IN as StringValue)),
  });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    secure: true,
    sameSite: "none",
    httpOnly: true,
    path: "/",
    maxAge: Math.floor(ms(env.REFRESH_TOKEN_EXPIRES_IN as StringValue)),
  });
};

export const tokenUtils = {
  generateAccessToken,
  generateRefreshToken,
  setBetterAuthSessionCookie,
  setAccessTokenCookie,
  setRefreshTokenCookie,
};
