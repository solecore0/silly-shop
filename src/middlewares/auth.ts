import User from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
import jwt from "jsonwebtoken";

export const adminOnly = TryCatch(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Access Token Missing" });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(401).json({ error: "Invalid User Info" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  next();
});

export const IsAuthorizedUser = TryCatch(async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ error: "Access token missing" });
  }

  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer") {
    return res.status(401).json({ error: "Invalid authorization scheme" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? " ") as {
      id: string;
    };

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Invalid User Info" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid access token" });
  }
});
