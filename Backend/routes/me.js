import express from "express";
import { getMe } from "../controllers/meController.js";
import verifyJWT from "../middleware/verifyJWT";

const router = express.Router();

router.get("/me", verifyJWT, getMe);

export default router;