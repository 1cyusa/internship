import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Appointment = sequelize.define(
  "Appointment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    availability_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    appointment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    appointment_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancellation_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "created_at",
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "accepted",
        "rejected",
        "scheduled",
        "completed",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "scheduled",
    },
  },
  {
    tableName: "appointments",
    underscored: true,
    timestamps: false,
  }
);

export default Appointment;
