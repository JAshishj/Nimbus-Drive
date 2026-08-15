import express from "express";
import upload from "../config/multer.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { getAllFiles, getFile, uploadFile, deleteFile, viewFile } from "../controllers/filesController.js";

const router = express.Router();

router
  .get("/files", verifyJWT, getAllFiles)
  .get("/files/:id", verifyJWT, getFile)
  .post("/files", verifyJWT, upload.single("file"), uploadFile)
  .delete("/files/:id", verifyJWT, deleteFile)
  .get("/files/:id/view", verifyJWT, viewFile);

export default router;
