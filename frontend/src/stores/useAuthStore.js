// stores/useAuthStore.js
import axiosInstance from "../lib/axios.js";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: undefined,
  loading: false,
  error: null,

  // 📝 User Signup
  signupUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post("/auth/signup/user", userData);
      const result = res.data;
      set({ user: result.user, loading: false });
      return result;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to signup user";
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // 📝 Room Owner Signup
  signupRoomOwner: async (ownerData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post("/auth/signup/roomOwner", ownerData);
      const result = res.data;
      set({ user: result.user, loading: false });
      return result;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to signup owner";
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // 🔑 Login
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post("/auth/login", credentials);
      const result = res.data;
      set({ user: result.user, loading: false });
      return result;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // 🚪 Logout
  logout: async () => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null, loading: false });
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Logout failed";
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // 👤 Get Profile
  getProfile: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/auth/profile");
      console.log("strore : ",  res.data.user)
      set({ user: res.data.user, loading: false });
      return res.data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        // Not logged in → just clear user
        set({ user: null, loading: false });
        return null;
      }
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch profile";
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // ✏️ Update Profile
  updateProfile: async (updates) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.put("/auth/profile", updates, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedUser = res.data.user;
      set({ user: updatedUser, loading: false });
      return updatedUser;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
  // ✅ Admin verifies or rejects Room Owner
  verifyRoomOwner: async (userId, status, reason) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.put(`/auth/verify-room-owner/${userId}`, {
        status,
        reason,
      });
      const updatedUser = res.data.user;
      set({ loading: false });
      return updatedUser;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to verify room owner";
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
}));
