import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { ideaServices } from "./idea.service";
import { sendResponse } from "../../utils/send-response";
import status from "http-status";

const createIdea = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const { id } = req.user!;

  const result = await ideaServices.createIdea(payload, id as string);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Idea created successfully",
    data: result,
  });
});

export const ideaControllers = { createIdea };
