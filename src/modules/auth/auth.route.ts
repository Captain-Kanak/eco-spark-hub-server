import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { AuthValidation } from "./auth.validation.js";
import { validateRequestBody } from "../../middlewares/zod-middleware.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";

const router: Router = Router();

router.post(
  "/register",
  validateRequestBody(AuthValidation.registerSchema),
  AuthController.registerUser,
);

router.post(
  "/verify-email",
  validateRequestBody(AuthValidation.verifyEmailSchema),
  AuthController.verifyEmail,
);

router.post("/resend-verification", AuthController.resendVerification);

router.post(
  "/login",
  validateRequestBody(AuthValidation.loginSchema),
  AuthController.loginUser,
);

// type on browser: http://localhost:5000/api/v1/auth/login/google?redirect=/
router.get("/login/google", AuthController.googleLogin);

router.get("/google/success", AuthController.googleLoginSuccess);

router.get("/get-me", authMiddleware(), AuthController.getMe);

// router.post("/forget-password");

// router.post("/reset-password");

export { router as AuthRouter };
