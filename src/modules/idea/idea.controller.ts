import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { ideaServices } from "./idea.service.js";
import { sendResponse } from "../../utils/send-response.js";
import status from "http-status";
import { User } from "@prisma/client";
import { IQueryParams } from "../../interfaces/query-builder.interface.js";

const createIdea = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    coverImage: req.file?.path,
  };
  const { id } = req.user as User;

  const result = await ideaServices.createIdea(payload, id);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Idea created successfully",
    data: result,
  });
});

const getPendingIdeas = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await ideaServices.getPendingIdeas(query as IQueryParams);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Ideas fetched successfully",
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

const getMyIdeas = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const { id } = req.user as User;

  const result = await ideaServices.getMyIdeas(query as IQueryParams, id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Ideas fetched successfully",
    data: result,
  });
});

const getDonatedIdeas = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const { id } = req.user as User;

  const result = await ideaServices.getDonatedIdeas(query as IQueryParams, id);

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
  const user = req.user as User;
  const id = req.params.id;
  const payload = {
    ...req.body,
    coverImage: req.file?.path,
  };

  const result = await ideaServices.updateIdeaById(
    id as string,
    payload,
    user.id,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Idea updated successfully",
    data: result,
  });
});

const updateIdeaStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { status: ideaStatus } = req.body;

  const result = await ideaServices.updateIdeaStatus(id as string, ideaStatus);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Idea status updated successfully",
    data: result,
  });
});

const deleteIdeaById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user;

  await ideaServices.deleteIdeaById(id as string, user as User);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Idea deleted successfully",
  });
});

export const ideaController = {
  createIdea,
  getPendingIdeas,
  getIdeas,
  getMyIdeas,
  getDonatedIdeas,
  getIdeaById,
  updateIdeaById,
  updateIdeaStatus,
  deleteIdeaById,
};
