import pool from "../config/db.js";

const Star = async (req, res) => {
  const userId = req.user.userId;
  const { fileId, folderId } = req.body;
  try {
    if (fileId) {
        await pool.query(
          "INSERT INTO stars (file_id,user_id) VALUES($1,$2) ON CONFLICT (user_id, file_id, folder_id) DO NOTHING",
          [fileId, userId],
        );
    } else if (folderId) {
        await pool.query(
          "INSERT INTO stars (folder_id,user_id) VALUES($1,$2) ON CONFLICT (user_id, file_id, folder_id) DO NOTHING",
          [folderId, userId],
        );
    }
    res.status(201).json({ message: "Star toggled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error toggling star" });
  }
};

const unStar = async (req,res)=>{
    const userId = req.user.userId;
    const { fileId, folderId } = req.body;
    try {
        if (fileId) {
            await pool.query(
                "DELETE FROM stars WHERE file_id = $1 AND user_id = $2",
                [fileId, userId],
            );
        } else if (folderId) {
            await pool.query(
                "DELETE FROM stars WHERE folder_id = $1 AND user_id = $2",
                [folderId, userId],
            );
        }
        res.status(200).json({ message: "Star toggled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error toggling star" });
    }
};

const getAllStarred = async (req, res) => {
  const userId = req.user.userId;
  try {
    const starredFiles = await pool.query(
      "SELECT f.*, 'file' AS type FROM stars s JOIN files f ON f.id = s.file_id WHERE s.user_id = $1",
      [userId],
    );
    const starredFolders = await pool.query(
      "SELECT fo.*, 'folder' AS type FROM stars s JOIN folders fo ON fo.id = s.folder_id WHERE s.user_id = $1",
      [userId],
    );
    res.status(200).json({
      starredFolders: starredFolders.rows,
      starredFiles: starredFiles.rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting starred items" });
  }
};

export { Star, unStar, getAllStarred };
