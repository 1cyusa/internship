import Notification from "../models/notifications.js";
import User from "../models/users.js";

export const seedNotifications = async () => {
    const users = await User.findAll({ limit: 2 });
    if (users.length === 0) return;

    const notifications = [
        {
            userId: users[0].id,
            title: 'Welcome',
            message: 'Welcome to the healthcare system',
            type: 'general',
            isRead: false
        },
        {
            userId: users[1]?.id || users[0].id,
            title: 'Appointment Reminder',
            message: 'You have an upcoming appointment',
            type: 'appointment',
            isRead: false
        }
    ];

    await Notification.bulkCreate(notifications, { ignoreDuplicates: true });
};