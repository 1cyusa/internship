import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    logging: false,
  }
);

const getDatabaseLabel = () =>
  `${process.env.DB_USER || "unknown-user"}@${
    process.env.DB_HOST || "localhost"
  }:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || "unknown-db"}`;

export const formatDatabaseConnectionError = (error) => {
  const isConnectionRefused =
    error?.name === "SequelizeConnectionRefusedError" ||
    error?.original?.code === "ECONNREFUSED";

  if (isConnectionRefused) {
    return [
      `Unable to connect to MySQL at ${getDatabaseLabel()}.`,
      "The database server is refusing connections.",
      "Make sure MySQL is running and that your .env host/port values are correct.",
    ].join(" ");
  }

  return `Unable to connect to MySQL at ${getDatabaseLabel()}: ${
    error?.message || "Unknown database error"
  }`;
};

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database connection established for ${getDatabaseLabel()}`);
    return {
      success: true,
      message: "Connection to the database was successful",
    };
  } catch (error) {
    console.error(formatDatabaseConnectionError(error));
    return { success: false, message: "Connection failed" };
  }
};

export default sequelize;
