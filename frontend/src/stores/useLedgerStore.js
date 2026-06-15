import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";

export const useLedgerStore = create((set, get) => ({
  loading: false,
  error: null,

  // ✅ initialize with a safe shape so UI never hits undefined
  adminSummary: {
    escrowBalance: 0,
    totalCommission: 0,
    ownerPayoutTotal: 0,
    platformRevenueTotal: 0,
  },
  adminRecentActivities: [],
  ownerSummary: null,
  ownerPayouts: [],

  _begin: () => set({ loading: true, error: null }),
  _fail: (message) => {
    set({ loading: false, error: message });
    toast.error(message);
    return Promise.reject(new Error(message));
  },
  _done: () => set({ loading: false }),

  clearLedgerError: () => set({ error: null }),
  resetLedgerState: () =>
    set({
      loading: false,
      error: null,
      adminSummary: {
        escrowBalance: 0,
        totalCommission: 0,
        ownerPayoutTotal: 0,
        platformRevenueTotal: 0,
      },
      adminRecentActivities: [],
      ownerSummary: null,
      ownerPayouts: [],
    }),

  /* ── Admin Summary ── */
  getAdminSummary: async () => {
    get()._begin();
    try {
      const res = await axiosInstance.get("/ledger/admin/summary");
      const payload = res?.data?.data ?? res?.data ?? {};
      const normalized = {
        escrowBalance: Number(payload.escrowBalance || 0),
        totalCommission: Number(payload.totalCommission || 0),
        ownerPayoutTotal: Number(payload.ownerPayoutTotal || 0),
        platformRevenueTotal: Number(payload.platformRevenueTotal || 0),
      };
      set({ adminSummary: normalized, loading: false });
      return normalized;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch admin summary";
      return get()._fail(message);
    }
  },

  // ✅ backwards-compat alias (so old code calling fetchAdminLedger still works)
  fetchAdminLedger: async () => get().getAdminSummary(),

  /* ── Admin Recent ── */
  getAdminRecentActivities: async () => {
    get()._begin();
    try {
      const { data } = await axiosInstance.get("/ledger/admin/recent");
      set({ adminRecentActivities: data?.data || [], loading: false });
      return data?.data || [];
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch recent activities";
      return get()._fail(message);
    }
  },

  /* (owner summary & payouts unchanged) */
  // ... keep the rest of your file as-is ...
}));
