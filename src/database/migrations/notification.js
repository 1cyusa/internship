import Notification from "../models/notifications.js";

export const createNotificationsTable = async () => {
    await Notification.sync({ alter: true, logging: false });
    console.log("Notifications table created or updated successfully 🔥");
};