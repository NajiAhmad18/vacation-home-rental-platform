import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";


const router = express.Router();

router.post("/", addToWishlist);
router.get("/", getWishlist);
router.delete("/:homeId", removeFromWishlist);

export default router;
