export interface ICreatePaymentIntent {
  ideaId: string;
}

export interface IConfirmPayment {
  ideaId: string;
  transactionId: string;
  paymentMethod: string;
}
