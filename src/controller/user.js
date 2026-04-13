import bcrypt from "bcrypt";
import User from "../database/models/users.js";

const sanitizeUser = (user) => {
  const values = user.toJSON();
  delete values.password;
  return values;
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json(users.map(sanitizeUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.actor.role !== "admin" && req.actor.id !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { password, ...userData } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const existingUser = await User.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const newUser = await User.create({
      ...userData,
      password: await bcrypt.hash(password, 10),
    });

    res.status(201).json(sanitizeUser(newUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.actor.role !== "admin" && req.actor.id !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { password, role, ...userData } = req.body;
    const updates = { ...userData };

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    if (req.actor.role === "admin" && role) {
      updates.role = role;
    }

    await user.update(updates);

    res.status(200).json({
      message: "User updated successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
