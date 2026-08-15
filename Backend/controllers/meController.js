import pool from "../config/db.js";

const getMe = async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [userId],
    );
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error getting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { getMe };
