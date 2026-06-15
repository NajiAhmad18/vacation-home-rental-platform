import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded id : ", decoded);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid token" });
    } else {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

// Admin only routes
export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ success: false, message: "Access denied - ADMIN ONLY" });
  }
};

// Room Owner only routes
export const roomOwnerRoute = (req, res, next) => {
  if (req.user && req.user.role === "roomOwner") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied - ROOM OWNER ONLY",
    });
  }
};

// Admin or Room Owner routes
export const adminOrRoomOwnerRoute = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "roomOwner" || req.user.role === "admin")
  ) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied - Admin or Room Owner only",
    });
  }
};
