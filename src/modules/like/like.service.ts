import status from "http-status";
import AppError from "../../errors/app-error.js";
import { GiveLike } from "./like.interface.js";
import { prisma } from "../../lib/prisma.js";
import { Like } from "@prisma/client";

const giveVote = async (userId: string, payload: GiveLike): Promise<Like> => {
  try {
    const { ideaId } = payload;

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea) {
      throw new AppError("Idea not found", status.NOT_FOUND);
    }

    const result = await prisma.$transaction(async (trx) => {
      const existingLike = await trx.like.findUnique({
        where: {
          ideaId_userId: { ideaId, userId },
        },
      });

      if (existingLike) {
        await trx.like.delete({
          where: {
            ideaId_userId: { ideaId, userId },
          },
        });
      }

      return trx.like.create({
        data: {
          ideaId,
          userId,
        },
      });
    });

    return result;
  } catch (error: any) {
    throw error;
  }
};

export const voteServices = {
  giveVote,
};
