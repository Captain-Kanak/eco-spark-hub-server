import { Router } from "express";
import { CategoryControllers } from "./route.controller";
import { authMiddleware } from "../../middlewares/auth-middleware";
import { UserRole } from "@prisma/client";
import { validateRequestBody } from "../../middlewares/zod-middleware";
import { CategoryValidations } from "./category.validation";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRole.ADMIN),
  validateRequestBody(CategoryValidations.createCategoryZodSchema),
  CategoryControllers.createCategory,
);

export { router as CategoryRoutes };
