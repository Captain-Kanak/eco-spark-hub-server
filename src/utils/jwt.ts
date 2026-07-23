import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { JWTUser } from "../interfaces/auth.js";

const createToken = (
  payload: JwtPayload,
  secret: string,
  { expiresIn }: SignOptions,
): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token: string, secret: string): JWTUser => {
  return jwt.verify(token, secret) as JWTUser;
};

export const jwtUtil = {
  createToken,
  verifyToken,
};
