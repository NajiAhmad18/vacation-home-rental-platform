import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", addToWishlist);
router.get("/", getWishlist);
router.delete("/:homeId", removeFromWishlist);

export default router;
