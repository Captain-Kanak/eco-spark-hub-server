import { Router } from "express";
import { AuthControllers } from "./auth.controller.js";
import { validateRequestBody } from "../../middlewares/zod-middleware.js";
import { AuthValidations } from "./auth.validation.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";

const router: Router = Router();

router.post(
  "/register",
  validateRequestBody(AuthValidations.registerUserZodSchema),
  AuthControllers.registerUser,
);

router.post(
  "/verify-email",
  validateRequestBody(AuthValidations.verifyEmailZodSchema),
  AuthControllers.verifyEmail,
);

router.post(
  "/login",
  validateRequestBody(AuthValidations.loginUserZodSchema),
  AuthControllers.loginUser,
);

router.get("/me", authMiddleware(), AuthControllers.getMe);

// router.post("/forgot-password");

// router.post("/reset-password");

// http://localhost:5000/api/v1/auth/login/google?redirect=/
router.get("/login/google", AuthControllers.googleLogin);

router.get("/google/success", AuthControllers.googleLoginSuccess);

export { router as AuthRoutes };
