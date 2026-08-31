import express from "express";
import { getMe, getStorage } from "../controllers/meController.js";

const router = express.Router();

router.get("/me", getMe).get("/me/storage", getStorage);

export default router;
