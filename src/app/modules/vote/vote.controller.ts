import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import status from "http-status";
import { sendResponse } from "../../utils/send-response";
import { voteServices } from "./vote.service";
import { DecodedUser } from "../../../types/auth.type";

const giveVote = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const { id: userId } = req.user as DecodedUser;

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
