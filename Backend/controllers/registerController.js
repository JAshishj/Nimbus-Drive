import { hash } from "bcryptjs";
import pool from "../config/db.js";

const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long" });
  } else if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {

    const hashedpassword = await hash(password, 10);
    const normalizedemail = email.toLowerCase().trim();
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id, name, email',
      [name, normalizedemail, hashedpassword],
    );
    return res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { registerUser };
