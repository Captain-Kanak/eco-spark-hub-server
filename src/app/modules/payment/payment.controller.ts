import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { DecodedUser } from "../../../types/auth.type.js";
import { paymentServices } from "./payment.service.js";
import { sendResponse } from "../../utils/send-response.js";

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const { id } = req.user as DecodedUser;

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
  const { id } = req.user as DecodedUser;

  const result = await paymentServices.confirmPayment(payload, id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment confirmed successfully",
    data: result,
  });
});

export const paymentControllers = {
  createPaymentIntent,
  confirmPayment,
};
