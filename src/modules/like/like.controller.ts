import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import status from "http-status";
import { sendResponse } from "../../utils/send-response.js";
import { likeService } from "./like.service.js";
import { User } from "@prisma/client";

const likeHandler = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user as User;
  const ideaId = req.params.ideaId;

  const result = await likeService.likeHandler(userId, ideaId as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Like given successfully",
    data: result,
  });
});

export const likeController = {
  likeHandler,
};
