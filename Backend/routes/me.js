import express from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { getMe } from "../controllers/meController.js";

const router = express.Router();

router.get("/me", verifyJWT, getMe);

export default router;
