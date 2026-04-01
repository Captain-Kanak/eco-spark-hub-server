import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { CommentServices } from "./comment.service.js";
import { sendResponse } from "../../utils/send-response.js";
import status from "http-status";
import { DecodedUser } from "../../../types/auth.type.js";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const { id } = req.user as DecodedUser;

  const result = await CommentServices.createComment(payload, id as string);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Comment created successfully",
    data: result,
  });
});

const updateCommentById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const { id: userId } = req.user as DecodedUser;

  const result = await CommentServices.updateCommentById(
    id as string,
    payload,
    userId as string,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Comment updated successfully",
    data: result,
  });
});

const deleteCommentById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { id: userId } = req.user as DecodedUser;

  const result = await CommentServices.deleteCommentById(
    id as string,
    userId as string,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Comment deleted successfully",
    data: result,
  });
});

export const CommentControllers = {
  createComment,
  updateCommentById,
  deleteCommentById,
};
