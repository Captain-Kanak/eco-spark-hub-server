import { Router } from "express";
import { AuthRoutes } from "../app/modules/auth/auth.route";
import { CategoryRoutes } from "../app/modules/category/category.route";
import { IdeaRoutes } from "../app/modules/idea/idea.route";

const router: Router = Router();

router.use("/auth", AuthRoutes);

router.use("/categories", CategoryRoutes);

router.use("/ideas", IdeaRoutes);

export { router as IndexRoutes };
