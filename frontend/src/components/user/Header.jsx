import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Heart,
  Home,
  Search,
  Info,
  Phone,
  LogIn,
  UserPlus,
  LogOut,
  Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../stores/useAuthStore.js";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const unreadNotifications = 3;
  const wishlistCount = 4;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", to: "/", icon: Home },
    { name: "Explore Stays", to: "/explore", icon: Search },
    { name: "About", to: "/about", icon: Info },
    { name: "Contact", to: "/contact", icon: Phone },
  ];

  const getRandomColor = () => {
    const colors = [
      "bg-blue-500",
      "bg-emerald-500",
      "bg-rose-500",
      "bg-violet-500",
      "bg-amber-500",
      "bg-indigo-500",
      "bg-cyan-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100 py-2"
          : "bg-white border-b border-gray-100 py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              LuxeKey
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`
                  }
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Desktop Auth / User Info */}
          <div className="hidden md:flex items-center space-x-4 relative">
            <Link
              to="/wishlist"
              className="relative p-2 text-gray-500 hover:text-rose-500 hover:bg-gray-50 rounded-full transition-colors duration-200"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-semibold ring-2 ring-white animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/notifications"
              className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-full transition-colors duration-200"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-semibold ring-2 ring-white">
                  {unreadNotifications}
                </span>
              )}
            </Link>

            {!user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-gray-200">
                <Link
                  to="/auth/sign-in"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium rounded-xl transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/auth/sign-up"
                  className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-5 py-2.5 rounded-xl text-sm font-medium shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/15 transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            ) : (
              <div className="relative pl-2 border-l border-gray-200" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100/80 border border-gray-100 px-3 py-1.5 rounded-xl transition-all duration-200"
                >
                  {user?.profile?.profileImage ? (
                    <img
                      src={user.profile.profileImage}
                      alt="Profile"
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-200"
                    />
                  ) : (
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-inner ${getRandomColor()}`}
                    >
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="text-gray-700 text-sm font-medium max-w-[120px] truncate">
                    {user.username}
                  </span>
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-1 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-50 text-left">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user.email || user.username}
                        </p>
                        <p className="text-[10px] inline-block px-2 py-0.5 mt-1 bg-blue-50 text-blue-600 rounded-full font-medium capitalize">
                          {user.role === "roomOwner" ? "Host" : user.role || "Guest"}
                        </p>
                      </div>

                      {user.role === "roomOwner" && (
                        <Link
                          to="/owner"
                          onClick={() => setShowDropdown(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors text-left"
                        >
                          Host Dashboard
                        </Link>
                      )}

                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setShowDropdown(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors text-left"
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors text-left"
                      >
                        Profile Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 mt-1 text-sm text-rose-600 bg-rose-50 hover:bg-rose-100/70 rounded-xl transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {!user && (
              <Link
                to="/auth/sign-in"
                className="text-sm font-semibold text-blue-600 px-3 py-1.5 bg-blue-50 rounded-xl"
              >
                Login
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-inner"
          >
            <div className="px-4 pt-2 pb-6 space-y-1.5">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <NavLink
                    key={link.name}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`
                    }
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}

              <div className="border-t border-gray-100 pt-3 mt-3 space-y-1">
                <Link
                  to="/wishlist"
                  className="relative flex items-center space-x-3 text-gray-600 hover:text-rose-600 hover:bg-gray-50 px-4 py-3 rounded-xl text-base font-medium transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="absolute right-4 bg-rose-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/notifications"
                  className="relative flex items-center space-x-3 text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-4 py-3 rounded-xl text-base font-medium transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                  {unreadNotifications > 0 && (
                    <span className="absolute right-4 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>

                {user ? (
                  <div className="pt-3 border-t border-gray-50">
                    <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-xl mb-2">
                      {user?.profile?.profileImage ? (
                        <img
                          src={user.profile.profileImage}
                          alt="Profile"
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold ${getRandomColor()}`}
                        >
                          {user?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-800">{user.username}</p>
                        <p className="text-[10px] text-gray-400 font-medium capitalize">
                          {user.role === "roomOwner" ? "Host" : user.role || "Guest"}
                        </p>
                      </div>
                    </div>

                    {user.role === "roomOwner" && (
                      <Link
                        to="/owner"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-xl text-left"
                      >
                        Host Dashboard
                      </Link>
                    )}

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-xl text-left"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-xl text-left"
                    >
                      Profile Settings
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full mt-2 text-left px-4 py-3 text-base text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl flex items-center space-x-3"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <Link
                      to="/auth/sign-in"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/auth/sign-up"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/10"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
