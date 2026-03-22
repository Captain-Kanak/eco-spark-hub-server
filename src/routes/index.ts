import { Router } from "express";
import { AuthRoutes } from "../app/modules/auth/auth.route";
import { CategoryRoutes } from "../app/modules/category/category.route";
import { IdeaRoutes } from "../app/modules/idea/idea.route";
import { VoteRoutes } from "../app/modules/vote/vote.route";
import { CommentRoutes } from "../app/modules/comment/comment.route";

const router: Router = Router();

router.use("/auth", AuthRoutes);

router.use("/categories", CategoryRoutes);

router.use("/ideas", IdeaRoutes);

router.use("/votes", VoteRoutes);

router.use("/comments", CommentRoutes);

export { router as IndexRoutes };
