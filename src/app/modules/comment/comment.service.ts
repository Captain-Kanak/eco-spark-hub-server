import { Comment } from "@prisma/client";
import { ICreateComment, IUpdateComment } from "./comment.interface";
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

const updateCommentById = async (
  id: string,
  payload: IUpdateComment,
  userId: string,
): Promise<Comment> => {
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!comment) {
      throw new AppError("Comment not found", status.NOT_FOUND);
    }

    const updatedComment = await prisma.comment.update({
      where: {
        id,
        userId,
      },
      data: payload,
    });

    return updatedComment;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to update comment",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const CommentServices = {
  createComment,
  updateCommentById,
};
