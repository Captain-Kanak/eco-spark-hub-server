import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { paymentServices } from "./payment.service.js";
import { sendResponse } from "../../utils/send-response.js";
import { User } from "@prisma/client";
import { IQueryParams } from "../../../interfaces/query-builder.interface.js";

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const { id } = req.user as User;

  const result = await paymentServices.createPaymentIntent(
    payload,
    id as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment intent created successfully",
    data: result,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const { id } = req.user as User;

  const result = await paymentServices.confirmPayment(payload, id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment confirmed successfully",
    data: result,
  });
});

const getSales = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const { id } = req.user as User;

  const result = await paymentServices.getSales(
    query as IQueryParams,
    id as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sales fetched successfully",
    data: result,
  });
});

export const paymentControllers = {
  createPaymentIntent,
  confirmPayment,
  getSales,
};
