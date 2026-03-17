import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { DecodedUser } from "../../types/auth.type";

const createToken = (
  payload: JwtPayload,
  secret: string,
  { expiresIn }: SignOptions,
) => {
  const token = jwt.sign(payload, secret, { expiresIn });

  return token;
};

const verifyToken = (token: string, secret: string) => {
  const decoded = jwt.verify(token, secret) as DecodedUser;

  return decoded;
};

export const jwtUtils = {
  createToken,
  verifyToken,
};
