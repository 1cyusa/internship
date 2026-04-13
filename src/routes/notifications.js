import express from "express";
import {
  createNotification,
  deleteNotification,
  getNotificationById,
  getNotifications,
  getUserNotifications,
  markAsRead,
  updateNotification,
} from "../controller/notifications.js";
import { allowRoles, requireActor } from "../middleware/auth.js";

const router = express.Router();

router.use(requireActor);

router.get("/", allowRoles("admin", "doctor", "patient"), getNotifications);
router.get("/user/:userId", allowRoles("admin", "doctor", "patient"), getUserNotifications);
router.get("/:id", allowRoles("admin", "doctor", "patient"), getNotificationById);
router.post("/", allowRoles("admin"), createNotification);
router.put("/:id", allowRoles("admin", "doctor", "patient"), updateNotification);
router.patch("/:id/read", allowRoles("admin", "doctor", "patient"), markAsRead);
router.delete("/:id", allowRoles("admin", "doctor", "patient"), deleteNotification);

export default router;
