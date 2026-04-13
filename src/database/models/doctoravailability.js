import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const DoctorAvailability = sequelize.define(
  "DoctorAvailability",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "available_date",
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "doctor_availability",
    underscored: true,
    timestamps: false,
  }
);

export default DoctorAvailability;
