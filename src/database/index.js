import User from "./models/users.js";
import Appointment from "./models/appointment.js";
import Notification from "./models/notifications.js";
import DoctorAvailability from "./models/doctoravailability.js";

User.hasMany(Appointment, {
  foreignKey: "patient_id",
  as: "patientAppointments",
});
User.hasMany(Appointment, {
  foreignKey: "doctor_id",
  as: "doctorAppointments",
});
Appointment.belongsTo(User, {
  foreignKey: "patient_id",
  as: "patient",
});
Appointment.belongsTo(User, {
  foreignKey: "doctor_id",
  as: "doctor",
});

User.hasMany(Notification, {
  foreignKey: "user_id",
  as: "notifications",
});
Notification.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(DoctorAvailability, {
  foreignKey: "doctor_id",
  as: "availabilities",
});
DoctorAvailability.belongsTo(User, {
  foreignKey: "doctor_id",
  as: "doctor",
});

DoctorAvailability.hasMany(Appointment, {
  foreignKey: "availability_id",
  as: "appointments",
});
Appointment.belongsTo(DoctorAvailability, {
  foreignKey: "availability_id",
  as: "availability",
});

export { User, Appointment, Notification, DoctorAvailability };
