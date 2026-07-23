import * as z from "zod";

const createPaymentIntentSchema = z.object({
  ideaId: z.uuid(),
});

const confirmPaymentSchema = z.object({
  ideaId: z.uuid(),
  transactionId: z.string(),
  paymentMethod: z.string(),
});

export const paymentValidations = {
  createPaymentIntentSchema,
  confirmPaymentSchema,
};
