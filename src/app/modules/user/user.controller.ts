import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { userService } from "./user.service.js";
import { sendResponse } from "../../utils/send-response.js";
import status from "http-status";
import { IQueryParams } from "../../../interfaces/query-builder.interface.js";

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

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await userService.getUsers(query as IQueryParams);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await userService.deleteUser(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const userController = {
  updateProfile,
  getUsers,
  deleteUser,
};
