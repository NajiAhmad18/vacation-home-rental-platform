// stores/useUserStore.js
import { create } from "zustand";
import axiosInstance from "../lib/axios.js";

export const useUserStore = create((set) => ({
  stats: null,
  recentActivity: [],
  loading: false,
  error: null,

  // 📊 Fetch overview data
  fetchOverview: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/user/overview");
      set({
        stats: res.data.stats,
        recentActivity: res.data.recentActivity,
        loading: false,
      });
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch overview";
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
}));
