import sequelize from "../config/db.js";
import { formatDatabaseConnectionError } from "../config/db.js";
import "../database/index.js";
import { createUserTable } from "../database/migrations/users.js";
import { seedUsers } from "../database/seeds/users.js";

const syncDatabase = async () => {
  try {
    console.log("Starting database sync...");
    await sequelize.authenticate();
    console.log("Database connection established successfully");
    await createUserTable();
    await sequelize.sync({ alter: true, logging: false });
    await seedUsers();
    console.log("Database synced successfully");
    process.exit(0);
  } catch (error) {
    console.error(formatDatabaseConnectionError(error));
    process.exit(1);
  }
};

syncDatabase();
