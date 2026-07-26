import { Router } from "express";
import { paymentControllers } from "./donation.controller.js";
import { UserRole } from "@prisma/client";
import { paymentValidations } from "./payment.validation.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { validateRequestBody } from "../../middlewares/zod-middleware.js";

const router: Router = Router();

router.post(
  "/create-payment-intent",
  authMiddleware(UserRole.MEMBER),
  validateRequestBody(paymentValidations.createPaymentIntentSchema),
  paymentControllers.createPaymentIntent,
);

router.post(
  "/confirm-payment",
  authMiddleware(UserRole.MEMBER),
  validateRequestBody(paymentValidations.confirmPaymentSchema),
  paymentControllers.confirmPayment,
);

router.get(
  "/get-sales",
  authMiddleware(UserRole.MEMBER),
  paymentControllers.getSales,
);

router.get(
  "/get-all-payments",
  authMiddleware(UserRole.ADMIN),
  paymentControllers.getAllPayments,
);

export { router as DonationRouter };
