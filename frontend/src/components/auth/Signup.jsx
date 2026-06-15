import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Key,
  ArrowLeft,
  Building,
  Heart,
} from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore.js";
import toast from "react-hot-toast";

const Signup = ({ type = "user" }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const signupUser = useAuthStore((state) => state.signupUser);
  const signupRoomOwner = useAuthStore((state) => state.signupRoomOwner);

  // Colors and icons for user vs owner
  const isOwner = type === "owner";
  const focusRingColor = isOwner ? "focus:ring-blue-500" : "focus:ring-indigo-500";
  const Icon = isOwner ? Building : Heart;

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Please enter a valid email address";

    if (!formData.password) newErrors.password = "Password is required";
    else if (!validatePassword(formData.password))
      newErrors.password = "Password must be at least 6 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

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
      if (isOwner) await signupRoomOwner(formData);
      else await signupUser(formData);

      toast.success(
        `${isOwner ? "Host" : "Guest"} account created successfully!`
      );
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Failed to create account.");
      setErrors({
        submit: error.message || "Failed to create account.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Back to Home floating button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-gray-100 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* 1. Left Graphic Panel (Hidden on mobile) */}
      <div
        className="hidden md:flex md:w-1/2 relative bg-cover bg-center items-center p-16 text-left"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/20 backdrop-blur-[1px]"></div>

        <div className="relative z-10 max-w-lg mt-auto text-white">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-6">
            <Key className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            {isOwner ? "Host & Earn with LuxeKey" : "Explore verified boutique stays"}
          </h2>
          <p className="text-gray-200 mt-4 leading-relaxed text-sm sm:text-base">
            {isOwner
              ? "List your room, apartment, or villa to connect with travelers. Recieve encrypted Stripe payouts with automated billing support."
              : "Create a guest account to curate stays, access instant elements booking, and download PDF receipts."}
          </p>
        </div>
      </div>

      {/* 2. Right Form Panel */}
      <div className="flex-1 flex items-center justify-center py-20 px-6 sm:px-12 lg:px-16 bg-slate-50/30">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {isOwner ? "Become a Host" : "Create Account"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Join <span className="font-semibold text-blue-600">LuxeKey</span> to start planning your stays.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <InputField
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              error={errors.username}
              Icon={User}
              focusRingColor={focusRingColor}
            />

            {/* Email */}
            <InputField
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email address"
              error={errors.email}
              Icon={Mail}
              focusRingColor={focusRingColor}
            />

            {/* Password */}
            <PasswordField
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              show={showPassword}
              setShow={setShowPassword}
              placeholder="Password"
              error={errors.password}
              Icon={Lock}
              focusRingColor={focusRingColor}
            />

            {/* Confirm Password */}
            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
              placeholder="Confirm password"
              error={errors.confirmPassword}
              Icon={Lock}
              match={
                formData.password === formData.confirmPassword &&
                formData.confirmPassword
              }
              focusRingColor={focusRingColor}
            />

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-150 rounded-2xl p-3.5 text-left">
                <p className="text-xs text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{errors.submit}</span>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-md shadow-blue-500/10 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none transition duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                `Register as ${isOwner ? "Host" : "Guest"}`
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6 space-y-3">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/auth/sign-in" className="font-semibold text-blue-600 hover:text-blue-700 transition">
                Sign in
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              {isOwner ? "Looking to rent vacation stays instead?" : "Want to list your vacation property?"}{" "}
              <Link
                to={isOwner ? "/auth/sign-up" : "/auth/owner/sign-up"}
                className="font-semibold text-blue-600 hover:text-blue-700 transition block sm:inline-block mt-1 sm:mt-0"
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

// Reusable Input Field Component
const InputField = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  error,
  Icon,
  focusRingColor,
}) => (
  <div>
    <label htmlFor={id} className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 text-left">
      {placeholder}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`block w-full pl-11 pr-4 py-3.5 bg-white border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all shadow-sm ${
          error ? "border-red-300 bg-red-50/50" : "border-gray-200"
        }`}
        placeholder={placeholder}
      />
    </div>
    {error && (
      <p className="mt-1.5 text-xs text-red-600 flex items-center text-left">
        <AlertCircle className="w-3.5 h-3.5 mr-1" />
        {error}
      </p>
    )}
  </div>
);

// Reusable Password Field Component
const PasswordField = ({
  id,
  name,
  value,
  onChange,
  show,
  setShow,
  placeholder,
  error,
  Icon,
  match,
  focusRingColor,
}) => (
  <div>
    <label htmlFor={id} className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 text-left">
      {placeholder}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        className={`block w-full pl-11 pr-11 py-3.5 bg-white border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all shadow-sm ${
          error ? "border-red-300 bg-red-50/50" : "border-gray-200"
        }`}
        placeholder={placeholder}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-4 flex items-center"
        onClick={() => setShow(!show)}
      >
        {show ? (
          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        ) : (
          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        )}
      </button>
    </div>
    {error && (
      <p className="mt-1.5 text-xs text-red-600 flex items-center text-left">
        <AlertCircle className="w-3.5 h-3.5 mr-1" />
        {error}
      </p>
    )}
    {match && !error && (
      <p className="mt-1.5 text-xs text-green-600 flex items-center text-left">
        <CheckCircle className="w-3.5 h-3.5 mr-1" />
        Passwords match
      </p>
    )}
  </div>
);

export default Signup;
