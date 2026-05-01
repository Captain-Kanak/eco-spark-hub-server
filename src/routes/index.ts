import { Router } from "express";
import { AuthRoutes } from "../app/modules/auth/auth.route.js";
import { CategoryRoutes } from "../app/modules/category/category.route.js";
import { IdeaRoutes } from "../app/modules/idea/idea.route.js";
import { VoteRoutes } from "../app/modules/vote/vote.route.js";
import { CommentRoutes } from "../app/modules/comment/comment.route.js";
import { PaymentRoutes } from "../app/modules/payment/payment.route.js";
import { UserRoutes } from "../app/modules/user/user.route.js";

const router: Router = Router();

router.use("/auth", AuthRoutes);

router.use("/categories", CategoryRoutes);

router.use("/ideas", IdeaRoutes);

router.use("/payments", PaymentRoutes);

router.use("/users", UserRoutes);

router.use("/votes", VoteRoutes);

router.use("/comments", CommentRoutes);

export { router as IndexRoutes };
