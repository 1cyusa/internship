import User from "../database/models/users.js";

const validRoles = new Set(["patient", "doctor", "admin"]);

export const attachActor = async (req, res, next) => {
  try {
    const actorId = req.header("x-user-id");
    const actorRole = req.header("x-user-role");

    if (actorId) {
      const user = await User.findByPk(actorId);

      if (!user) {
        return res.status(401).json({ message: "Invalid x-user-id header" });
      }

      req.actor = {
        id: user.id,
        role: user.role,
        user,
      };
      return next();
    }

    if (actorRole && validRoles.has(actorRole)) {
      req.actor = {
        id: null,
        role: actorRole,
      };
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireActor = (req, res, next) => {
  if (!req.actor?.role) {
    return res.status(401).json({
      message: "Provide x-user-id or x-user-role headers to access this route",
    });
  }

  next();
};

export const allowRoles = (...roles) => (req, res, next) => {
  if (!req.actor?.role) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!roles.includes(req.actor.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};
