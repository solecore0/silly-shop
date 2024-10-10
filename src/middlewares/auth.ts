import User from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
import jwt from "jsonwebtoken";

export const adminOnly = TryCatch(async (req, res, next) => {
  // Verify access token
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
      return res.status(401).json({ error: "User not found" });
    }

    if (user.role === "user") {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid access token" });
  }
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
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid access token" });
  }
});
