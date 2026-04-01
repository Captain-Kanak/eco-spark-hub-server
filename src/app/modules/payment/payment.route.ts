import { Router } from "express";
import { paymentControllers } from "./payment.controller.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { UserRole } from "@prisma/client";
import { validateRequestBody } from "../../middlewares/zod-middleware.js";
import { paymentValidations } from "./payment.validation.js";

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

export { router as PaymentRoutes };
