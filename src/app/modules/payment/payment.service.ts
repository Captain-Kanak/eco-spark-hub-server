import status from "http-status";
import Stripe from "stripe";
import AppError from "../../errors/app-error.js";
import { IConfirmPayment, ICreatePaymentIntent } from "./payment.interface.js";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../../config/env.js";
import { Payment, PaymentStatus } from "@prisma/client";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (
  payload: ICreatePaymentIntent,
  userId: string,
): Promise<string> => {
  try {
    const { ideaId } = payload;

    const idea = await prisma.idea.findUnique({
      where: {
        id: ideaId,
      },
    });

    if (!idea) {
      throw new AppError("Idea not found", status.NOT_FOUND);
    }

    if (!idea.price) {
      throw new AppError("Idea is free", status.BAD_REQUEST);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: idea.price * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        ideaId,
        userId,
      },
    });

    return paymentIntent.client_secret as string;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to create payment intent",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const confirmPayment = async (
  payload: IConfirmPayment,
  userId: string,
): Promise<Payment> => {
  try {
    const { ideaId, transactionId, paymentMethod } = payload;

    const idea = await prisma.idea.findUnique({
      where: {
        id: ideaId,
      },
    });

    if (!idea) {
      throw new AppError("Idea not found", status.NOT_FOUND);
    }

    if (!idea.price) {
      throw new AppError("Idea is free", status.BAD_REQUEST);
    }

    const createPayment = await prisma.payment.create({
      data: {
        amount: idea.price,
        transactionId,
        paymentMethod,
        status: PaymentStatus.PAID,
        ideaId,
        userId,
      },
    });

    return createPayment;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to confirm payment",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const paymentServices = {
  createPaymentIntent,
  confirmPayment,
};
