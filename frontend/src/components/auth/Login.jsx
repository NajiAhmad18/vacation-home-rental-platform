import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye, EyeOff, Mail, Lock, AlertCircle, ArrowLeft,
  LogIn, ShieldCheck, Star, Home,
} from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore.js";

const TESTIMONIAL = {
  text: "LuxeKey made our Bali honeymoon unforgettable. The villa was exactly as described — impeccably verified.",
  author: "Priya & James",
  location: "Colombo, Sri Lanka",
  rating: 5,
};

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const authError = useAuthStore((state) => state.error);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email address.";
    if (!formData.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      await login(formData);
      navigate("/");
    } catch (error) {
      setErrors({ submit: error.message || "Invalid email or password." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Back to Home ─────────────────────────── */}
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
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=85')" }}
      >
        {/* Gradient overlay */}
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

        {/* Main text */}
        <div className="relative z-10 text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-300 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-white/10 mb-5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Luxury Stays Worldwide
          </div>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
            Unlock Premium
            <br />
            <span className="text-blue-300">Stay Experiences</span>
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            Sign in to manage your bookings, access your wishlist, and check out securely with your verified credentials.
          </p>

          {/* Features */}
          <div className="flex flex-col gap-3 mt-7">
            {[
              "Instant booking confirmation",
              "Stripe-encrypted secure payments",
              "24/7 dedicated guest support",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-white/80">
                <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                </div>
                {f}
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-10 p-5 bg-white/8 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="flex gap-1 mb-2">
              {[...Array(TESTIMONIAL.rating)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" />
              ))}
            </div>
            <p className="text-white/85 text-xs italic leading-relaxed">"{TESTIMONIAL.text}"</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {TESTIMONIAL.author[0]}
              </div>
              <div>
                <p className="text-white text-xs font-semibold">{TESTIMONIAL.author}</p>
                <p className="text-white/50 text-[10px]">{TESTIMONIAL.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel (Form) ────────────────────── */}
      <div className="flex-1 flex items-center justify-center min-h-screen md:min-h-0 bg-white px-6 sm:px-12 lg:px-16 py-20">
        <div className="max-w-md w-full">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Home className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900">LuxeKey</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to your <span className="font-semibold text-blue-600">LuxeKey</span> account to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email" name="email" type="email"
                  value={formData.email} onChange={handleInputChange}
                  placeholder="name@example.com"
                  className={`input-premium pl-11 ${errors.email ? "error" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-700 link-hover">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password} onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`input-premium pl-11 pr-12 ${errors.password ? "error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.password}
                </p>
              )}
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition"
              />
              <span className="text-sm text-gray-600 font-medium">Keep me signed in</span>
            </label>

            {/* Error banner */}
            {(errors.submit || authError) && (
              <div className="rounded-2xl bg-red-50 border border-red-100 p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{errors.submit || authError}</p>
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
                  Verifying…
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In to LuxeKey
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-3">
            <p className="text-sm text-gray-500">
              New to LuxeKey?{" "}
              <Link to="/auth/sign-up" className="font-bold text-blue-600 hover:text-blue-700 transition link-hover">
                Create a free account
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              Want to host your space?{" "}
              <Link to="/auth/owner/sign-up" className="font-semibold text-blue-600 hover:text-blue-700 transition link-hover">
                Register as a Host
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
