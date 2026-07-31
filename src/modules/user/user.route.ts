import { Router } from "express";
import { userController } from "./user.controller.js";
import { userValidation } from "./user.validation.js";
import { UserRole } from "@prisma/client";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { multerUpload } from "../../config/multer.config.js";
import { validateRequestBody } from "../../middlewares/zod-middleware.js";

const router: Router = Router();

router.get("/", authMiddleware(UserRole.ADMIN), userController.getUsers);

router.patch(
  "/update-profile",
  authMiddleware(),
  multerUpload.single("file"),
  validateRequestBody(userValidation.updateProfileSchema),
  userController.updateProfile,
);

router.patch(
  "/block/:id",
  authMiddleware(UserRole.ADMIN),
  userController.blockUser,
);

router.delete(
  "/delete/:id",
  authMiddleware(UserRole.ADMIN),
  userController.deleteUser,
);

export { router as UserRouter };
