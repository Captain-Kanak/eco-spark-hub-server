import status from "http-status";
import Stripe from "stripe";
import AppError from "../../errors/app-error.js";
import { ConfirmPayment, CreatePaymentIntent } from "./donation.interface.js";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";
import {
  Currency,
  Donation,
  IdeaStatus,
  PaymentGateway,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
import {
  QueryBuilderParams,
  QueryBuilderResult,
} from "../../query-builder/query-builder.interface.js";
import { QueryBuilder } from "../../query-builder/query-builder.js";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (
  userId: string,
  payload: CreatePaymentIntent,
): Promise<string> => {
  try {
    const { ideaId, amount, currency } = payload;

    const idea = await prisma.idea.findUnique({
      where: {
        id: ideaId,
        status: IdeaStatus.PUBLISHED,
        deletedAt: null,
      },
    });

    if (!idea) {
      throw new AppError("Idea not found", status.NOT_FOUND);
    }

    let exchangeRate = 0;
    let baseAmount = 0;
    let amountInCents = 0;

    if (currency === Currency.USD) {
      exchangeRate = 1;
      baseAmount = amount;
      amountInCents = Math.round(amount * 100);
    } else if (currency === Currency.BDT) {
      exchangeRate = 122.5;
      const amountInUSD = amount / exchangeRate;
      baseAmount = amountInUSD;
      amountInCents = amountInUSD * 100;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        ideaId,
        userId,
      },
    });

    await prisma.donation.create({
      data: {
        originalCurrency: currency,
        originalAmount: new Prisma.Decimal(amount),
        exchangeRate: exchangeRate,
        baseAmount: new Prisma.Decimal(baseAmount),
        gateway: PaymentGateway.STRIPE,
        transactionId: paymentIntent.id,
        status: PaymentStatus.UNPAID,
        userId,
        ideaId,
      },
    });

    const secret = paymentIntent.client_secret as string;

    return secret;
  } catch (error) {
    throw error;
  }
};

const confirmPayment = async (
  payload: ConfirmPayment,
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
  userId: string,
  query: QueryBuilderParams,
): Promise<QueryBuilderResult<Donation>> => {
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
      .include({
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
  query: QueryBuilderParams,
): Promise<QueryBuilderResult<Donation>> => {
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
      })
      .search()
      .filter()
      .sort()
      .select()
      .include({
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
