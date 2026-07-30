import { Router } from "express";
import { likeController } from "./like.controller.js";
import { UserRole } from "@prisma/client";
import { authMiddleware } from "../../middlewares/auth-middleware.js";

const router: Router = Router();

router.post("/:ideaId", authMiddleware(), likeController.likeHandler);

export { router as LikeRouter };
