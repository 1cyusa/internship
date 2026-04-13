import Notification from "../database/models/notifications.js";

export const createSystemNotification = async ({
  userId,
  relatedUserId = null,
  appointmentId = null,
  type = "general",
  message,
}) =>
  Notification.create({
    user_id: userId,
    related_user_id: relatedUserId,
    appointment_id: appointmentId,
    type,
    message,
  });
