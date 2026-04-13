import Appointment from "../models/appointments.js";
import User from "../models/users.js";

export const seedAppointments = async () => {
    const patients = await User.findAll({ where: { role: 'patient' } });
    const doctors = await User.findAll({ where: { role: 'doctor' } });
    
    if (patients.length === 0 || doctors.length === 0) return;

    const appointments = [
        {
            patientId: patients[0].id,
            doctorId: doctors[0].id,
            appointmentDate: new Date('2024-12-20 10:00:00'),
            reason: 'Regular checkup',
            status: 'confirmed'
        },
        {
            patientId: patients[1]?.id || patients[0].id,
            doctorId: doctors[0].id,
            appointmentDate: new Date('2024-12-21 14:00:00'),
            reason: 'Follow-up consultation',
            status: 'pending'
        }
    ];

    await Appointment.bulkCreate(appointments, { ignoreDuplicates: true });
};