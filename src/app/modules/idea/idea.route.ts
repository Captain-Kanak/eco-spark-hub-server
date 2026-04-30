import { Router } from "express";
import { ideaControllers } from "./idea.controller.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { UserRole } from "@prisma/client";
import {
  paramsIdZodSchema,
  validateRequestBody,
  validateRequestParams,
} from "../../middlewares/zod-middleware.js";
import { IdeaValidations } from "./idea.validation.js";
import { multerUpload } from "../../../config/multer.config.js";
import { optionalAuthMiddleware } from "../../middlewares/optional-auth-middleware.js";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRole.MEMBER),
  multerUpload.single("file"),
  validateRequestBody(IdeaValidations.createIdeaZodSchema),
  ideaControllers.createIdea,
);

router.get("/", ideaControllers.getIdeas);

router.get(
  "/my-ideas",
  authMiddleware(UserRole.MEMBER),
  ideaControllers.getMyIdeas,
);

router.get(
  "/purchased-ideas",
  authMiddleware(UserRole.MEMBER),
  ideaControllers.getPurchasedIdeas,
);

router.get(
  "/:id",
  optionalAuthMiddleware(),
  validateRequestParams(paramsIdZodSchema),
  ideaControllers.getIdeaById,
);

router.patch(
  "/:id",
  authMiddleware(UserRole.MEMBER),
  multerUpload.single("file"),
  validateRequestParams(paramsIdZodSchema),
  validateRequestBody(IdeaValidations.updateIdeaZodSchema),
  ideaControllers.updateIdeaById,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.ADMIN, UserRole.MEMBER),
  validateRequestParams(paramsIdZodSchema),
  ideaControllers.deleteIdeaById,
);

export { router as IdeaRoutes };
