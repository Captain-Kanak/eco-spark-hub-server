import { Comment } from "@prisma/client";
import { ICreateComment } from "./comment.interface";
import AppError from "../../errors/app-error";
import status from "http-status";
import { prisma } from "../../lib/prisma";

const createComment = async (
  payload: ICreateComment,
  userId: string,
): Promise<Comment> => {
  try {
    const idea = await prisma.idea.findUnique({
      where: {
        id: payload.ideaId,
      },
    });

    if (!idea) {
      throw new AppError("Idea not found", status.NOT_FOUND);
    }

    const comment = await prisma.comment.create({
      data: {
        ...payload,
        userId,
      },
    });

    return comment;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to create comment",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const CommentServices = {
  createComment,
};
