import { Router } from "express";
import { paymentControllers } from "./payment.controller";
import { authMiddleware } from "../../middlewares/auth-middleware";
import { UserRole } from "@prisma/client";
import { validateRequestBody } from "../../middlewares/zod-middleware";
import { paymentValidations } from "./payment.validation";

const router: Router = Router();

router.post(
  "/create-payment-intent",
  authMiddleware(UserRole.MEMBER),
  validateRequestBody(paymentValidations.createPaymentIntentSchema),
  paymentControllers.createPaymentIntent,
);

export { router as PaymentRoutes };
