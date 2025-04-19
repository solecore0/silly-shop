import express from "express";
import {
  createNewOrder,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  getOrderDetails,
  updateOrder,
} from "../controllers/order.js";
import { adminOnly, IsAuthorizedUser } from "../middlewares/auth.js";

const router = express.Router();

// Create A New Order - POST /api/v1/order/new
router.post("/new", IsAuthorizedUser, createNewOrder);

// Get All Orders - GET /api/v1/order/all
router.get("/all", IsAuthorizedUser, adminOnly, getAllOrders);

// Get User's orders - GET /api/v1/order/my
router.get("/my", IsAuthorizedUser, getMyOrders);

// Get Single Order Details Or Delete It Or Update It - Get /api/v1/order/:id
router
  .route("/:id")
  .get(getOrderDetails)
  .delete(IsAuthorizedUser, adminOnly, deleteOrder)
  .put(IsAuthorizedUser, adminOnly, updateOrder);

export default router;
