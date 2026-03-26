import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { DecodedUser } from "../../../types/auth.type";
import { paymentServices } from "./payment.service";
import { sendResponse } from "../../utils/send-response";

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

export const paymentControllers = {
  createPaymentIntent,
};
