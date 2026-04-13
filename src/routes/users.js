import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
} from "../controller/user.js";
import { allowRoles, requireActor } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", requireActor, allowRoles("admin"), getAllUsers);
router.get("/:id", requireActor, getSingleUser);
router.put("/:id", requireActor, updateUser);
router.delete("/:id", requireActor, allowRoles("admin"), deleteUser);

export default router;
