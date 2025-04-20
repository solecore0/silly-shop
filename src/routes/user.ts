import express from "express";

const router = express.Router();

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  getUserInfo,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/user.js";
import { adminOnly, IsAuthorizedUser } from "../middlewares/auth.js";

// CREATE USER - PfOST /api/v1/user
router.post("/register", createUser);

// REFREST THE ACCESS TOKEN - GET /api/v1/user/refresh-token
router.get("/refresh-token", refreshAccessToken);

// LOGIN USER - POST /api/v1/user/login
router.post("/login", loginUser);

// LOGOUT USER - GET /api/v1/user/logout
router.get("/logout", logoutUser);
router.get("/me", IsAuthorizedUser, getUserInfo);

// Login User - POST /api/v1/user/login
router.get("/all", IsAuthorizedUser, adminOnly, getAllUsers);

router
  .route("/:id")
  .get(IsAuthorizedUser, adminOnly, getUser)
  .delete(IsAuthorizedUser, adminOnly, deleteUser);

export default router;
