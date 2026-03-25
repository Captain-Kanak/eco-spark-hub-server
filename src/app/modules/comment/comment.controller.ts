import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { CommentServices } from "./comment.service";
import { sendResponse } from "../../utils/send-response";
import status from "http-status";
import { DecodedUser } from "../../../types/auth.type";

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

export const CommentControllers = {
  createComment,
  updateCommentById,
};
