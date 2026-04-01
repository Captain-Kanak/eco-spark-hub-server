import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { ideaServices } from "./idea.service.js";
import { sendResponse } from "../../utils/send-response.js";
import status from "http-status";
import { IQueryParams } from "../../../interfaces/query-builder.interface.js";
import { DecodedUser } from "../../../types/auth.type.js";

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

const getIdeas = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await ideaServices.getIdeas(query as IQueryParams);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Ideas fetched successfully",
    data: result,
  });
});

const getIdeaById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ideaServices.getIdeaById(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Idea fetched successfully",
    data: result,
  });
});

const updateIdeaById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;

  const result = await ideaServices.updateIdeaById(id as string, payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Idea updated successfully",
    data: result,
  });
});

const deleteIdeaById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user;

  const result = await ideaServices.deleteIdeaById(
    id as string,
    user as DecodedUser,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Idea deleted successfully",
    data: result,
  });
});

export const ideaControllers = {
  createIdea,
  getIdeas,
  getIdeaById,
  updateIdeaById,
  deleteIdeaById,
};
