// stores/useBookingStore.js
import axiosInstance from "../lib/axios.js";
import { create } from "zustand";
import toast from "react-hot-toast";

axiosInstance.defaults.withCredentials = true;

export const useBookingStore = create((set, get) => ({
  bookings: [],
  loading: false,
  error: null,

  // ✅ Fetch all bookings (admin only)
  fetchAllBookings: async () => {
    set({ loading: true, error: null });
    try {
      // singular
      const res = await axiosInstance.get("/booking");
      set({ bookings: res.data.data, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      if (error.response?.status === 401) toast.error("Unauthorized. Please log in.");
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // ✅ Fetch bookings for a specific home (calendar disable)
  fetchBookingsByHomeId: async (homeId) => {
    set({ loading: true, error: null });
    try {
      // strip possible "h_" prefix
      const safeHomeId = String(homeId || "").replace(/^h_/, "");
      // singular + /home/:homeId
      const res = await axiosInstance.get(`/booking/home/${safeHomeId}`);
      set({ bookings: res.data.data, loading: false });
      return res.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // ✅ Fetch bookings for the logged-in owner
  fetchBookingsForOwner: async () => {
    set({ loading: true, error: null });
    try {
      // singular
      const res = await axiosInstance.get(`/booking/owner`);
      set({ bookings: res.data.data, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      if (error.response?.status === 403) toast.error("Access denied.");
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // ✅ Complete a booking (room owner or admin)
  completeBooking: async (bookingId) => {
    set({ loading: true, error: null });
    try {
      // controller route: POST /api/booking/:id/complete
      const { data } = await axiosInstance.post(`/booking/${bookingId}/complete`);
      if (data.success) {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b._id === bookingId ? { ...b, status: "completed" } : b
          ),
          loading: false,
        }));
        toast.success("Booking marked as completed!");
        return data;
      }
      set({ loading: false });
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong. Try again.";
      if (error.response?.status === 403) toast.error("Access denied.");
      else toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // ✅ Activate a booking (room owner or admin)
  activateBooking: async (bookingId) => {
    set({ loading: true, error: null });
    try {
      // controller route: POST /api/booking/:id/activate
      const { data } = await axiosInstance.post(`/booking/${bookingId}/activate`);
      if (data.success) {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b._id === bookingId ? { ...b, status: "active" } : b
          ),
          loading: false,
        }));
        toast.success("Booking marked as active (checked in)!");
        return data;
      }
      set({ loading: false });
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong. Try again.";
      if (error.response?.status === 403) toast.error("Access denied.");
      else toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // ✅ Create new booking (user only)
  createBooking: async (bookingData) => {
    set({ loading: true, error: null });
    try {
      // ensure we send a clean homeId if it came from a slug param
      if (bookingData?.homeId) {
        bookingData.homeId = String(bookingData.homeId).replace(/^h_/, "");
      }
      // singular
      const res = await axiosInstance.post("/booking", bookingData);
      const result = res.data;

      set((state) => ({
        bookings: [...state.bookings, result.data],
        loading: false,
      }));

      toast.success("Booking created successfully!");
      return result;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to create booking";
      if (error.response?.status === 401) toast.error("Unauthorized. Please log in.");
      else toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // ✅ Get booking by ID (user, owner, or admin)
  getBookingById: async (id) => {
    set({ loading: true, error: null });
    try {
      // singular
      const res = await axiosInstance.get(`/booking/${id}`);
      set({ loading: false });
      return res.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      if (error.response?.status === 403) toast.error("Access denied.");
      else if (error.response?.status === 401) toast.error("Unauthorized. Please log in.");
      else toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  // ✅ Delete a booking
  deleteBooking: async (bookingId) => {
    set({ loading: true, error: null });
    try {
      // singular
      const { data } = await axiosInstance.delete(`/booking/${bookingId}`);
      if (data.success) {
        set((state) => ({
          bookings: state.bookings.filter((b) => b._id !== bookingId),
          loading: false,
        }));
        toast.success("Booking deleted successfully!");
        return data;
      }
      set({ loading: false });
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong. Try again.";
      toast.error(message);
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
}));
