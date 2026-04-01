import { Router } from "express";
import { CommentControllers } from "./comment.controller.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { UserRole } from "@prisma/client";
import { validateRequestBody } from "../../middlewares/zod-middleware.js";
import { CommentValidations } from "./comment.validation.js";

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

router.delete(
  "/:id",
  authMiddleware(UserRole.MEMBER),
  CommentControllers.deleteCommentById,
);

export { router as CommentRoutes };
