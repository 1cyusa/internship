import { DoctorAvailability, User } from "../database/index.js";

const canManageAvailability = (actor, availability) =>
  actor.role === "admin" || actor.id === availability.doctor_id;

export const createAvailability = async (req, res) => {
  try {
    const doctorId =
      req.actor.role === "doctor" ? req.actor.id : req.body.doctor_id;
    const { date, start_time, end_time, is_available = true } = req.body;

    if (!doctorId || !date || !start_time || !end_time) {
      return res.status(400).json({
        message: "doctor_id, date, start_time and end_time are required",
      });
    }

    const doctor = await User.findByPk(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const availability = await DoctorAvailability.create({
      doctor_id: doctorId,
      date,
      start_time,
      end_time,
      is_available,
    });

    res.status(201).json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAvailabilities = async (req, res) => {
  try {
    const where = req.actor.role === "doctor" ? { doctor_id: req.actor.id } : {};
    const availabilities = await DoctorAvailability.findAll({
      where,
      order: [
        ["date", "ASC"],
        ["start_time", "ASC"],
      ],
    });

    res.status(200).json(availabilities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (req.actor.role === "doctor" && req.actor.id !== doctorId) {
      return res.status(403).json({ message: "Doctors can only view their own availability" });
    }

    const availability = await DoctorAvailability.findAll({
      where: { doctor_id: doctorId },
      order: [
        ["date", "ASC"],
        ["start_time", "ASC"],
      ],
    });

    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailabilityById = async (req, res) => {
  try {
    const availability = await DoctorAvailability.findByPk(req.params.id);

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    if (!canManageAvailability(req.actor, availability) && req.actor.role !== "patient") {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const availability = await DoctorAvailability.findByPk(req.params.id);

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    if (!canManageAvailability(req.actor, availability)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) =>
        ["date", "start_time", "end_time", "is_available"].includes(key)
      )
    );

    await availability.update(updates);
    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAvailability = async (req, res) => {
  try {
    const availability = await DoctorAvailability.findByPk(req.params.id);

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    if (!canManageAvailability(req.actor, availability)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await availability.destroy();
    res.status(200).json({ message: "Availability deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
