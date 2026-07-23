import { NextFunction, Request, Response } from "express";
import { cookieUtils } from "../utils/cookie.js";
import { prisma } from "../lib/prisma.js";

export const optionalAuthMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (!sessionToken) {
        return next();
      }

      const session = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });

      req.user = session?.user;

      next();
    } catch (error) {
      next(error);
    }
  };
};
