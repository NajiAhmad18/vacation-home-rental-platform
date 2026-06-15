import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

export const useWishlistStore = create((set, get) => ({
  wishlist: [],
  loading: false,
  error: null,

  fetchWishlist: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/wishlist");
      const items = (res.data.data || [])
        .map((item) => {
          if (!item.homeId) return null;
          return {
            ...item.homeId,
            wishlistId: item._id,
            priority: item.priority,
          };
        })
        .filter(Boolean);
      set({ wishlist: items, loading: false });
    } catch (err) {
      console.error("Fetch wishlist error:", err);
      set({ loading: false, error: err.response?.data?.message || err.message });
    }
  },

  addToWishlist: async (homeId) => {
    try {
      await axiosInstance.post("/wishlist", { homeId });
      await get().fetchWishlist();
      toast.success("Added to wishlist!");
    } catch (err) {
      console.error("Add to wishlist error:", err);
      toast.error(err.response?.data?.message || "Failed to add to wishlist");
    }
  },

  removeFromWishlist: async (homeId) => {
    try {
      await axiosInstance.delete(`/wishlist/${homeId}`);
      set({
        wishlist: get().wishlist.filter((item) => item._id !== homeId),
      });
      toast.success("Removed from wishlist");
    } catch (err) {
      console.error("Remove from wishlist error:", err);
      toast.error(err.response?.data?.message || "Failed to remove from wishlist");
    }
  },

  toggleWishlist: async (homeId) => {
    const isSaved = get().wishlist.some((item) => item._id === homeId);
    if (isSaved) {
      await get().removeFromWishlist(homeId);
    } else {
      await get().addToWishlist(homeId);
    }
  },
}));
