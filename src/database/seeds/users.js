import bcrypt from "bcrypt";
import User from "../models/users.js";

export const seedUsers = async () => {
  try {
    const existingUsers = await User.count();
    if (existingUsers > 0) {
      console.log("Users already exist, skipping seed");
      return;
    }

    const hashPassword = await bcrypt.hash("defaultPassword123", 10);
    const users = [
      {
        fullName: "SHEMA",
        email: "shema@gmail.com",
        phoneNumber: "038373737373",
        gender: "male",
        role: "patient",
        status: "active",
        date_of_birth: "12-02-2005",
        location: "muhanga",
        emergency_contact: "02933838383",
        password: hashPassword,
      },
      {
        fullName: "ILONA",
        email: "ilona@gmail.com",
        phoneNumber: "038345678677373",
        gender: "female",
        role: "patient",
        status: "active",
        date_of_birth: "12-02-2006",
        location: "kigali",
        emergency_contact: "02936638383",
        password: hashPassword,
      },
    ];

    await User.bulkCreate(users);
    console.log("Users seeded successfully");
  } catch (error) {
    console.error("Seed failed:", error.message);
  }
};
