import { sign } from "jsonwebtoken";
import { createHash } from "crypto";
import pool from "../config/db.js";

const handelrefresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

  const hashedrefreshToken = createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const result = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token_hash = $1 AND expires_at > NOW()",
    [hashedrefreshToken],
  );

  const stored = result.rows[0];
  if (!stored) return res.status(401).json({ error: "Invalid or expired refresh token" });

  const accessToken = sign(
    { userId: stored.user_id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
  res.status(200).json({ accessToken });
};

export { handelrefresh };
