import * as z from "zod";

const createPaymentIntentSchema = z.object({
  ideaId: z.uuid(),
});

export const paymentValidations = {
  createPaymentIntentSchema,
};
