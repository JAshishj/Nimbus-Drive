import { createHash } from "crypto";
import pool from "../config/db.js";

const logoutUser = async (req, res) => {
  const refreshToken = req.cookie.refreshToken;
  if (refreshToken) {
    const hashedrefreshToken = createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    await pool.query("DELETE FROM refresh_tokens WHERE token_hash = $1", [
      hashedrefreshToken,
    ]);
  }
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out" });
};

export { logoutUser };
