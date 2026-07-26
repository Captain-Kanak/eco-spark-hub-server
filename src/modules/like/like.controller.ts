import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import status from "http-status";
import { sendResponse } from "../../utils/send-response.js";
import { voteServices } from "./like.service.js";
import { JWTUser } from "../../interfaces/auth.js";

const giveVote = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const { id: userId } = req.user as JWTUser;

  const result = await voteServices.giveVote(userId, payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Vote given successfully",
    data: result,
  });
});

export const voteControllers = {
  giveVote,
};
