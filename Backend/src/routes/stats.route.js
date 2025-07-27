import express from "express";
// ADD logSiteVisit to the import
import { getAppStats, logSiteVisit } from "../controllers/stats.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getAppStats);
router.post("/visit", logSiteVisit); // ADD THIS NEW ROUTE

export default router;
