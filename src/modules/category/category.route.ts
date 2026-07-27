import { Router } from "express";
import { CategoryController } from "./category.controller.js";
import { UserRole } from "@prisma/client";
import { CategoryValidation } from "./category.validation.js";
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
  validateRequestBody(CategoryValidation.createCategorySchema),
  CategoryController.createCategory,
);

router.get("/", CategoryController.getCategories);

router.get(
  "/:id",
  validateRequestParams(paramsIdZodSchema),
  CategoryController.getCategoryById,
);

router.patch(
  "/:id",
  authMiddleware(UserRole.ADMIN),
  multerUpload.single("file"),
  validateRequestBody(CategoryValidation.updateCategorySchema),
  CategoryController.updateCategoryById,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.ADMIN),
  validateRequestParams(paramsIdZodSchema),
  CategoryController.deleteCategoryById,
);

export { router as CategoryRouter };
