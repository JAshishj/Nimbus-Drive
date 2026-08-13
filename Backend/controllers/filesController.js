import pool from "../config/db";
import { unlink } from "fs/promises";
import { resolve } from "path";

const getAllFiles = async (req, res) => {
  try {
    const userId = req.user.userId;
    const folderId = req.query.folderId || null;
    const validFolderId =
      folderId && folderId !== "null" && folderId !== "undefined"
        ? folderId
        : null;

    const result = await pool.query(
      `SELECT * FROM files WHERE user_id = $1 AND parent_folder_id IS NOT DISTINCT FROM $2 ORDER BY created_at DESC`,
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
      "SELECT * FROM files WHERE id = $1 AND user_id = $2",
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
    const { originalname, mimetype, size, path } = req.file;
/*const { originalname, mimetype, size, key } = req.file; */
    const result = await pool.query(
      "INSERT INTO files (name, path, size, mime_type, owner_id, parent_folder_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [originalname, path, size, mimetype, userId, folderId],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to upload file" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const id = req.params.id;

    const result = await pool.query(
      "SELECT * FROM files WHERE id = $1 AND user_id = $2",
      [id, userId],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "File not found" });

    const file = result.rows[0];
    if (file.path) {
      await unlink(file.path);
    }

    await pool.query("DELETE FROM files WHERE id = $1", [id]);
    return res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete file" });
  }
};

const viewFile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const id = req.params.id;

    const result = await pool.query(
      "SELECT * FROM files WHERE id = $1 AND user_id = $2",
      [id, userId],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "File not found" });

    const file = result.rows[0];

    res.setHeader("Content-Type", file.mime_type || "application/octet-stream");
    res.setHeader("Content-Disposition", `inline; filename="${file.name}"`);
    res.sendFile(resolve(file.path));
  } catch (error) {
    res.status(500).json({ error: "Failed to view file" });
  }
};

export { getAllFiles, getFile, uploadFile, deleteFile, viewFile };
