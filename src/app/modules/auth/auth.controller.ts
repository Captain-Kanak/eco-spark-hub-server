import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import status from "http-status";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = {
    statusCode: status.BAD_REQUEST,
    success: false,
    message: "Failed to register user",
  };

  if (!result.success) {
    sendResponse(res, result);
  }

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

export const AuthControllers = {
  registerUser,
};
