import express from "express";

const router = express.Router();

router.get("/me", (req, res) => {
  if (!req.actor?.role) {
    return res.status(401).json({
      message: "Provide x-user-id or x-user-role headers to identify the current actor",
    });
  }

  res.status(200).json(req.actor);
});

export default router;
