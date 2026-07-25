import { Router } from "express";
import { CategoryControllers } from "./category.controller.js";
import { UserRole } from "@prisma/client";
import { CategoryValidations } from "./category.validation.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { multerUpload } from "../../config/multer.config.js";
import {
  paramsIdZodSchema,
  validateRequestBody,
  validateRequestParams,
} from "../../middlewares/zod-middleware.js";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRole.ADMIN),
  multerUpload.single("file"),
  validateRequestBody(CategoryValidations.createCategorySchema),
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
  multerUpload.single("file"),
  validateRequestBody(CategoryValidations.updateCategorySchema),
  CategoryControllers.updateCategoryById,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.ADMIN),
  validateRequestParams(paramsIdZodSchema),
  CategoryControllers.deleteCategoryById,
);

export { router as CategoryRoutes };
