import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  getBarCharts,
  getLineCharts,
  getPieCharts,
  getStats,
} from "../controllers/stats.js";

const router = express.Router();

// Get Admin Dashboard Stats - GET /api/v1/admin/stats/dashboard
router.get("/stats/dashboard", adminOnly, getStats);

// Get Pie Chart Data - GET /api/v1/admin/stats/pie
router.get("/stats/pie", adminOnly, getPieCharts);

// Get Bar Chart Data - GET /api/v1/admin/stats/bar
router.get("/stats/bar", adminOnly, getBarCharts);

// Get Line Chart Data - GET /api/v1/admin/stats/line
router.get("/stats/line", adminOnly, getLineCharts);

export default router;
