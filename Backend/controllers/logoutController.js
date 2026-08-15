import crypto from "crypto";
import pool from "../config/db.js";

const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      const hashedrefreshToken = crypto.createHash("sha256")
        .update(refreshToken)
        .digest("hex");
      await pool.query("DELETE FROM refresh_tokens WHERE token_hash = $1", [
        hashedrefreshToken,
      ]);
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { logoutUser };
