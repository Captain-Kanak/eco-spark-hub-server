import { Router } from "express";
import { AuthRoutes } from "../app/modules/auth/auth.route";

const router: Router = Router();

//! /api/v1/auth
router.use("/auth", AuthRoutes);

export { router as IndexRoutes };
