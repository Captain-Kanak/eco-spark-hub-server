import status from "http-status";
import Stripe from "stripe";
import AppError from "../../errors/app-error";
import { ICreatePaymentIntent } from "./payment.interface";
import { prisma } from "../../lib/prisma";
import { env } from "../../../config/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (
  payload: ICreatePaymentIntent,
  userId: string,
) => {
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

    console.log(paymentIntent);

    return paymentIntent.client_secret;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to create payment intent",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const paymentServices = {
  createPaymentIntent,
};
