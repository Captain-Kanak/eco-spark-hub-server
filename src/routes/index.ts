import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route.js";
import { UserRouter } from "../modules/user/user.route.js";
import { CategoryRouter } from "../modules/category/category.route.js";
import { IdeaRouter } from "../modules/idea/idea.route.js";
import { LikeRouter } from "../modules/like/like.route.js";
import { CommentRoutes } from "../modules/comment/comment.route.js";
import { DonationRouter } from "../modules/donation/donation.route.js";

const router: Router = Router();

router.use("/auth", AuthRouter);

router.use("/users", UserRouter);

router.use("/categories", CategoryRouter);

router.use("/ideas", IdeaRouter);

router.use("/donations", DonationRouter);

router.use("/likes", LikeRouter);

router.use("/comments", CommentRoutes);

export { router as IndexRouter };
