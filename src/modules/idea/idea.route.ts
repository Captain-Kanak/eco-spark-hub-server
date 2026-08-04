import { Router } from "express";
import { ideaController } from "./idea.controller.js";
import { UserRole } from "@prisma/client";
import { IdeaValidation } from "./idea.validation.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { multerUpload } from "../../config/multer.config.js";
import {
  paramsIdSchema,
  validateRequestBody,
  validateRequestParams,
} from "../../middlewares/zod-middleware.js";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRole.MEMBER),
  multerUpload.single("file"),
  validateRequestBody(IdeaValidation.createIdeaSchema),
  ideaController.createIdea,
);

router.get("/", ideaController.getIdeas);

router.patch(
  "/update-status/:id",
  authMiddleware(),
  validateRequestParams(paramsIdSchema),
  validateRequestBody(IdeaValidation.updateIdeaStatusSchema),
  ideaController.updateIdeaStatus,
);

router.get("/:slug", ideaController.getBySlug);

router.patch(
  "/:id",
  authMiddleware(UserRole.MEMBER),
  multerUpload.single("file"),
  validateRequestParams(paramsIdSchema),
  validateRequestBody(IdeaValidation.updateIdeaSchema),
  ideaController.updateIdeaById,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.ADMIN, UserRole.MEMBER),
  validateRequestParams(paramsIdSchema),
  ideaController.deleteIdeaById,
);

export { router as IdeaRouter };
