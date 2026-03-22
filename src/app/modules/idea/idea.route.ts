import { Router } from "express";
import { ideaControllers } from "./idea.controller";
import { authMiddleware } from "../../middlewares/auth-middleware";
import { UserRole } from "@prisma/client";
import { validateRequestBody } from "../../middlewares/zod-middleware";
import { IdeaValidations } from "./idea.validation";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRole.MEMBER),
  validateRequestBody(IdeaValidations.createIdeaZodSchema),
  ideaControllers.createIdea,
);

export { router as IdeaRoutes };
