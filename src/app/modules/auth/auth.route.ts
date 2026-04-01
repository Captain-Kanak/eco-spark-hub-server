import { Router } from "express";
import { AuthControllers } from "./auth.controller.js";
import { validateRequestBody } from "../../middlewares/zod-middleware.js";
import { AuthValidations } from "./auth.validation.js";

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

export { router as AuthRoutes };
