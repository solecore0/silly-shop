import express from "express";

const router = express.Router();

import { adminOnly, IsAuthorizedUser } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getCategories,
  getLatestProducts,
  getProducts,
  getProductDetails,
  updateProduct,
  createProductReview,
} from "../controllers/product.js";

// Get Products By Searched Term or Filters - GET /api/v1/product
router.get("/find", getProducts);

// CREATE Product - POST /api/v1/user
router.post("/new", IsAuthorizedUser, adminOnly, singleUpload, createProduct);

// GET ALL PRODUCTS - GET /api/v1/product
router.get("/all", IsAuthorizedUser, adminOnly, getAllProducts);

// GET ALL CATEGORIES - GET /api/v1/product/categories
router.get("/categories", getCategories);

// GET LATEST PRODUCTS - GET /api/v1/product/latest
router.get("/latest", getLatestProducts);

// GET, Update, Delete Product - GET /api/v1/product/:id
router
  .route("/:id")
  .get(getProductDetails)
  .put(IsAuthorizedUser, adminOnly, singleUpload, updateProduct)
  .delete(IsAuthorizedUser, adminOnly, deleteProduct);

// CREATE, UPDATE, DELETE Product Review - POST, PUT, DELETE /api/v1/:productID/review
router.route("/review").post(IsAuthorizedUser, createProductReview);

export default router;
