import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    related_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(
        "appointment_request",
        "appointment_cancelled",
        "general"
      ),
      allowNull: false,
      defaultValue: "general",
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "created_at",
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "notifications",
    underscored: true,
    timestamps: false,
  }
);

export default Notification;
