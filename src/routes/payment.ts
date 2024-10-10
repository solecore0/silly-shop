import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getDiscount,
} from "../controllers/payment.js";

const router = express.Router();

// Create New Coupon - POST /api/v1/payment/coupon/new
router.post("/coupon/new", adminOnly, createCoupon);

// Get All Coupons - GET /api/v1/payment/coupon/all
router.get("/coupon/all", adminOnly, getAllCoupons);

// Delete Coupon - DELETE /api/v1/payment/coupon/:id
router.delete("/coupon/:id", adminOnly, deleteCoupon);

// Get Discount - GET /api/v1/payment/discount
router.get("/discount", getDiscount);

export default router;
