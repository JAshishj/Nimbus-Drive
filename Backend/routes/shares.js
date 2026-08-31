import express from "express";
import { share, getAllShared } from "../controllers/sharesController.js";

const router = express.Router();

router.post("/shared", share).get("/shared", getAllShared);

export default router;