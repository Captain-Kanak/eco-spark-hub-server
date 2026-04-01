import { Router } from "express";
import { voteControllers } from "./vote.controller.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { UserRole } from "@prisma/client";
import { validateRequestBody } from "../../middlewares/zod-middleware.js";
import { voteValidation } from "./vote.validation.js";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRole.MEMBER),
  validateRequestBody(voteValidation.giveVoteSchema),
  voteControllers.giveVote,
);

export { router as VoteRoutes };
