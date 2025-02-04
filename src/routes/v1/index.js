import { Router } from "express";
import healthRoutes from "./health.js";
import authRoutes from "./auth.js";
import eventRoutes from "./event.js";
import bookingRoutes from "./booking.js";
import swaggerRouter from "../../config/swagger.js";

const router = Router();

router.use("/docs", swaggerRouter);
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/event", eventRoutes);
router.use("/booking", bookingRoutes);

export default router;
