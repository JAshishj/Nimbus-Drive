import express from "express";
import {
  getAllFolders,
  createFolder,
  deleteFolder,
  renameFolder,
} from "../controllers/foldersController.js";

const router = express.Router();

router
  .get("/folders", getAllFolders)
  .post("/folders", createFolder)
  .delete("/folders/:id", deleteFolder)
  .patch("/folders/:id", renameFolder);

export default router;
