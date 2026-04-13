import express from "express";
import authRoutes from "./auth.js";
import userRoutes from "./users.js";
import appointmentRoutes from "./appointments.js";
import notificationRoutes from "./notifications.js";
import doctorAvailabilityRoutes from "./doctorAvailability.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/doctor-availabilities", doctorAvailabilityRoutes);

export default router;
