import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { donationService } from "./donation.service.js";
import { sendResponse } from "../../utils/send-response.js";
import { User } from "@prisma/client";
import { QueryBuilderParams } from "../../query-builder/query-builder.interface.js";
import status from "http-status";

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as User;
  const payload = req.body;

  const result = await donationService.createPaymentIntent(id, payload);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Payment intent created successfully",
    data: result,
  });
});

const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
  await donationService.handleStripeWebhook(req);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Payment confirmed successfully",
  });
});

const getSales = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const { id } = req.user as User;

  const result = await donationService.getSales(
    id as string,
    query as QueryBuilderParams,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Sales fetched successfully",
    data: result,
  });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await donationService.getAllPayments(
    query as QueryBuilderParams,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All payments fetched successfully",
    data: result,
  });
});

export const donationController = {
  createPaymentIntent,
  handleStripeWebhook,
  getSales,
  getAllPayments,
};
