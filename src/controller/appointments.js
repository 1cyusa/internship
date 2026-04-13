import { Op } from "sequelize";
import { Appointment, DoctorAvailability, User } from "../database/index.js";
import { createSystemNotification } from "../utils/notifications.js";

const appointmentIncludes = [
  { model: User, as: "patient", attributes: { exclude: ["password"] } },
  { model: User, as: "doctor", attributes: { exclude: ["password"] } },
  { model: DoctorAvailability, as: "availability" },
];

const ensureDoctorAndPatient = async (doctorId, patientId) => {
  const [doctor, patient] = await Promise.all([
    User.findByPk(doctorId),
    User.findByPk(patientId),
  ]);

  if (!doctor || doctor.role !== "doctor") {
    return { error: "Doctor not found" };
  }

  if (!patient || patient.role !== "patient") {
    return { error: "Patient not found" };
  }

  return { doctor, patient };
};

const canAccessAppointment = (actor, appointment) => {
  if (actor.role === "admin") {
    return true;
  }

  if (actor.role === "doctor") {
    return actor.id === appointment.doctor_id;
  }

  if (actor.role === "patient") {
    return actor.id === appointment.patient_id;
  }

  return false;
};

export const createAppointment = async (req, res) => {
  try {
    const patientId =
      req.actor.role === "patient" ? req.actor.id : req.body.patient_id;
    const { doctor_id, appointment_date, appointment_time, reason, notes } =
      req.body;

    if (!patientId || !doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({
        message:
          "patient_id, doctor_id, appointment_date and appointment_time are required",
      });
    }

    const { doctor, patient, error } = await ensureDoctorAndPatient(
      doctor_id,
      patientId
    );

    if (error) {
      return res.status(404).json({ message: error });
    }

    const availability = await DoctorAvailability.findOne({
      where: {
        doctor_id,
        date: appointment_date,
        start_time: appointment_time,
        is_available: true,
      },
    });

    if (!availability) {
      return res.status(400).json({
        message: "Doctor is not available for the selected date and time",
      });
    }

    const existingAppointment = await Appointment.findOne({
      where: {
        doctor_id,
        appointment_date,
        appointment_time,
        status: {
          [Op.ne]: "cancelled",
        },
      },
    });

    if (existingAppointment) {
      return res.status(409).json({ message: "This time slot is already booked" });
    }

    const appointment = await Appointment.create({
      patient_id: patient.id,
      doctor_id: doctor.id,
      availability_id: availability.id,
      appointment_date,
      appointment_time,
      reason,
      notes,
      status: "scheduled",
    });

    await availability.update({ is_available: false });

    await createSystemNotification({
      userId: doctor.id,
      relatedUserId: patient.id,
      appointmentId: appointment.id,
      type: "appointment_request",
      message: `New appointment request from ${patient.fullName} on ${appointment_date} at ${appointment_time}.`,
    });

    const createdAppointment = await Appointment.findByPk(appointment.id, {
      include: appointmentIncludes,
    });

    res.status(201).json(createdAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const where = {};

    if (req.actor.role === "doctor") {
      where.doctor_id = req.actor.id;
    }

    if (req.actor.role === "patient") {
      where.patient_id = req.actor.id;
    }

    const appointments = await Appointment.findAll({
      where,
      include: appointmentIncludes,
      order: [
        ["appointment_date", "ASC"],
        ["appointment_time", "ASC"],
      ],
    });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: appointmentIncludes,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!canAccessAppointment(req.actor, appointment)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (req.actor.role === "doctor" && req.actor.id !== doctorId) {
      return res.status(403).json({ message: "Doctors can only view their own appointments" });
    }

    const appointments = await Appointment.findAll({
      where: { doctor_id: doctorId },
      include: appointmentIncludes,
      order: [
        ["appointment_date", "ASC"],
        ["appointment_time", "ASC"],
      ],
    });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!canAccessAppointment(req.actor, appointment)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const allowedUpdates =
      req.actor.role === "admin"
        ? [
            "appointment_date",
            "appointment_time",
            "reason",
            "notes",
            "status",
            "cancellation_reason",
          ]
        : ["reason", "notes"];

    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedUpdates.includes(key))
    );

    await appointment.update(updates);

    const updatedAppointment = await Appointment.findByPk(appointment.id, {
      include: appointmentIncludes,
    });

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: appointmentIncludes,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const isAdmin = req.actor.role === "admin";
    const isAssignedDoctor =
      req.actor.role === "doctor" && req.actor.id === appointment.doctor_id;

    if (!isAdmin && !isAssignedDoctor) {
      return res.status(403).json({
        message: "Only the assigned doctor or admin can cancel this appointment",
      });
    }

    const { cancellation_reason } = req.body;

    if (!cancellation_reason) {
      return res.status(400).json({
        message: "cancellation_reason is required when cancelling an appointment",
      });
    }

    await appointment.update({
      status: "cancelled",
      cancellation_reason,
    });

    if (appointment.availability_id) {
      const availability = await DoctorAvailability.findByPk(
        appointment.availability_id
      );

      if (availability) {
        await availability.update({ is_available: true });
      }
    }

    await createSystemNotification({
      userId: appointment.patient_id,
      relatedUserId: appointment.doctor_id,
      appointmentId: appointment.id,
      type: "appointment_cancelled",
      message: `Your appointment on ${appointment.appointment_date} at ${appointment.appointment_time} was cancelled. Reason: ${cancellation_reason}`,
    });

    const cancelledAppointment = await Appointment.findByPk(appointment.id, {
      include: appointmentIncludes,
    });

    res.status(200).json(cancelledAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.availability_id) {
      const availability = await DoctorAvailability.findByPk(
        appointment.availability_id
      );

      if (availability) {
        await availability.update({ is_available: true });
      }
    }

    await appointment.destroy();
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
