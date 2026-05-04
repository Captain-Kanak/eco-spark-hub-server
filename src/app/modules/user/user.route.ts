import { Router } from "express";
import { userController } from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { multerUpload } from "../../../config/multer.config.js";
import { validateRequestBody } from "../../middlewares/zod-middleware.js";
import { userValidation } from "./user.validation.js";

const router: Router = Router();

router.patch(
  "/update-profile",
  authMiddleware(),
  multerUpload.single("file"),
  validateRequestBody(userValidation.updateProfileZodSchema),
  userController.updateProfile,
);

export { router as UserRoutes };
