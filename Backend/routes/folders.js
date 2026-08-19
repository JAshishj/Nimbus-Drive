import express from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { getAllFolders, createFolder, deleteFolder } from "../controllers/foldersController.js";

const router = express.Router();

router
    .get("/folders", verifyJWT, getAllFolders)
    .post("/folders", verifyJWT, createFolder)
    .delete("/folders/:id", verifyJWT, deleteFolder);

export default router;