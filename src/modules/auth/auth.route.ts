import { Router } from "express";
import { AuthControllers } from "./auth.controller.js";
import { AuthValidation } from "./auth.validation.js";
import { validateRequestBody } from "../../middlewares/zod-middleware.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";

const router: Router = Router();

router.post(
  "/register",
  validateRequestBody(AuthValidation.registerSchema),
  AuthControllers.registerUser,
);

router.post(
  "/verify-email",
  validateRequestBody(AuthValidation.verifyEmailSchema),
  AuthControllers.verifyEmail,
);

router.post(
  "/login",
  validateRequestBody(AuthValidation.loginSchema),
  AuthControllers.loginUser,
);

router.get("/get-me", authMiddleware(), AuthControllers.getMe);

// router.post("/forget-password");

// router.post("/reset-password");

// type on browser: http://localhost:5000/api/v1/auth/login/google?redirect=/
router.get("/login/google", AuthControllers.googleLogin);

router.get("/google/success", AuthControllers.googleLoginSuccess);

export { router as AuthRouter };
