import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  X,
  AlertCircle,
  Eye,
} from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore.js";
import toast from "react-hot-toast";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [verifyingUser, setVerifyingUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [imageModalUrl, setImageModalUrl] = useState(null);

  const fetchAllUsers = useAuthStore((state) => state.fetchAllUsers);
  const deleteUserStore = useAuthStore((state) => state.deleteUser);
  const updateUserRoleStore = useAuthStore((state) => state.updateUserRole);
  const verifyRoomOwnerStore = useAuthStore((state) => state.verifyRoomOwner);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserStore(userId);
        toast.success("User deleted successfully");
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } catch (err) {
        toast.error(err.message || "Failed to delete user");
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const updatedUser = await updateUserRoleStore(userId, newRole);
      toast.success(`User role updated to ${newRole}`);
      setUsers((prev) => prev.map((u) => (u._id === userId ? updatedUser : u)));
    } catch (err) {
      toast.error(err.message || "Failed to update role");
    }
  };

  const handleVerification = async (status) => {
    if (!verifyingUser) return;
    if (status === "rejected" && !rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }

    try {
      const updatedUser = await verifyRoomOwnerStore(
        verifyingUser._id,
        status,
        status === "rejected" ? rejectionReason : undefined
      );
      toast.success(`Room owner ${status === "verified" ? "approved" : "rejected"} successfully`);
      setUsers((prev) =>
        prev.map((u) => (u._id === verifyingUser._id ? { ...u, roomOwnerProfile: updatedUser.roomOwnerProfile } : u))
      );
      setVerifyingUser(null);
      setRejectionReason("");
      setShowRejectForm(false);
    } catch (err) {
      toast.error(err.message || "Failed to verify room owner");
    }
  };

  const getStatusBadge = (user) => {
    if (user.role !== "roomOwner") {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
          Active
        </span>
      );
    }

    const status = user.roomOwnerProfile?.verificationStatus || "not_submitted";
    const styles = {
      verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200 animate-pulse",
      rejected: "bg-rose-50 text-rose-700 border-rose-200",
      not_submitted: "bg-slate-50 text-slate-600 border-slate-200",
    };

    const labels = {
      verified: "Verified",
      pending: "Pending Approval",
      rejected: "Rejected",
      not_submitted: "No Proof Submitted",
    };

    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: "bg-indigo-50 text-indigo-700 border-indigo-200",
      roomOwner: "bg-blue-50 text-blue-700 border-blue-200",
      user: "bg-slate-50 text-slate-700 border-slate-200",
    };

    const icons = {
      admin: ShieldCheck,
      roomOwner: Shield,
      user: UserCheck,
    };

    const labels = {
      admin: "Admin",
      roomOwner: "Host",
      user: "Guest",
    };

    const Icon = icons[role] || UserCheck;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[role] || styles.user}`}>
        <Icon size={12} />
        {labels[role] || role}
      </span>
    );
  };

  const getInitials = (username) => {
    if (!username) return "U";
    return username.slice(0, 2).toUpperCase();
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profile?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "All" || user.role === roleFilter;

    let matchesStatus = true;
    if (statusFilter !== "All") {
      if (statusFilter === "active_guest") {
        matchesStatus = user.role !== "roomOwner";
      } else {
        matchesStatus =
          user.role === "roomOwner" &&
          user.roomOwnerProfile?.verificationStatus === statusFilter;
      }
    }

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Users</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{users.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Verified Hosts</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">
              {users.filter((u) => u.role === "roomOwner" && u.roomOwnerProfile?.verificationStatus === "verified").length}
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <ShieldCheck size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending Verification</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">
              {users.filter((u) => u.role === "roomOwner" && u.roomOwnerProfile?.verificationStatus === "pending").length}
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <AlertCircle size={24} className="animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">System Admins</p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">
              {users.filter((u) => u.role === "admin").length}
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Shield size={24} />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full focus:outline-none transition"
          />
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            >
              <option value="All">All Roles</option>
              <option value="admin">Admin</option>
              <option value="roomOwner">Host</option>
              <option value="user">Guest</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
          >
            <option value="All">All Statuses</option>
            <option value="active_guest">Guest (Active)</option>
            <option value="verified">Host (Verified)</option>
            <option value="pending">Host (Pending)</option>
            <option value="rejected">Host (Rejected)</option>
            <option value="not_submitted">Host (No Proof)</option>
          </select>

          <button
            onClick={loadUsers}
            className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Member Since</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading user directory...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <Search size={24} />
                    </div>
                    <h3 className="text-base font-semibold text-slate-800">No users found</h3>
                    <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search keywords.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {getInitials(user.username)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {user.profile?.fullName || user.username}
                          </p>
                          <p className="text-xs text-slate-400">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-xs font-medium text-slate-600">
                          <Mail size={12} className="text-slate-400" />
                          <span>{user.email}</span>
                        </div>
                        {user.profile?.phoneNumber && (
                          <div className="flex items-center space-x-2 text-xs text-slate-500">
                            <Phone size={12} className="text-slate-400" />
                            <span>{user.profile.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {getRoleBadge(user.role)}
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="text-[10px] text-slate-500 border border-slate-200 rounded px-1 py-0.5 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white max-w-[90px]"
                        >
                          <option value="user">Guest</option>
                          <option value="roomOwner">Host</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(user)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                        <Calendar size={12} className="text-slate-400" />
                        <span>
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        {user.role === "roomOwner" &&
                          user.roomOwnerProfile?.verificationStatus === "pending" && (
                            <button
                              onClick={() => setVerifyingUser(user)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                            >
                              Verify Proof
                            </button>
                          )}
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete User"
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

      {/* Host Verification Modal */}
      {verifyingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Verify Host Identity</h3>
              <button
                onClick={() => {
                  setVerifyingUser(null);
                  setShowRejectForm(false);
                  setRejectionReason("");
                }}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Applicant</p>
                  <p className="font-semibold text-slate-800 mt-1">
                    {verifyingUser.profile?.fullName || verifyingUser.username}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">ID Card Number</p>
                  <p className="font-semibold text-slate-800 mt-1">
                    {verifyingUser.roomOwnerProfile?.idCardNumber || "N/A"}
                  </p>
                </div>
              </div>

              {/* ID Images */}
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase mb-2">Uploaded Proof Documents</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Front */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col">
                    <span className="bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 border-b border-slate-200">
                      ID Front (NIC/Passport)
                    </span>
                    <div className="relative group flex-1 min-h-[160px] flex items-center justify-center p-2 bg-white">
                      {verifyingUser.roomOwnerProfile?.idCardImages?.front ? (
                        <>
                          <img
                            src={verifyingUser.roomOwnerProfile.idCardImages.front}
                            alt="ID Front"
                            className="max-h-[160px] w-auto object-contain rounded"
                          />
                          <button
                            onClick={() => setImageModalUrl(verifyingUser.roomOwnerProfile.idCardImages.front)}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition rounded"
                          >
                            <Eye size={20} />
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-400 text-xs">Image missing</span>
                      )}
                    </div>
                  </div>

                  {/* Back */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col">
                    <span className="bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 border-b border-slate-200">
                      ID Back
                    </span>
                    <div className="relative group flex-1 min-h-[160px] flex items-center justify-center p-2 bg-white">
                      {verifyingUser.roomOwnerProfile?.idCardImages?.back ? (
                        <>
                          <img
                            src={verifyingUser.roomOwnerProfile.idCardImages.back}
                            alt="ID Back"
                            className="max-h-[160px] w-auto object-contain rounded"
                          />
                          <button
                            onClick={() => setImageModalUrl(verifyingUser.roomOwnerProfile.idCardImages.back)}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition rounded"
                          >
                            <Eye size={20} />
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-400 text-xs">Image missing</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rejection form */}
              {showRejectForm && (
                <div className="space-y-2 border-t pt-4 border-slate-100">
                  <label className="block text-xs font-bold text-rose-600 uppercase">Reason for Rejection</label>
                  <textarea
                    rows={3}
                    placeholder="Enter reason for rejecting this host application..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:outline-none text-sm transition"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              {showRejectForm ? (
                <>
                  <button
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectionReason("");
                    }}
                    className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleVerification("rejected")}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold transition text-sm"
                  >
                    Confirm Rejection
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="px-4 py-2 border border-rose-200 bg-white text-rose-600 rounded-xl font-semibold hover:bg-rose-50 transition text-sm"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => handleVerification("verified")}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition text-sm"
                  >
                    Approve & Verify Host
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image zoom modal */}
      {imageModalUrl && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4" onClick={() => setImageModalUrl(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-gray-300">
            <X size={30} />
          </button>
          <img src={imageModalUrl} alt="Zoomed ID proof" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
        </div>
      )}
    </div>
  );
}
