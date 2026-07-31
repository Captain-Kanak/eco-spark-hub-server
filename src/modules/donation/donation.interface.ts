import { Currency } from "@prisma/client";

export interface CreatePaymentIntent {
  ideaId: string;
  amount: number;
  currency: Currency;
}
