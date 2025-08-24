import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import User from "../models/userModel.js";
import { refreshToken } from "../controllers/authController.js";
import pool from "../db.js";

export const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return next(errorHandler(403, "Bad request – no header provided"));
  }

  const authHeader = req.headers.authorization;

  console.log(authHeader, "authHeader");
  const accessToken = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  console.log(accessToken, "accessToken");

  if (!accessToken) {
    return next(errorHandler(401, "Access token missing or malformed"));
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.VITE_REFRESH_TOKEN_SECRET
    );

    console.log(decoded, "✅ decoded");
    req.user = decoded; // ✅ store full payload for later use
    next();
  } catch (err) {
    console.log(err, "❌ JWT error");

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }

    return res.status(403).json({ message: "Invalid access token" });
  }
};
