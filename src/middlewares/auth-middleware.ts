import { UserRole, UserStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { prisma } from "../lib/prisma.js";
import { tokenUtil } from "../utils/token.js";
import AppError from "../errors/app-error.js";

export const authMiddleware = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = tokenUtil.getBetterAuthToken(req);

      if (!sessionToken) {
        throw new AppError(
          "Unauthorized: Session token not found",
          status.UNAUTHORIZED,
        );
      }

      if (sessionToken) {
        const session = await prisma.session.findUnique({
          where: {
            token: sessionToken,
            expiresAt: { gt: new Date() },
          },
          include: { user: true },
        });

        if (!session) {
          throw new AppError(
            "Unauthorized: Session not found",
            status.UNAUTHORIZED,
          );
        } else if (session.user.deletedAt !== null) {
          throw new AppError(
            "Unauthorized: User is deleted",
            status.UNAUTHORIZED,
          );
        } else if (session.user.status === UserStatus.BLOCKED) {
          throw new AppError(
            "Unauthorized: User is blocked",
            status.UNAUTHORIZED,
          );
        } else if (roles.length > 0 && !roles.includes(session.user.role)) {
          throw new AppError(
            "Unauthorized: you are not authorized to access this resources",
            status.UNAUTHORIZED,
          );
        }

        req.user = session.user;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
