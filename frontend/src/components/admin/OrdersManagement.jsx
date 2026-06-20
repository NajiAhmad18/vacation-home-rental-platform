import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Eye,
  X,
  MapPin,
  User,
  Phone,
  Bookmark,
} from "lucide-react";
import { useBookingStore } from "../../stores/useBookingStore.js";
import toast from "react-hot-toast";

const fmtRs = (n) =>
  `Rs ${Number(n || 0).toLocaleString("en-LK", { maximumFractionDigits: 2 })}`;

export default function OrdersManagement() {
  const {
    bookings,
    fetchAllBookings,
    loading,
    error,
    activateBooking,
    completeBooking,
    deleteBooking,
  } = useBookingStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchAllBookings().catch((err) => {
      console.error("Failed to load bookings:", err);
    });
  }, [fetchAllBookings]);

  const handleActivate = async (id) => {
    if (window.confirm("Are you sure you want to mark this booking as active (checked-in)?")) {
      try {
        await activateBooking(id);
        toast.success("Booking activated successfully");
      } catch (err) {
        toast.error(err.message || "Failed to activate booking");
      }
    }
  };

  const handleComplete = async (id) => {
    if (window.confirm("Are you sure you want to mark this booking as completed (checked-out)?")) {
      try {
        await completeBooking(id);
        toast.success("Booking completed successfully");
      } catch (err) {
        toast.error(err.message || "Failed to complete booking");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking record? This cannot be undone.")) {
      try {
        await deleteBooking(id);
        toast.success("Booking deleted successfully");
        if (selectedBooking?._id === id) {
          setSelectedBooking(null);
        }
      } catch (err) {
        toast.error(err.message || "Failed to delete booking");
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      completed: "bg-blue-50 text-blue-700 border-blue-200",
      cancelled: "bg-rose-50 text-rose-700 border-rose-200",
    };

    const icons = {
      pending: Clock,
      active: CheckCircle2,
      completed: Bookmark,
      cancelled: XCircle,
    };

    const Icon = icons[status] || Clock;
    const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[status] || "bg-slate-50 border-slate-200 text-slate-700"}`}>
        <Icon size={12} />
        {label}
      </span>
    );
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Bookings</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{bookings.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <Calendar size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Stays</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">
              {bookings.filter((b) => b.status === "active").length}
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending Approvals</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">
              {bookings.filter((b) => b.status === "pending").length}
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <Clock size={24} className="animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Completed Stays</p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">
              {bookings.filter((b) => b.status === "completed").length}
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Bookmark size={24} />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search guest or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full focus:outline-none transition"
          />
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="active">Active (Checked In)</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button
            onClick={() => fetchAllBookings().catch(() => {})}
            className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stay Dates</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price / Cost</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading booking directory...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <Calendar size={24} />
                    </div>
                    <h3 className="text-base font-semibold text-slate-800">No bookings found</h3>
                    <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search keywords.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-slate-500">#{b._id?.slice(-8).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{b.fullName}</p>
                        <p className="text-xs text-slate-400">{b.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-600">
                        <p className="font-medium">{new Date(b.checkInDate).toLocaleDateString()}</p>
                        <p className="text-slate-400">to {new Date(b.checkOutDate).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-800">{fmtRs(b.totalPrice)}</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(b.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {b.status === "pending" && (
                          <button
                            onClick={() => handleActivate(b._id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition"
                          >
                            Activate
                          </button>
                        )}
                        {b.status === "active" && (
                          <button
                            onClick={() => handleComplete(b._id)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(b._id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Booking"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Booking Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Booking ID</p>
                  <p className="font-mono text-slate-800 mt-1">{selectedBooking._id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                </div>
              </div>

              {/* Guest Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guest Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-100 rounded-xl p-4">
                  <div className="flex items-center gap-2.5">
                    <User size={16} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Full Name</p>
                      <p className="font-semibold text-slate-800">{selectedBooking.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone size={16} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Phone Number</p>
                      <p className="font-semibold text-slate-800">{selectedBooking.phone}</p>
                    </div>
                  </div>
                  {selectedBooking.idCard && (
                    <div className="flex items-center gap-2.5 sm:col-span-2">
                      <User size={16} className="text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-400">ID / Passport Number</p>
                        <p className="font-semibold text-slate-800">{selectedBooking.idCard}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stay Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stay & Pricing</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-100 rounded-xl p-4">
                  <div>
                    <p className="text-xs text-slate-400">Check-in Date</p>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {new Date(selectedBooking.checkInDate).toLocaleDateString(undefined, { dateStyle: "long" })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Check-out Date</p>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {new Date(selectedBooking.checkOutDate).toLocaleDateString(undefined, { dateStyle: "long" })}
                    </p>
                  </div>
                  <div className="sm:col-span-2 border-t pt-3 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-400">Total Price</p>
                      <p className="text-lg font-black text-slate-800 mt-0.5">{fmtRs(selectedBooking.totalPrice)}</p>
                    </div>
                    {selectedBooking.paymentStatus && (
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Payment Status</p>
                        <span className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full mt-1 border ${
                          selectedBooking.paymentStatus === "paid"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {selectedBooking.paymentStatus.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
