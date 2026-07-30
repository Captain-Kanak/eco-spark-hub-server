import status from "http-status";
import AppError from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";
import { Like } from "@prisma/client";

const likeHandler = async (userId: string, ideaId: string): Promise<Like> => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId, deletedAt: null },
    });

    if (!idea) {
      throw new AppError("Idea not found", status.NOT_FOUND);
    }

    const result = await prisma.$transaction(async (trx) => {
      const like = await trx.like.findUnique({
        where: {
          ideaId_userId: { ideaId, userId },
        },
      });

      if (!like) {
        return await trx.like.create({
          data: {
            ideaId,
            userId,
          },
        });
      }

      return await trx.like.delete({
        where: {
          ideaId_userId: { ideaId, userId },
        },
      });
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const likeService = {
  likeHandler,
};
