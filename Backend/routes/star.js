import express from "express";
import { Star, unStar, getAllStarred } from "../controllers/starController.js";

const router = express.Router();

router.post("/star", Star).delete("/star", unStar).get("/star", getAllStarred);

export default router;
