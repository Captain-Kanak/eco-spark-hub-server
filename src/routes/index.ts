import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route.js";
import { UserRouter } from "../modules/user/user.route.js";
import { CategoryRouter } from "../modules/category/category.route.js";
import { IdeaRouter } from "../modules/idea/idea.route.js";
import { VoteRoutes } from "../modules/vote/vote.route.js";
import { CommentRoutes } from "../modules/comment/comment.route.js";
import { PaymentRoutes } from "../modules/payment/payment.route.js";

const router: Router = Router();

router.use("/auth", AuthRouter);

router.use("/users", UserRouter);

router.use("/categories", CategoryRouter);

router.use("/ideas", IdeaRouter);

router.use("/donations", PaymentRoutes);

router.use("/likes", VoteRoutes);

router.use("/comments", CommentRoutes);

export { router as IndexRouter };
