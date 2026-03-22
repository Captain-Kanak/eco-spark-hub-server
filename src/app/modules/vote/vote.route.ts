import { Router } from "express";
import { voteControllers } from "./vote.controller";
import { authMiddleware } from "../../middlewares/auth-middleware";
import { UserRole } from "@prisma/client";
import { validateRequestBody } from "../../middlewares/zod-middleware";
import { voteValidation } from "./vote.validation";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRole.MEMBER),
  validateRequestBody(voteValidation.giveVoteSchema),
  voteControllers.giveVote,
);

export { router as VoteRoutes };
