import status from "http-status";
import Stripe from "stripe";
import AppError from "../../errors/app-error.js";
import { IConfirmPayment, ICreatePaymentIntent } from "./payment.interface.js";
import { prisma } from "../../lib/prisma.js";
import { QueryBuilder } from "../../utils/query-builder.js";
import { env } from "../../config/env.js";
import {
  Currency,
  Donation,
  PaymentGateway,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
import {
  IQueryParams,
  QueryResult,
} from "../../interfaces/query-builder.interface.js";

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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        ideaId,
        userId,
      },
    });

    return paymentIntent.client_secret as string;
  } catch (error) {
    throw error;
  }
};

const confirmPayment = async (
  payload: IConfirmPayment,
  userId: string,
): Promise<Donation> => {
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

    if (idea.userId === userId) {
      throw new AppError("You cannot buy your own idea", status.BAD_REQUEST);
    }

    const createPayment = await prisma.donation.create({
      data: {
        originalCurrency: Currency.INR,
        originalAmount: 5000,
        exchangeRate: 1,
        baseCurrency: Currency.USD,
        baseAmount: 5000,
        gateway: PaymentGateway.STRIPE,
        paymentMethod,
        transactionId,
        status: PaymentStatus.PAID,
        userId,
        ideaId,
      },
    });

    return createPayment;
  } catch (error: any) {
    throw error;
  }
};

const getSales = async (
  query: IQueryParams,
  userId: string,
): Promise<QueryResult<Partial<Donation>>> => {
  try {
    const queryBuilder = new QueryBuilder<
      Donation,
      Prisma.DonationWhereInput,
      Prisma.DonationInclude
    >(prisma.donation, query, {});

    const result = await queryBuilder
      .pagination()
      .where({
        deletedAt: null,
        idea: { userId },
      })
      .search()
      .filter()
      .sort()
      .select()
      .includes({
        idea: true,
        user: true,
      })
      .execute();

    return result;
  } catch (error) {
    throw error;
  }
};

const getAllPayments = async (
  query: IQueryParams,
): Promise<QueryResult<Donation>> => {
  try {
    const queryBuilder = new QueryBuilder<
      Donation,
      Prisma.DonationWhereInput,
      Prisma.DonationInclude
    >(prisma.donation, query, {});

    const result = await queryBuilder
      .pagination()
      .where({ deletedAt: null })
      .search()
      .filter()
      .sort()
      .select()
      .includes({
        idea: {
          include: {
            user: true,
          },
        },
        user: true,
      })
      .execute();

    return result;
  } catch (error) {
    throw error;
  }
};

export const paymentServices = {
  createPaymentIntent,
  confirmPayment,
  getSales,
  getAllPayments,
};
