import { Router } from "express";
import { voteControllers } from "./like.controller.js";
import { UserRole } from "@prisma/client";
import { voteValidation } from "./like.validation.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { validateRequestBody } from "../../middlewares/zod-middleware.js";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRole.MEMBER),
  validateRequestBody(voteValidation.giveVoteSchema),
  voteControllers.giveVote,
);

export { router as LikeRouter };
