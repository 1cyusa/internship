import express from "express";
import {
  cancelAppointment,
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  getAppointments,
  getDoctorAppointments,
  updateAppointment,
} from "../controller/appointments.js";
import { allowRoles, requireActor } from "../middleware/auth.js";

const router = express.Router();

router.use(requireActor);

router.get("/", allowRoles("admin", "doctor", "patient"), getAppointments);
router.get("/doctor/:doctorId", allowRoles("admin", "doctor"), getDoctorAppointments);
router.get("/:id", allowRoles("admin", "doctor", "patient"), getAppointmentById);
router.post("/", allowRoles("admin", "patient"), createAppointment);
router.put("/:id", allowRoles("admin", "doctor", "patient"), updateAppointment);
router.patch("/:id/cancel", allowRoles("admin", "doctor"), cancelAppointment);
router.delete("/:id", allowRoles("admin"), deleteAppointment);

export default router;
