import express from "express";
import { handleRefresh } from "../controllers/refreshController.js";

const router = express.Router();

router.post("/refresh", handleRefresh);

export default router;