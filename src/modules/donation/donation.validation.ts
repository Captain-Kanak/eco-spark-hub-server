import { Currency } from "@prisma/client";
import * as z from "zod";

const idSchema = z.uuid("Invalid or missing UUID");

const amountSchema = z
  .number("Amount is required")
  .min(0, "Amount cannot be negative");

const currencySchema = z.enum(Currency);

const createPaymentIntentSchema = z.object({
  ideaId: idSchema,
  amount: amountSchema,
  currency: currencySchema,
});

const confirmPaymentSchema = z.object({
  ideaId: z.uuid(),
  transactionId: z.string(),
  paymentMethod: z.string(),
});

export const donationValidation = {
  createPaymentIntentSchema,
  confirmPaymentSchema,
};
