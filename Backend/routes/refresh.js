import express from "express";
import { handelrefresh } from "../controllers/resfreshController.js";

const router = express.Router();

router.post("/refresh", handelrefresh);

export default router;