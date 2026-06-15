import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Heart,
  Building,
} from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore.js";
import { useNavigate } from "react-router-dom";
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
  const gradientFrom = isOwner ? "blue" : "pink";
  const gradientTo = isOwner ? "purple" : "rose";
  const focusRingColor = isOwner
    ? "focus:ring-blue-500"
    : "focus:ring-pink-500";
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
        `${isOwner ? "Owner" : "User"} account created successfully!`
      );
      navigate("/");
    } catch (error) {
      toast.error(
        error.message || "Failed to create account. Please try again."
      );
      setErrors({
        submit: error.message || "Failed to create account. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={
        isOwner
          ? "min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
          : "min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      }
    >
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className={
                isOwner
                  ? "mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
                  : "mx-auto w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center mb-4"
              }
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {isOwner ? "Join as Property Owner" : "Join StayFinder"}
            </h2>
            <p className="mt-2 text-gray-600">
              {isOwner
                ? "Start listing your properties and earn income"
                : "Discover amazing places to stay around the world"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              error={errors.username}
              Icon={User}
              focusRingColor={focusRingColor}
            />

            <InputField
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              error={errors.email}
              Icon={Mail}
              focusRingColor={focusRingColor}
            />

            <PasswordField
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              show={showPassword}
              setShow={setShowPassword}
              placeholder="Create a password"
              error={errors.password}
              Icon={Lock}
              focusRingColor={focusRingColor}
            />

            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              Icon={Lock}
              match={
                formData.password === formData.confirmPassword &&
                formData.confirmPassword
              }
              focusRingColor={focusRingColor}
            />

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.submit}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={
                isOwner
                  ? "w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  : "w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              }
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                `Create ${isOwner ? "Owner" : "User"} Account`
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/auth/sign-in"
                className={
                  isOwner
                    ? "font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    : "font-medium text-pink-600 hover:text-pink-500 transition-colors"
                }
              >
                Sign in here
              </a>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              {isOwner
                ? "Looking to rent instead?"
                : "Want to list your property?"}{" "}
              <a
                href={isOwner ? "/auth/sign-up" : "/auth/owner/sign-up"}
                className={
                  isOwner
                    ? "font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    : "font-medium text-pink-600 hover:text-pink-500 transition-colors"
                }
              >
                {isOwner ? "Sign up as a guest" : "Sign up as an owner"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Field
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
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {placeholder}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none ${focusRingColor} focus:border-transparent transition-colors ${
          error ? "border-red-300 bg-red-50" : "border-gray-300"
        }`}
        placeholder={placeholder}
      />
      {error && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
      )}
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-600 flex items-center">
        <AlertCircle className="w-4 h-4 mr-1" />
        {error}
      </p>
    )}
  </div>
);

// Reusable Password Field
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
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {placeholder}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none ${focusRingColor} focus:border-transparent transition-colors ${
          error ? "border-red-300 bg-red-50" : "border-gray-300"
        }`}
        placeholder={placeholder}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
      <p className="mt-1 text-sm text-red-600 flex items-center">
        <AlertCircle className="w-4 h-4 mr-1" />
        {error}
      </p>
    )}
    {match && !error && (
      <p className="mt-1 text-sm text-green-600 flex items-center">
        <CheckCircle className="w-4 h-4 mr-1" />
        Passwords match
      </p>
    )}
  </div>
);

export default Signup;
