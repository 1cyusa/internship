import express from "express";
import "dotenv/config";
import sequelize from "./src/config/db.js";
import { formatDatabaseConnectionError } from "./src/config/db.js";
import "./src/database/index.js";
import routes from "./src/routes/index.js";
import { attachActor } from "./src/middleware/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(attachActor);

app.get("/", (req, res) => {
  res.json({ message: "SOS API is running" });
});

app.use("/api", routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Internal server error" });
});

sequelize
  .authenticate()
  .then(() => sequelize.sync({ alter: true, logging: false }))
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log("Database connection is running.");
    });
  })
  .catch((err) => {
    console.error(formatDatabaseConnectionError(err));
    process.exit(1);
  });
