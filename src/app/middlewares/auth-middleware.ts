import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { cookieUtils } from "../utils/cookie";
import AppError from "../errors/app-error";
import status from "http-status";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { env } from "../../config/env";
import { DecodedUser } from "../../types/auth.type";

export const authMiddleware = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userIds: string[] = [];

    try {
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

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
        }

        if (session.user.isDeleted) {
          throw new AppError(
            "Unauthorized: User is deleted",
            status.UNAUTHORIZED,
          );
        }

        if (roles.length > 0 && !roles.includes(session.user.role)) {
          throw new AppError(
            "Unauthorized: you are not authorized to access this resources",
            status.UNAUTHORIZED,
          );
        }

        userIds.push(session.user.id);
      }

      const accessToken = cookieUtils.getCookie(req, "accessToken");

      if (!accessToken) {
        throw new AppError(
          "Unauthorized: Access token not found",
          status.UNAUTHORIZED,
        );
      }

      if (accessToken) {
        const decoded = jwtUtils.verifyToken(
          accessToken,
          env.ACCESS_TOKEN_SECRET,
        );

        if (!decoded) {
          throw new AppError(
            "Unauthorized: Access token is invalid",
            status.UNAUTHORIZED,
          );
        }

        if (roles.length > 0 && !roles.includes(decoded.role)) {
          throw new AppError(
            "Unauthorized: you are not authorized to access this resources",
            status.UNAUTHORIZED,
          );
        }

        req.user = decoded as DecodedUser;
        userIds.push(decoded.id);
      }

      const refreshToken = cookieUtils.getCookie(req, "refreshToken");

      if (!refreshToken) {
        throw new AppError(
          "Unauthorized: Refresh token not found",
          status.UNAUTHORIZED,
        );
      }

      if (refreshToken) {
        const decoded = jwtUtils.verifyToken(
          refreshToken,
          env.REFRESH_TOKEN_SECRET,
        );

        if (!decoded) {
          throw new AppError(
            "Unauthorized: Refresh token is invalid",
            status.UNAUTHORIZED,
          );
        }

        if (roles.length > 0 && !roles.includes(decoded.role)) {
          throw new AppError(
            "Unauthorized: you are not authorized to access this resources",
            status.UNAUTHORIZED,
          );
        }

        userIds.push(decoded.id);
      }

      if (req.user) {
        userIds.map((id) => {
          if (req.user?.id !== id) {
            throw new AppError(
              "Unauthorized: you are not authorized to access this resources",
              status.UNAUTHORIZED,
            );
          }
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
