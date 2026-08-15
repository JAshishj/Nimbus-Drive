import express from "express";
import { getMe } from "../controllers/meController.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/me", verifyJWT, getMe);

export default router;
