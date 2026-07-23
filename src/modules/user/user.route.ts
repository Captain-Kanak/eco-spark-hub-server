import { Router } from "express";
import { userController } from "./user.controller.js";
import { authMiddleware } from "../../../middlewares/auth-middleware.js";
import { multerUpload } from "../../../config/multer.config.js";
import { validateRequestBody } from "../../../middlewares/zod-middleware.js";
import { userValidation } from "./user.validation.js";
import { UserRole } from "@prisma/client";

const router: Router = Router();

router.get("/", authMiddleware(UserRole.ADMIN), userController.getUsers);

router.patch(
  "/update",
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
