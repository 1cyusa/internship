import Notification from "../database/models/notifications.js";

const canAccessNotification = (actor, notification) =>
  actor.role === "admin" || actor.id === notification.user_id;

export const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create({
      user_id: req.body.user_id,
      related_user_id: req.body.related_user_id,
      appointment_id: req.body.appointment_id,
      type: req.body.type || "general",
      message: req.body.message,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const where = req.actor.role === "admin" ? {} : { user_id: req.actor.id };
    const notifications = await Notification.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.actor.role !== "admin" && req.actor.id !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (!canAccessNotification(req.actor, notification)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (!canAccessNotification(req.actor, notification)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await notification.update({
      message: req.body.message ?? notification.message,
      type: req.body.type ?? notification.type,
      is_read:
        typeof req.body.is_read === "boolean"
          ? req.body.is_read
          : notification.is_read,
    });

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (!canAccessNotification(req.actor, notification)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await notification.update({ is_read: true });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (!canAccessNotification(req.actor, notification)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await notification.destroy();
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
