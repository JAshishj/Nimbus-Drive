import express from "express";
import handelrefresh from "../controllers/resfreshController";

const router = express.Router();

router.post("/refresh", handelrefresh);

export default router;