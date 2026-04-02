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
  "/login",
  validateRequestBody(AuthValidations.loginUserZodSchema),
  AuthControllers.loginUser,
);

router.get("/me", authMiddleware(), AuthControllers.getMe);

export { router as AuthRoutes };
