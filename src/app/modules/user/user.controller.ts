import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { userService } from "./user.service.js";
import { sendResponse } from "../../utils/send-response.js";
import status from "http-status";

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    date_of_birth: req.body?.date_of_birth && new Date(req.body?.date_of_birth),
    image: req.file?.path,
  };
  const { id } = req.user as { id: string };

  const result = await userService.updateProfile(payload, id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

export const userController = {
  updateProfile,
};
