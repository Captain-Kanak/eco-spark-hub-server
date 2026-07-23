import ms, { StringValue } from "ms";
import { jwtUtil } from "./jwt.js";
import { SignOptions } from "jsonwebtoken";
import { cookieUtil } from "./cookie.js";
import { Request, Response } from "express";
import { env } from "../config/env.js";
import { JWTUser } from "../interfaces/auth.js";

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

const setBetterAuthToken = (res: Response, token: string) => {
  cookieUtil.setCookie(res, "better-auth.session_token", token, {
    secure: true,
    sameSite: "none",
    httpOnly: true,
    path: "/",
    maxAge: Math.floor(ms(env.BETTER_AUTH_SESSION_EXPIRES_IN as StringValue)),
  });
};

const getBetterAuthToken = (req: Request) => {
  return cookieUtil.getCookie(req, "better-auth.session_token");
};

const setAccessToken = (res: Response, token: string) => {
  cookieUtil.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: Math.floor(ms(env.ACCESS_TOKEN_EXPIRES_IN as StringValue)),
  });
};

const getAccessToken = (req: Request) => {
  return cookieUtil.getCookie(req, "accessToken");
};

const setRefreshToken = (res: Response, token: string) => {
  cookieUtil.setCookie(res, "refreshToken", token, {
    secure: true,
    sameSite: "none",
    httpOnly: true,
    path: "/",
    maxAge: Math.floor(ms(env.REFRESH_TOKEN_EXPIRES_IN as StringValue)),
  });
};

const getRefreshToken = (req: Request) => {
  return cookieUtil.getCookie(req, "refreshToken");
};

const verifyAccessToken = (token: string) => {
  return jwtUtil.verifyToken(token, env.ACCESS_TOKEN_SECRET);
};

const verifyRefreshToken = (token: string) => {
  return jwtUtil.verifyToken(token, env.REFRESH_TOKEN_SECRET);
};

export const tokenUtil = {
  generateAccessToken,
  generateRefreshToken,
  setBetterAuthToken,
  getBetterAuthToken,
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
