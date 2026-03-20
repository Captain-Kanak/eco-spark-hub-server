import { Router } from "express";
import { CategoryControllers } from "./route.controller";
import { authMiddleware } from "../../middlewares/auth-middleware";
import { UserRole } from "@prisma/client";
import {
  paramsIdZodSchema,
  validateRequestBody,
  validateRequestParams,
} from "../../middlewares/zod-middleware";
import { CategoryValidations } from "./category.validation";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRole.ADMIN),
  validateRequestBody(CategoryValidations.createCategoryZodSchema),
  CategoryControllers.createCategory,
);

router.get("/", CategoryControllers.getCategories);

router.get(
  "/:id",
  validateRequestParams(paramsIdZodSchema),
  CategoryControllers.getCategoryById,
);

export { router as CategoryRoutes };
