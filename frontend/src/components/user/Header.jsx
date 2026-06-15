import React, { useState, useEffect, useRef } from "react";
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
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  {
    /*TODO: change the unreadNotifications to actual count from useNotificationStore.js */
  }

  const unreadNotifications = 2;
  // const unreadNotifications = useNotificationStore(
  //   (state) => state.unreadCount
  // );

  {
    /*TODO: change the wishlistCount to actual count from useuseWishlistStore.js */
  }
  const wishlistCount = 2;
  // const wishlistCount = useWishlistStore((state) => state.items.length);

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
    { name: "Home", href: "/", icon: Home },
    { name: "Explore Rentals", href: "/explore", icon: Search },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  const getRandomColor = () => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">
                StayFinder
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{link.name}</span>
                </a>
              );
            })}
          </div>

          {/* Desktop Auth / User Info */}
          <div className="hidden md:flex items-center space-x-4 relative">
            <a
              href="/wishlist"
              className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              <div className="relative">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-3 flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-medium">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </a>

            <a
              href="/notifications"
              className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition"
            >
              <div className="relative">
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-2 -right-3 flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-medium">
                    {unreadNotifications}
                  </span>
                )}
              </div>
            </a>

            {!user ? (
              <>
                <a
                  href="/auth/sign-in"
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </a>
                <a
                  href="/auth/sign-up"
                  className="flex items-center space-x-1 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </a>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-md hover:bg-gray-200 transition"
                >
                  {user?.profile?.profileImage ? (
                    <img
                      src={user.profile.profileImage}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${getRandomColor()}`}
                    >
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="text-gray-800 font-medium">
                    {user.username}
                  </span>
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                    >
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </a>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition"
                  onClick={() => setIsOpen(false)}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{link.name}</span>
                </a>
              );
            })}

            <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
              <a
                href="/wishlist"
                className="relative flex items-center space-x-2 text-gray-600 hover:text-red-500 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition"
                onClick={() => setIsOpen(false)}
              >
                <Heart className="w-5 h-5" />
                <span>Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </a>

              <a
                href="/notifications"
                className="relative flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition"
                onClick={() => setIsOpen(false)}
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </a>

              {!user ? (
                <>
                  <a
                    href="/auth/sign-in"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </a>
                  <a
                    href="/signup"
                    className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium transition mx-3 mt-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Sign Up</span>
                  </a>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-md">
                    {user?.profile?.profileImage ? (
                      <img
                        src={user.profile.profileImage}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${getRandomColor()}`}
                      >
                        {user?.username?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="text-gray-800 font-medium">
                      {user.username}
                    </span>
                  </div>

                  <a
                    href="/profile"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Profile</span>
                  </a>

                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md text-base font-medium transition focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
