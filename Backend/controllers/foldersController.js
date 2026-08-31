import pool from "../config/db.js";
import r2 from "../config/r2.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const getAllFolders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const parentFolderId = req.query.parentFolderId || null;
    const validParentFolderId =
      parentFolderId &&
      parentFolderId !== "null" &&
      parentFolderId !== "undefined"
        ? parentFolderId
        : null;
    const result = await pool.query(
      `SELECT fo.*, (s.id IS NOT NULL) AS starred
      FROM folders fo
      LEFT JOIN stars s ON fo.id = s.folder_id AND s.user_id = $1
      WHERE fo.owner_id = $1 AND fo.parent_folder_id IS NOT DISTINCT FROM $2
      ORDER BY fo.created_at DESC`,
      [userId, validParentFolderId],
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch folders" });
  }
};

const createFolder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, parentFolderId } = req.body;
    const result = await pool.query(
      "INSERT INTO folders (name, parent_folder_id, owner_id) VALUES ($1, $2, $3) RETURNING *",
      [name, parentFolderId, userId],
    );
    res.status(201).json({ message: "Folder created" });
  } catch (error) {
    console.error("Folder creation error:", error);
    res.status(500).json({ error: "Failed to create folder" });
  }
};

const deleteFolder = async (req, res) => {
  const userId = req.user.userId;
  const folderId = req.params.id;
  try {
    const filesResult = await pool.query(
      `WITH RECURSIVE subfolders AS (
                SELECT id FROM folders WHERE id=$1 AND owner_id=$2
                UNION ALL
                SELECT f.id FROM folders f
                INNER JOIN subfolders s ON f.parent_folder_id = s.id
                WHERE f.owner_id=$2
            )
            SELECT path FROM files WHERE folder_id IN (SELECT id FROM subfolders)`,
      [folderId, userId],
    );
    if (filesResult.rows.length > 0) {
      for (const file of filesResult.rows) {
        await r2.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: file.path,
          }),
        );
      }
    }

    const result = await pool.query(
      "DELETE FROM folders WHERE id = $1 AND owner_id = $2 RETURNING *",
      [folderId, userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Folder not found" });
    }
    res.status(200).json({ message: "Folder deleted" });
  } catch (error) {
    console.error("Folder deletion error:", error);
    res.status(500).json({ error: "Failed to delete folder" });
  }
};

const renameFolder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const id = req.params.id;
    const { name } = req.body;
    const result = await pool.query(
      "UPDATE folders SET name = $1 WHERE id = $2 AND owner_id = $3 RETURNING *",
      [name, id, userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Folder not found" });
    }
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Folder rename error:", error);
    res.status(500).json({ error: "Failed to rename folder" });
  }
};

export { getAllFolders, createFolder, deleteFolder, renameFolder };
