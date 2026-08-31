import pool from "../config/db.js";

const share = async (req, res) => {
  const userId = req.user.userId;
  const { fileId, folderId, targetEmail, permission } = req.body;

  if ((!fileId && !folderId) || !targetEmail || !permission) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const normalizedTargetEmail = targetEmail.toLowerCase().trim();
    const targetId = await pool.query("SELECT id FROM users WHERE email = $1", [
      normalizedTargetEmail,
    ]);
    if (targetId.rows.length == 0)
      return res.status(404).json({ message: "User not found" });
    else if (userId == targetId.rows[0].id)
      return res
        .status(400)
        .json({ message: "You cannot share file with yourself" });

    if (fileId != null) {
      const file = await pool.query(
        "SELECT owner_id FROM files WHERE id = $1",
        [fileId],
      );
      if (file.rows.length == 0)
        return res.status(404).json({ message: "File not found" });
      else if (file.rows[0].owner_id != userId)
        return res
          .status(400)
          .json({ message: "You are not the owner of the file" });

      await pool.query(
        `INSERT INTO shares (file_id, shared_with_user_id, shared_by_user_id, permission) VALUES ($1, $2, $3, $4) 
        ON CONFLICT (file_id, shared_with_user_id) 
        DO UPDATE SET permission = EXCLUDED.permission, shared_by_user_id = EXCLUDED.shared_by_user_id`,
        [fileId, targetId.rows[0].id, userId, permission],
      );
    } else if (folderId != null) {
      const folder = await pool.query(
        "SELECT owner_id FROM folders WHERE id = $1",
        [folderId],
      );
      if (folder.rows.length == 0)
        return res.status(404).json({ message: "Folder not found" });
      else if (folder.rows[0].owner_id != userId)
        return res
          .status(400)
          .json({ message: "You are not the owner of the folder" });

      await pool.query(
        `INSERT INTO shares (folder_id, shared_with_user_id, shared_by_user_id, permission) VALUES ($1, $2, $3, $4) 
        ON CONFLICT (folder_id, shared_with_user_id) 
        DO UPDATE SET permission = EXCLUDED.permission, shared_by_user_id = EXCLUDED.shared_by_user_id`,
        [folderId, targetId.rows[0].id, userId, permission],
      );
    }

    return res.status(201).json({ message: "Shared successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllShared = async (req, res) => {
  const userId = req.user.userId;

  try {
    const shares = await pool.query(
      "SELECT * FROM shares WHERE shared_with_user_id = $1",
      [userId],
    );
    if (shares.rows.length == 0) return res.status(200).json({ shared: [] });

    const fileIds = shares.rows.map((share) => share.file_id);
    const folderIds = shares.rows.map((share) => share.folder_id);

    const files = await pool.query("SELECT * FROM files WHERE id = ANY($1)", [
      fileIds,
    ]);
    const folders = await pool.query(
      "SELECT * FROM folders WHERE id = ANY($1)",
      [folderIds],
    );

    const sharedItems = shares.rows.map((share) => {
      const file = files.rows.find((file) => file.id === share.file_id);
      const folder = folders.rows.find(
        (folder) => folder.id === share.folder_id,
      );
      return {
        ...folder,
        ...file,
        permission: share.permission,
        sharedBy: share.shared_by_user_id,
      };
    });
    return res.status(200).json({ shared: sharedItems });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { share, getAllShared };
