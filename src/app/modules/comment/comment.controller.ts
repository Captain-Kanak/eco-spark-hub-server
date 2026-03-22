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

export const CommentControllers = {
  createComment,
};
