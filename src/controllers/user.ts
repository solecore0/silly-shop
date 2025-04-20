import { Request, Response, NextFunction } from "express";
import User from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";
import { sendTokens } from "../utils/jwtToken.js";
import jwt from "jsonwebtoken";

export const createUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, password, photo, gender, dob, age } = req.body;

    if (!name || !email || !password || !photo || !gender || !dob) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    if (await User.findOne({ email })) {
      return next(new ErrorHandler("User already exists", 409));
    }

    let user = await User.create({
      name,
      email,
      password,
      photo,
      gender,
      dob: new Date(dob),
      age,
    });

    sendTokens(user, 201, res);
  }
);

export const loginUser = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendTokens(user, 201, res);
});

export const logoutUser = TryCatch(async (req, res, next) => {
  res
    .cookie("refreshToken", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
});

export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find();

  return res.status(200).json({
    success: true,
    users,
  });
});

export const getUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("Invalid ID", 404));
  }

  return res.status(200).json({
    success: true,
    user,
  });
});

export const deleteUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("Invalid ID", 404));
  }

  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

// Refresh token route
export const refreshAccessToken = TryCatch(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token missing" });
  }

  const refreshTokenExpire = Number(process.env.REFRESH_COOKIE_EXPIRE ?? "7");

  // Verify refresh token
  let decodedData;
  try {
    decodedData = jwt.verify(
      refreshToken,
      process.env.REFRESH_JWT_SECRET ?? ""
    ) as { id: string; tokenVersion: number };
  } catch (error) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }

  const userId = decodedData.id;
  const tokenVersion = decodedData.tokenVersion;

  // Find user and verify token version
  const user = await User.findById(userId);
  if (!user || user.tokenVersion !== tokenVersion) {
    return res.status(401).json({ error: "Token version mismatch" });
  }

  // Generate new access token and refresh token
  const newAccessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET ?? "",
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    }
  );
  const newRefreshToken = jwt.sign(
    { id: userId, tokenVersion: user.tokenVersion + 1 },
    process.env.REFRESH_JWT_SECRET ?? "",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    }
  );

  // Update token version in user document
  user.tokenVersion += 1;
  await user.save();

  // Set new refresh token cookie
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  });

  // Return new access token
  res.json({ accessToken: newAccessToken });
});
