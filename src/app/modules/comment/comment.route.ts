import { Router } from "express";
import { CommentControllers } from "./comment.controller";
import { authMiddleware } from "../../middlewares/auth-middleware";
import { UserRole } from "@prisma/client";
import { validateRequestBody } from "../../middlewares/zod-middleware";
import { CommentValidations } from "./comment.validation";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRole.MEMBER),
  validateRequestBody(CommentValidations.createCommentZodSchema),
  CommentControllers.createComment,
);

router.patch(
  "/:id",
  authMiddleware(UserRole.MEMBER),
  validateRequestBody(CommentValidations.updateCommentZodSchema),
  CommentControllers.updateCommentById,
);

export { router as CommentRoutes };
