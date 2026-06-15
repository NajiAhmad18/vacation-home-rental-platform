import React from "react";
import { Link } from "react-router-dom";
import { Home, Mail, Phone, MapPin, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-md shadow-blue-500/10">
                <Home className="text-white h-5 w-5" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">LuxeKey</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed text-sm">
              Your premium destination for finding the perfect, verified vacation home rental. We make booking stays simple, secure, and stress-free.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 hover:text-white rounded-lg transition duration-200">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 hover:text-white rounded-lg transition duration-200">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">Explore</h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/explore" className="text-gray-400 hover:text-white transition duration-200">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link to="/owner" className="text-gray-400 hover:text-white transition duration-200">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition duration-200">
                  About LuxeKey
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition duration-200">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>100 Galle Road, Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
                <span>support@luxekey.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 leading-normal">
          <p>&copy; {new Date().getFullYear()} LuxeKey Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <a href="#" className="hover:text-gray-300">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
