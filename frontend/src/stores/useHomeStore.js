import axiosInstance from "../lib/axios.js";
import { create } from "zustand";

axiosInstance.defaults.withCredentials = true;

export const useHomeStore = create((set) => ({
  homes: [],
  loading: false,
  error: null,

  // 🏠 Create new home
  createHome: async (homeData) => {
    set({ loading: true, error: null });

    try {
      const formData = new FormData();
      const { images, ...rest } = homeData;
      formData.append("data", JSON.stringify(rest));
      images.forEach((file) => formData.append("images", file));

      const res = await axiosInstance.post("/home", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = res.data;

      set((state) => ({
        homes: [...state.homes, result.data],
        loading: false,
      }));

      return result;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create home";
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // 🔍 Get home by ID
  getHomeById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/home/${id}`);
      set({ loading: false });
      return res.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // 📋 Get all homes (public)
  fetchAllHomes: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/home");
      set({ homes: res.data.data, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // 👤 Get homes for logged-in owner
  getHomesByOwner: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/home/owner");
      set({ homes: res.data.data, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // ✏️ Update home
  updateHome: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      const { images, existingImages, ...rest } = updatedData;
      formData.append("data", JSON.stringify(rest));
      if (existingImages !== undefined) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }
      if (images && images.length > 0) {
        images.forEach((file) => formData.append("images", file));
      }

      const res = await axiosInstance.put(`/home/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedHome = res.data.data;

      set((state) => ({
        homes: state.homes.map((home) =>
          home._id === id ? updatedHome : home
        ),
        loading: false,
      }));

      return updatedHome;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // 🚫 Admin hides home
  hideHomeByAdmin: async (id, reason) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.put(`/home/admin/hide/${id}`, { reason });
      const updatedHome = res.data.data;

      set((state) => ({
        homes: state.homes.map((home) =>
          home._id === id ? updatedHome : home
        ),
        loading: false,
      }));

      return updatedHome;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // 🕶️ Toggle availability
  toggleAvailable: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.put(
        `/home/owner/toggle-availability/${id}`
      );
      const updatedHome = res.data.data;
      set((state) => ({
        homes: state.homes.map((home) =>
          home._id === id ? updatedHome : home
        ),
        loading: false,
      }));
      return updatedHome;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // ❌ Delete home
  deleteHome: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/home/${id}`);
      set((state) => ({
        homes: state.homes.filter((home) => home._id !== id),
        loading: false,
      }));
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
}));
