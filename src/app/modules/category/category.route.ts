import { Router } from "express";
import { CategoryControllers } from "./route.controller.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { UserRole } from "@prisma/client";
import {
  paramsIdZodSchema,
  validateRequestBody,
  validateRequestParams,
} from "../../middlewares/zod-middleware.js";
import { CategoryValidations } from "./category.validation.js";

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

router.patch(
  "/:id",
  authMiddleware(UserRole.ADMIN),
  validateRequestBody(CategoryValidations.updateCategoryZodSchema),
  CategoryControllers.updateCategoryById,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.ADMIN),
  validateRequestParams(paramsIdZodSchema),
  CategoryControllers.deleteCategoryById,
);

export { router as CategoryRoutes };
