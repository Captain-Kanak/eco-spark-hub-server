import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { CommentServices } from "./comment.service.js";
import { sendResponse } from "../../utils/send-response.js";
import status from "http-status";
import { User } from "@prisma/client";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as User;
  const payload = req.body;

  const result = await CommentServices.createComment(id, payload);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Comment created successfully",
    data: result,
  });
});

const updateCommentById = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user as User;
  const id = req.params.id;
  const payload = req.body;

  const result = await CommentServices.updateCommentById(
    userId,
    id as string,
    payload,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Comment updated successfully",
    data: result,
  });
});

const deleteCommentById = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as User;
  const id = req.params.id;

  const result = await CommentServices.deleteCommentById(user, id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Comment deleted successfully",
    data: result,
  });
});

export const commentController = {
  createComment,
  updateCommentById,
  deleteCommentById,
};
