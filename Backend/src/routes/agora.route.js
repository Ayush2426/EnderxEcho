import express from "express";
import { generateAgoraToken } from "../controllers/agora.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/token", protectRoute, generateAgoraToken);

export default router;