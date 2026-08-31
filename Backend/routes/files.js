import express from "express";
import upload from "../config/multer.js";
import {
  getAllFiles,
  getFile,
  uploadFile,
  deleteFile,
  getFileUrl,
  renameFile,
} from "../controllers/filesController.js";

const router = express.Router();

router
  .get("/files", getAllFiles)
  .get("/files/:id", getFile)
  .post("/files", upload.single("file"), uploadFile)
  .delete("/files/:id", deleteFile)
  .get("/files/:id/download", getFileUrl)
  .patch("/files/:id", renameFile);

export default router;
