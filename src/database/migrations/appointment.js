import Appointment from "../models/appointments.js";

export const createAppointmentsTable = async () => {
    await Appointment.sync({ alter: true, logging: false });
    console.log("Appointments table created or updated successfully 🔥");
};