import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye, EyeOff, User, Mail, Lock, AlertCircle,
  CheckCircle, ArrowLeft, Home, ShieldCheck, Users, Building,
} from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore.js";
import toast from "react-hot-toast";

const HERO_IMAGES = {
  user: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=85",
  owner: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=85",
};

/* ── Reusable Input ─────────────────────────── */
const InputField = ({ id, name, type = "text", placeholder, value, onChange, error, Icon, label }) => (
  <div>
    <label htmlFor={id} className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
      {label || placeholder}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <input
        id={id} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
        className={`input-premium pl-11 ${error ? "error" : ""}`}
      />
    </div>
    {error && (
      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
      </p>
    )}
  </div>
);

/* ── Reusable Password Field ────────────────── */
const PasswordField = ({ id, name, value, onChange, show, setShow, placeholder, error, match }) => (
  <div>
    <label htmlFor={id} className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
      {placeholder}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Lock className="h-4 w-4 text-gray-400" />
      </div>
      <input
        id={id} name={name} type={show ? "text" : "password"} value={value} onChange={onChange}
        placeholder={placeholder}
        className={`input-premium pl-11 pr-12 ${error ? "error" : ""}`}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
    {error && (
      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
      </p>
    )}
    {match && !error && (
      <p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1">
        <CheckCircle className="w-3.5 h-3.5" /> Passwords match
      </p>
    )}
  </div>
);

/* ── Password strength indicator ────────────── */
const getPasswordStrength = (pw) => {
  if (!pw) return { label: "", color: "", width: "0%" };
  const score =
    (pw.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(pw) ? 1 : 0) +
    (/[0-9]/.test(pw) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(pw) ? 1 : 0);
  if (score <= 1) return { label: "Weak", color: "bg-red-400", width: "25%" };
  if (score === 2) return { label: "Fair", color: "bg-amber-400", width: "50%" };
  if (score === 3) return { label: "Good", color: "bg-blue-500", width: "75%" };
  return { label: "Strong", color: "bg-emerald-500", width: "100%" };
};

const Signup = ({ type = "user" }) => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const signupUser = useAuthStore((state) => state.signupUser);
  const signupRoomOwner = useAuthStore((state) => state.signupRoomOwner);
  const isOwner = type === "owner";
  const strength = getPasswordStrength(formData.password);

  /* ── Validation ───────────────────────────── */
  const validateForm = () => {
    const e = {};
    const uname = formData.username.trim();
    if (!uname) e.username = "Username is required.";
    else if (uname.length < 3) e.username = "Username must be at least 3 characters.";
    else if (!/^[a-zA-Z0-9_.-]+$/.test(uname)) e.username = "Username may only contain letters, numbers, underscores, dots, or hyphens.";

    if (!formData.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Please enter a valid email address.";

    if (!formData.password) e.password = "Password is required.";
    else if (formData.password.length < 6) e.password = "Password must be at least 6 characters.";

    if (!formData.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords do not match.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (isOwner) await signupRoomOwner(formData);
      else await signupUser(formData);
      toast.success(`${isOwner ? "Host" : "Guest"} account created successfully! Welcome to LuxeKey.`);
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Failed to create account.");
      setErrors({ submit: error.message || "Failed to create account." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Back button */}
      <Link
        to="/"
        className="absolute top-5 left-5 z-20 flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-3.5 py-2 rounded-xl border border-white/10 transition-all duration-200 md:text-gray-600 md:bg-white/90 md:hover:bg-white md:border-gray-100 md:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Link>

      {/* ── Left Panel ───────────────────────────── */}
      <div
        className="hidden md:flex md:w-5/12 lg:w-1/2 relative bg-cover bg-center flex-col justify-between p-12"
        style={{ backgroundImage: `url('${HERO_IMAGES[type]}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-blue-950/70 to-slate-900/60" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">LuxeKey</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-300 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-white/10 mb-5">
            {isOwner ? <Building className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
            {isOwner ? "Host Program" : "Guest Membership"}
          </div>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
            {isOwner ? "Earn by Sharing" : "Explore Verified"}
            <br />
            <span className="text-blue-300">{isOwner ? "Your Space" : "Luxury Stays"}</span>
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            {isOwner
              ? "List your room, apartment, or villa to earn steady income from a global network of verified travellers. Secure payouts, automated invoicing, full host support."
              : "Create a guest account to browse thousands of verified stays, build your wishlist, and book with fully secure Stripe-encrypted payments."}
          </p>

          <div className="flex flex-col gap-3 mt-7">
            {(isOwner
              ? ["Secure Stripe payouts", "Automated PDF invoicing", "Verified traveller bookings"]
              : ["Instant booking confirmation", "Curate your dream wishlist", "PDF receipt for every stay"]
            ).map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-white/80">
                <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel (Form) ────────────────────── */}
      <div className="flex-1 flex items-center justify-center min-h-screen md:min-h-0 bg-white px-6 sm:px-12 lg:px-16 py-20">
        <div className="max-w-md w-full">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900">LuxeKey</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {isOwner ? "Become a Host" : "Create Account"}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Join <span className="font-bold text-blue-600">LuxeKey</span> —{" "}
              {isOwner ? "start earning from your space today." : "your next adventure starts here."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <InputField
              id="username" name="username" placeholder="Choose a username"
              label="Username" value={formData.username} onChange={handleInputChange}
              error={errors.username} Icon={User}
            />
            <InputField
              id="email" name="email" type="email" placeholder="name@example.com"
              label="Email Address" value={formData.email} onChange={handleInputChange}
              error={errors.email} Icon={Mail}
            />

            {/* Password with strength */}
            <div>
              <PasswordField
                id="password" name="password" value={formData.password}
                onChange={handleInputChange} show={showPassword} setShow={setShowPassword}
                placeholder="Create Password" error={errors.password}
              />
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-400">Strength</span>
                    <span className={`text-[10px] font-semibold ${
                      strength.label === "Strong" ? "text-emerald-600" :
                      strength.label === "Good" ? "text-blue-600" :
                      strength.label === "Fair" ? "text-amber-600" : "text-red-500"
                    }`}>{strength.label}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                </div>
              )}
            </div>

            <PasswordField
              id="confirmPassword" name="confirmPassword" value={formData.confirmPassword}
              onChange={handleInputChange} show={showConfirm} setShow={setShowConfirm}
              placeholder="Confirm Password" error={errors.confirmPassword}
              match={formData.password === formData.confirmPassword && !!formData.confirmPassword}
            />

            {/* Error */}
            {errors.submit && (
              <div className="rounded-2xl bg-red-50 border border-red-100 p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-4 text-sm font-bold"
              style={{ borderRadius: "16px" }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  {isOwner ? <Building className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                  Register as {isOwner ? "Host" : "Guest"}
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-3">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/auth/sign-in" className="font-bold text-blue-600 hover:text-blue-700 transition link-hover">
                Sign in
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              {isOwner ? "Want to book stays instead?" : "Want to list your property?"}{" "}
              <Link
                to={isOwner ? "/auth/sign-up" : "/auth/owner/sign-up"}
                className="font-semibold text-blue-600 hover:text-blue-700 transition link-hover"
              >
                {isOwner ? "Register as Guest" : "Register as Host"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
