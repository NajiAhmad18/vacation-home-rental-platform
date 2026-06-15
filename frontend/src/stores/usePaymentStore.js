// stores/usePaymentStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";
import { CardElement } from "@stripe/react-stripe-js";

export const usePaymentStore = create((set, get) => ({
  payments: [],
  loading: false,
  error: null,

  getPaymentInState: (paymentId) =>
    get().payments.find((p) => p.paymentId === paymentId),

  setPaymentStatus: (paymentId, status) =>
    set((state) => ({
      payments: state.payments.map((p) =>
        p.paymentId === paymentId ? { ...p, status } : p
      ),
    })),

  clearPaymentError: () => set({ error: null }),
  resetPaymentState: () => set({ payments: [], loading: false, error: null }),

  _upsertPayment: (record) =>
    set((state) => {
      const existing = state.payments.find((p) => p.paymentId === record.paymentId);
      if (existing) {
        return {
          payments: state.payments.map((p) =>
            p.paymentId === record.paymentId ? { ...p, ...record } : p
          ),
        };
      }
      return { payments: [...state.payments, record] };
    }),

  /* intents */
  getOrCreatePaymentIntent: async (bookingId) => {
    if (!bookingId) throw new Error("bookingId is required");

    const existing = get().payments.find(
      (p) =>
        p.bookingId === bookingId &&
        (p.status === "pending" || p.status === "processing")
    );
    if (existing?.clientSecret) {
      return {
        clientSecret: existing.clientSecret,
        paymentId: existing.paymentId,
        amount: existing.amount,
        currency: existing.currency || "lkr",
      };
    }
    return await get().createPaymentIntent({ bookingId });
  },

  createPaymentIntent: async ({ bookingId }) => {
    set({ loading: true, error: null });
    try {
      // ⬇️ no /api here
      const { data } = await axiosInstance.post("/payments/create-intent", {
        bookingId,
      });
      const record = {
        paymentId: data.paymentId,
        clientSecret: data.clientSecret,
        amount: data.amount,
        currency: data.currency || "lkr",
        bookingId,
        status: "pending",
        createdAt: Date.now(),
      };
      get()._upsertPayment(record);
      set({ loading: false });
      return {
        clientSecret: data.clientSecret,
        paymentId: data.paymentId,
        amount: data.amount,
        currency: data.currency || "lkr",
      };
    } catch (err) {
      const message = err.response?.data?.error || "Failed to create payment intent";
      set({ loading: false, error: message });
      toast.error(message);
      throw new Error(message);
    }
  },

  /* lifecycle */
  confirmAndFinalize: async ({ stripe, elements, clientSecret, paymentId, params }) => {
    if (!stripe || !elements) throw new Error("Stripe and Elements are required");
    if (!clientSecret || !paymentId) throw new Error("clientSecret and paymentId are required");

    set({ loading: true, error: null });
    get().setPaymentStatus(paymentId, "processing");

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("CardElement is not mounted. Make sure <CardElement /> is on the page.");
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          ...(params?.payment_method_data || {}),
        },
      });

      if (result.error) {
        const message = result.error.message || "Payment failed to confirm";
        get().setPaymentStatus(paymentId, "failed");
        set({ loading: false, error: message });
        toast.error(message);
        throw new Error(message);
      }

      const status = result.paymentIntent?.status;

      if (status === "succeeded") {
        const finalize = await get().markPaymentSuccess(paymentId);
        set({ loading: false });
        return { stripe: result.paymentIntent, server: finalize };
      }

      if (status === "processing") {
        get().setPaymentStatus(paymentId, "processing");
        set({ loading: false });
        toast("Payment is processing… we’ll update you when it completes.");
        return { stripe: result.paymentIntent };
      }

      if (status === "requires_action" || status === "requires_confirmation") {
        get().setPaymentStatus(paymentId, status);
        set({ loading: false });
        toast("Additional authentication required to complete payment.");
        return { stripe: result.paymentIntent };
      }

      const message = `Payment did not complete (status: ${status || "unknown"})`;
      get().setPaymentStatus(paymentId, "failed");
      set({ loading: false, error: message });
      toast.error(message);
      throw new Error(message);
    } catch (err) {
      const message = err?.message || "Unexpected error during payment confirmation";
      get().setPaymentStatus(paymentId, "failed");
      set({ loading: false, error: message });
      if (!/toast/i.test(message)) toast.error(message);
      throw err;
    }
  },

  markPaymentSuccess: async (paymentId) => {
    try {
      // ⬇️ no /api here
      const { data } = await axiosInstance.post(`/payments/${paymentId}/success`);
      if (data?.ok && data?.status === "succeeded") {
        set((state) => ({
          payments: state.payments.map((p) =>
            p.paymentId === paymentId
              ? { ...p, status: "succeeded", invoiceUrl: data.invoiceUrl, receiptUrl: data.receiptUrl }
              : p
          ),
        }));
        toast.success("Payment completed!");
        return data;
      }
      const message = `Server did not confirm success (status: ${data?.status || "unknown"})`;
      get().setPaymentStatus(paymentId, "failed");
      set({ error: message });
      toast.error(message);
      throw new Error(message);
    } catch (err) {
      const message = err.response?.data?.error || "Failed to mark payment success";
      get().setPaymentStatus(paymentId, "failed");
      set({ error: message });
      toast.error(message);
      throw new Error(message);
    }
  },

  refundPayment: async (paymentId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.post(`/payments/${paymentId}/refund`);
      if (data?.ok) {
        set((state) => ({
          payments: state.payments.map((p) =>
            p.paymentId === paymentId ? { ...p, status: "refunded" } : p
          ),
          loading: false,
        }));
        toast.success("Payment refunded successfully!");
        return data;
      }
      set({ loading: false });
      const message = "Refund response not ok";
      toast.error(message);
      throw new Error(message);
    } catch (err) {
      const message = err.response?.data?.error || "Failed to refund payment";
      set({ loading: false, error: message });
      toast.error(message);
      throw new Error(message);
    }
  },

  payoutOwner: async (paymentId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.post("/payments/payout", { paymentId });
      set({ loading: false });
      if (data?.ok) {
        toast.success("Payout processed successfully!");
        return data;
      }
      const message = "Payout response not ok";
      toast.error(message);
      throw new Error(message);
    } catch (err) {
      const message = err.response?.data?.error || "Failed to process payout";
      set({ loading: false, error: message });
      toast.error(message);
      throw new Error(message);
    }
  },

  finalizeByBookingId: async (bookingId) => {
    try {
      const inMem = get().payments.find((p) => p.bookingId === bookingId);
      const paymentId = inMem?.paymentId
        ? inMem.paymentId
        : (await axiosInstance.get(`/payments/by-booking/${bookingId}`)).data.paymentId;

      const res = await get().markPaymentSuccess(paymentId);
      return res;
    } catch (err) {
      const message = err.response?.data?.error || "No payment found for this booking";
      set({ error: message });
      toast.error(message);
      throw new Error(message);
    }
  },

  getAllPayments: async (opts = {}) => {
    set({ loading: true, error: null });
    try {
      const params = {
        page: opts.page ?? 1,
        limit: opts.limit ?? 50,
        sort: opts.sort ?? "-createdAt",
      };

      let res;
      try {
        res = await axiosInstance.get("/payments/all", { params });
      } catch (err) {
        if (err.response?.status === 404) {
          res = await axiosInstance.get("/payments", { params });
        } else {
          throw err;
        }
      }

      const data = res.data?.data ?? res.data ?? [];
      set({ payments: Array.isArray(data) ? data : [], loading: false });
      return { data, meta: res.data?.meta ?? null };
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch payments";
      set({ loading: false, error: message });
      toast.error(message);
      throw new Error(message);
    }
  },

  getPaymentById: async (paymentId) => {
    if (!paymentId) throw new Error("paymentId is required");
    set({ loading: true, error: null });

    try {
      const res = await axiosInstance.get(`/payments/${paymentId}`);
      const payload = res.data?.data ?? res.data ?? {};

      const record = {
        ...payload,
        paymentId: payload.paymentId || payload._id || paymentId,
      };

      set((state) => {
        const list = Array.isArray(state.payments) ? [...state.payments] : [];
        const idx = list.findIndex(
          (p) => (p.paymentId || p._id) === record.paymentId
        );
        if (idx >= 0) list[idx] = { ...list[idx], ...record };
        else list.unshift(record);
        return { payments: list, loading: false };
      });

      return record;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch payment";
      set({ loading: false, error: message });
      toast.error(message);
      throw new Error(message);
    }
  },

  deletePayment: async (paymentId, opts = {}) => {
    if (!paymentId) throw new Error("paymentId is required");
    set({ loading: true, error: null });

    try {
      const params = {};
      if (opts.hard) params.hard = 1;

      const res = await axiosInstance.delete(`/payments/${paymentId}`, { params });

      set((state) => ({
        payments: (state.payments || []).filter(
          (p) => (p.paymentId || p._id) !== paymentId
        ),
        loading: false,
      }));

      toast.success("Payment deleted");

      if (typeof get().getAllPayments === "function") {
        try { await get().getAllPayments({ page: 1, limit: 200 }); } catch {}
      }

      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to delete payment";
      set({ loading: false, error: message });
      toast.error(message);
      throw new Error(message);
    }
  },
}));
