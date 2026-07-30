import { Router } from "express";
import { commentController } from "./comment.controller.js";
import { commentValidation } from "./comment.validation.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { validateRequestBody } from "../../middlewares/zod-middleware.js";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(),
  validateRequestBody(commentValidation.createCommentSchema),
  commentController.createComment,
);

router.patch(
  "/:id",
  authMiddleware(),
  validateRequestBody(commentValidation.updateCommentSchema),
  commentController.updateCommentById,
);

router.delete("/:id", authMiddleware(), commentController.deleteCommentById);

export { router as CommentRouter };
