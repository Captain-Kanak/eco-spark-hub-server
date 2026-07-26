import { Router } from "express";
import { ideaController } from "./idea.controller.js";
import { UserRole } from "@prisma/client";
import { IdeaValidation } from "./idea.validation.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { multerUpload } from "../../config/multer.config.js";
import {
  paramsIdZodSchema,
  validateRequestBody,
  validateRequestParams,
} from "../../middlewares/zod-middleware.js";
import { optionalAuthMiddleware } from "../../middlewares/optional-auth-middleware.js";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRole.MEMBER),
  multerUpload.single("file"),
  validateRequestBody(IdeaValidation.createIdeaZodSchema),
  ideaController.createIdea,
);

router.get(
  "/pending-ideas",
  authMiddleware(UserRole.ADMIN),
  ideaController.getPendingIdeas,
);

router.get("/", optionalAuthMiddleware(), ideaController.getIdeas);

router.get(
  "/my-ideas",
  authMiddleware(UserRole.MEMBER),
  ideaController.getMyIdeas,
);

router.get(
  "/purchased-ideas",
  authMiddleware(UserRole.MEMBER),
  ideaController.getPurchasedIdeas,
);

router.get(
  "/:id",
  optionalAuthMiddleware(),
  validateRequestParams(paramsIdZodSchema),
  ideaController.getIdeaById,
);

router.patch(
  "/:id",
  authMiddleware(UserRole.MEMBER),
  multerUpload.single("file"),
  validateRequestParams(paramsIdZodSchema),
  validateRequestBody(IdeaValidation.updateIdeaZodSchema),
  ideaController.updateIdeaById,
);

router.patch(
  "/update-idea-status/:id",
  authMiddleware(UserRole.ADMIN),
  validateRequestParams(paramsIdZodSchema),
  validateRequestBody(IdeaValidation.updateIdeaStatusZodSchema),
  ideaController.updateIdeaStatus,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.ADMIN, UserRole.MEMBER),
  validateRequestParams(paramsIdZodSchema),
  ideaController.deleteIdeaById,
);

export { router as IdeaRouter };
