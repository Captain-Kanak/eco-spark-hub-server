import { Router } from "express";
import { donationController } from "./donation.controller.js";
import { UserRole } from "@prisma/client";
import { donationValidation } from "./donation.validation.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { validateRequestBody } from "../../middlewares/zod-middleware.js";

const router: Router = Router();

router.post(
  "/create-payment-intent",
  authMiddleware(UserRole.MEMBER),
  validateRequestBody(donationValidation.createPaymentIntentSchema),
  donationController.createPaymentIntent,
);

router.get(
  "/get-sales",
  authMiddleware(UserRole.MEMBER),
  donationController.getSales,
);

router.get(
  "/get-all-payments",
  authMiddleware(UserRole.ADMIN),
  donationController.getAllPayments,
);

export { router as DonationRouter };
