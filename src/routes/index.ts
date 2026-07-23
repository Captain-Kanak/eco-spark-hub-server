import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route.js";
import { UserRoutes } from "../modules/user/user.route.js";
import { CategoryRoutes } from "../modules/category/category.route.js";
import { IdeaRoutes } from "../modules/idea/idea.route.js";
import { VoteRoutes } from "../modules/vote/vote.route.js";
import { CommentRoutes } from "../modules/comment/comment.route.js";
import { PaymentRoutes } from "../modules/payment/payment.route.js";

const router: Router = Router();

router.use("/auth", AuthRouter);

router.use("/users", UserRoutes);

router.use("/categories", CategoryRoutes);

router.use("/ideas", IdeaRoutes);

router.use("/donations", PaymentRoutes);

router.use("/likes", VoteRoutes);

router.use("/comments", CommentRoutes);

export { router as IndexRouter };
