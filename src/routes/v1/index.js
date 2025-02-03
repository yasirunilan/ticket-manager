import { Router } from "express";
import healthRoutes from "./health.js";
import authRoutes from "./auth.js";
import eventRoutes from "./event.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/event", eventRoutes);

export default router;
