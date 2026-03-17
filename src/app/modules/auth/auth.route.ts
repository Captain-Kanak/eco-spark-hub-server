import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { validateRequestBody } from "../../middlewares/zod-middleware";
import { AuthValidations } from "./auth.validation";

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
