import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { ideaServices } from "./idea.service.js";
import { sendResponse } from "../../utils/send-response.js";
import status from "http-status";
import { User } from "@prisma/client";
import { QueryBuilderParams } from "../../query-builder/query-builder.interface.js";

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

const getIdeas = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await ideaServices.getIdeas(query as QueryBuilderParams);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Ideas fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateIdeaStatus = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as User;
  const id = req.params.id;
  const { status: ideaStatus } = req.body;

  const result = await ideaServices.updateIdeaStatus(
    user,
    id as string,
    ideaStatus,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Idea status updated successfully",
    data: result,
  });
});

const getBySlug = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;

  const result = await ideaServices.getBySlug(slug as string);

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
    user.id,
    id as string,
    payload,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Idea updated successfully",
    data: result,
  });
});

const deleteIdeaById = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as User;
  const id = req.params.id;

  const result = await ideaServices.deleteIdeaById(user, id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Idea deleted successfully",
    data: result,
  });
});

export const ideaController = {
  createIdea,
  getIdeas,
  updateIdeaStatus,
  getBySlug,
  updateIdeaById,
  deleteIdeaById,
};
