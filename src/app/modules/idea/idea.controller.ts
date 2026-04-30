import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { ideaServices } from "./idea.service.js";
import { sendResponse } from "../../utils/send-response.js";
import status from "http-status";
import { IQueryParams } from "../../../interfaces/query-builder.interface.js";
import { User } from "@prisma/client";

const createIdea = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    isPaid: req.body?.isPaid === "true" && Boolean(req.body?.isPaid),
    price: req.body?.price && Number(req.body?.price),
    image: req.file?.path,
  };
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
  const userId = req.user?.id;

  const result = await ideaServices.getIdeas(
    query as IQueryParams,
    userId as string,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Ideas fetched successfully",
    data: result,
  });
});

const getMyIdeas = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as User;

  const result = await ideaServices.getMyIdeas(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Ideas fetched successfully",
    data: result,
  });
});

const getPurchasedIdeas = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as User;

  const result = await ideaServices.getPurchasedIdeas(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Ideas fetched successfully",
    data: result,
  });
});

const getIdeaById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.user?.id;

  const result = await ideaServices.getIdeaById(id as string, userId as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Idea fetched successfully",
    data: result,
  });
});

const updateIdeaById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = {
    ...req.body,
    isPaid: req.body?.isPaid === "true" ? true : false,
    image: req.file?.path,
  };

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

  const result = await ideaServices.deleteIdeaById(id as string, user as User);

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
  getMyIdeas,
  getPurchasedIdeas,
  getIdeaById,
  updateIdeaById,
  deleteIdeaById,
};
