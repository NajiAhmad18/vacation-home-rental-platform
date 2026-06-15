import axiosInstance from "../lib/axios.js";
import { create } from "zustand";
import toast from "react-hot-toast";

export const useReviewStore = create((set) => ({
  reviews: [],
  loading: false,
  error: null,

  // Fetch reviews for a booking
  fetchReviewsByBooking: async (bookingId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/review/booking/${bookingId}`);
      set({ reviews: res.data.data, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  // Fetch reviews for a home
  fetchReviewsByHome: async (homeId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/review/home/${homeId}`);
      set({ reviews: res.data.data, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  // Add a review
  addReview: async (bookingId, reviewData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post(`/review/${bookingId}`, reviewData);
      set((state) => ({
        reviews: [...state.reviews, res.data.data],
        loading: false,
      }));
      toast.success("Review added successfully!");
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  // Owner reply
  replyToReview: async (reviewId, replyText) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.put(`/review/${reviewId}/reply`, {
        text: replyText,
      });
      set((state) => ({
        reviews: state.reviews.map((r) =>
          r._id === reviewId ? res.data.data : r
        ),
        loading: false,
      }));
      toast.success("Reply added successfully!");
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/review/${reviewId}`);
      set((state) => ({
        reviews: state.reviews.filter((r) => r._id !== reviewId),
        loading: false,
      }));
      toast.success("Review deleted successfully!");
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ loading: false, error: message });
      toast.error(message);
    }
  },
}));
