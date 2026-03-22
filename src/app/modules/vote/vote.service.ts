import status from "http-status";
import AppError from "../../errors/app-error";
import { IGiveVote } from "./vote.interface";
import { prisma } from "../../lib/prisma";
import { Vote, VoteType } from "@prisma/client";

const giveVote = async (userId: string, payload: IGiveVote): Promise<Vote> => {
  try {
    const { ideaId, voteType } = payload;

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea) {
      throw new AppError("Idea not found", status.NOT_FOUND);
    }

    const result = await prisma.$transaction(async (trx) => {
      const existingVote = await trx.vote.findUnique({
        where: {
          ideaId_userId: { ideaId, userId },
        },
      });

      let upvoteChange = 0;
      let downvoteChange = 0;

      if (existingVote?.voteType === voteType) {
        if (voteType === VoteType.UP) upvoteChange -= 1;
        if (voteType === VoteType.DOWN) downvoteChange -= 1;

        await trx.vote.delete({
          where: {
            ideaId_userId: { ideaId, userId },
          },
        });
      } else if (existingVote) {
        if (existingVote.voteType === VoteType.UP) upvoteChange -= 1;
        if (existingVote.voteType === VoteType.DOWN) downvoteChange -= 1;

        if (voteType === VoteType.UP) upvoteChange += 1;
        if (voteType === VoteType.DOWN) downvoteChange += 1;

        await trx.vote.update({
          where: {
            ideaId_userId: { ideaId, userId },
          },
          data: { voteType },
        });
      } else {
        if (voteType === VoteType.UP) upvoteChange += 1;
        if (voteType === VoteType.DOWN) downvoteChange += 1;

        await trx.vote.create({
          data: {
            ideaId,
            userId,
            voteType,
          },
        });
      }

      await trx.idea.update({
        where: { id: ideaId },
        data: {
          upvotes: { increment: upvoteChange },
          downvotes: { increment: downvoteChange },
        },
      });

      return { ideaId, userId, voteType } as Vote;
    });

    return result;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to give vote",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const voteServices = {
  giveVote,
};
