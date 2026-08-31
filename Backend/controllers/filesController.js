import pool from "../config/db.js";
import r2 from "../config/r2.js";
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const getAllFiles = async (req, res) => {
  try {
    const userId = req.user.userId;
    const folderId = req.query.folderId || null;
    const validFolderId =
      folderId && folderId !== "null" && folderId !== "undefined"
        ? folderId
        : null;

    const result = await pool.query(
      `SELECT f.*, (s.id IS NOT NULL) AS starred
      FROM files f
      LEFT JOIN stars s ON f.id = s.file_id AND s.user_id = $1
      WHERE f.owner_id = $1 AND f.folder_id IS NOT DISTINCT FROM $2
      ORDER BY f.created_at DESC`,
      [userId, validFolderId],
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch files" });
  }
};

const getFile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const id = req.params.id;

    const result = await pool.query(
      "SELECT * FROM files WHERE id = $1 AND owner_id = $2",
      [id, userId],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "File not found" });

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch file" });
  }
};

const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const userId = req.user.userId;
    const folderId = req.body.folderId || null;
    // R2 uses key instead of path
    const { originalname, mimetype, size, key } = req.file;

    const result = await pool.query(
      "INSERT INTO files (name, path, size, mime_type, owner_id, folder_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [originalname, key, size, mimetype, userId, folderId],
    );
    return res.status(201).json({ message: "File uploaded" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const id = req.params.id;

    const result = await pool.query(
      "SELECT * FROM files WHERE id = $1 AND owner_id = $2",
      [id, userId],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "File not found" });

    const file = result.rows[0];
    if (file.path) {
      await r2.send(
        new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: file.path,
        }),
      );
    }

    await pool.query("DELETE FROM files WHERE id = $1 AND owner_id = $2", [
      id,
      userId,
    ]);
    return res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
};

const getFileUrl = async (req, res) => {
  try {
    const userId = req.user.userId;
    const id = req.params.id;
    const mode = req.query.mode;

    const result = await pool.query(
      "SELECT * FROM files WHERE id = $1 AND owner_id = $2",
      [id, userId],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "File not found" });

    const file = result.rows[0];

    const disposition =
      mode === "download" ? `attachment; filename="${file.name}"` : "inline";
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: file.path,
      ResponseContentDisposition: disposition,
      ResponseContentType: file.mime_type,
    });

    const url = await getSignedUrl(r2, command, { expiresIn: 300 });
    return res.status(200).json({ url });
  } catch (error) {
    console.error("View error:", error);
    res.status(500).json({ error: "Failed to view file" });
  }
};

const renameFile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const id = req.params.id;
    const { name } = req.body;

    const result = await pool.query(
      "UPDATE files SET name = $1 WHERE id = $2 AND owner_id = $3 RETURNING *",
      [name, id, userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Rename error:", error);
    res.status(500).json({ error: "Failed to rename file" });
  }
};

export { getAllFiles, getFile, uploadFile, deleteFile, getFileUrl, renameFile };
