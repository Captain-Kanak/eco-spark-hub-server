import { Router } from "express";
import { userController } from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { multerUpload } from "../../../config/multer.config.js";
import {
  paramsIdZodSchema,
  validateRequestBody,
  validateRequestParams,
} from "../../middlewares/zod-middleware.js";
import { userValidation } from "./user.validation.js";
import { UserRole } from "@prisma/client";

const router: Router = Router();

router.get(
  "/get-users",
  authMiddleware(UserRole.ADMIN),
  userController.getUsers,
);

router.patch(
  "/update-profile",
  authMiddleware(),
  multerUpload.single("file"),
  validateRequestBody(userValidation.updateProfileZodSchema),
  userController.updateProfile,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.ADMIN),
  userController.deleteUser,
);

export { router as UserRoutes };
