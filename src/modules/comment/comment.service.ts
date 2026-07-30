import { Comment, IdeaStatus, User, UserRole } from "@prisma/client";
import { CreateComment, UpdateComment } from "./comment.interface.js";
import AppError from "../../errors/app-error.js";
import status from "http-status";
import { prisma } from "../../lib/prisma.js";

const createComment = async (
  userId: string,
  payload: CreateComment,
): Promise<Comment> => {
  try {
    const idea = await prisma.idea.findUnique({
      where: {
        id: payload.ideaId,
        status: IdeaStatus.PUBLISHED,
        deletedAt: null,
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
  } catch (error) {
    throw error;
  }
};

const updateCommentById = async (
  userId: string,
  id: string,
  payload: UpdateComment,
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
  } catch (error) {
    throw error;
  }
};

const deleteCommentById = async (user: User, id: string): Promise<Comment> => {
  try {
    const isAdmin = user.role === UserRole.ADMIN;

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new AppError("Comment not found", status.NOT_FOUND);
    }

    if (!isAdmin && comment.userId !== user.id) {
      throw new AppError(
        "You are not authorized to delete this comment",
        status.UNAUTHORIZED,
      );
    }

    const deletedComment = await prisma.comment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return deletedComment;
  } catch (error) {
    throw error;
  }
};

export const CommentServices = {
  createComment,
  updateCommentById,
  deleteCommentById,
};
