import express from "express";
import {
  createAvailability,
  deleteAvailability,
  getAllAvailabilities,
  getAvailabilityById,
  getDoctorAvailability,
  updateAvailability,
} from "../controller/doctorsAvailability.js";
import { allowRoles, requireActor } from "../middleware/auth.js";

const router = express.Router();

router.use(requireActor);

router.get("/", allowRoles("admin", "doctor"), getAllAvailabilities);
router.get("/doctor/:doctorId", allowRoles("admin", "doctor", "patient"), getDoctorAvailability);
router.get("/:id", allowRoles("admin", "doctor", "patient"), getAvailabilityById);
router.post("/", allowRoles("admin", "doctor"), createAvailability);
router.put("/:id", allowRoles("admin", "doctor"), updateAvailability);
router.delete("/:id", allowRoles("admin", "doctor"), deleteAvailability);

export default router;
