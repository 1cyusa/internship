import express from "express";
import "dotenv/config";
import sequelize from "src/config/db.js"
const app = express();
const PORT = process.env.PORT || 5000;


sequelize.authenticate()
.then(() => sequelize.sync())
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Your database is running🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥`);
    });
})
.catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
});
