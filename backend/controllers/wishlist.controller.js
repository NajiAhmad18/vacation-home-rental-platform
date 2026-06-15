import Wishlist from "../models/wishlist.model.js";
import Home from "../models/home.model.js";

// Add home to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { homeId } = req.body;
    // const userId = req.user.id;

    const userId = "66b1d2c3f4a567890123abcd";

    // Check if home exists
    const home = await Home.findById(homeId);
    if (!home) return res.status(404).json({ message: "Home not found" });

    // check if already exists
    const exists = await Wishlist.findOne({ userId, homeId });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Already in wishlist" });
    }

    // get the current max priority for this user
    const lastItem = await Wishlist.findOne({ userId }).sort({ priority: -1 });
    const newPriority = lastItem ? lastItem.priority + 1 : 1;

    const wishlistItem = await Wishlist.create({
      userId,
      homeId,
      priority: newPriority,
    });

    res.status(201).json({ success: true, data: wishlistItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all wishlist items sorted by priority
export const getWishlist = async (req, res) => {
  try {
    // const userId = req.user.id;
    const userId = "66b1d2c3f4a567890123abcd";
    const wishlist = await Wishlist.find({ userId })
      .populate("homeId")
      .sort({ priority: 1 });

    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { homeId } = req.params;
    const userId = req.user.id;

    const deleted = await Wishlist.findOneAndDelete({ userId, homeId });

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Not found in wishlist" });
    }

    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
