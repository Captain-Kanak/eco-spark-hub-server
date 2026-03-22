import { Router } from "express";
import { ideaControllers } from "./idea.controller";
import { authMiddleware } from "../../middlewares/auth-middleware";
import { UserRole } from "@prisma/client";
import {
  paramsIdZodSchema,
  validateRequestBody,
  validateRequestParams,
} from "../../middlewares/zod-middleware";
import { IdeaValidations } from "./idea.validation";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRole.MEMBER),
  validateRequestBody(IdeaValidations.createIdeaZodSchema),
  ideaControllers.createIdea,
);

router.get("/", ideaControllers.getIdeas);

router.get(
  "/:id",
  validateRequestParams(paramsIdZodSchema),
  ideaControllers.getIdeaById,
);

router.patch(
  "/:id",
  authMiddleware(UserRole.MEMBER),
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
