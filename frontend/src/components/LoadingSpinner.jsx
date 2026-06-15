import React from "react";
import { motion } from "framer-motion";

const FullPageLoading = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex flex-col items-center justify-center z-50">
      {/* Animated Spinner using Framer Motion */}
      <motion.div
        className="w-16 h-16 border-b-4 border-blue-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      ></motion.div>

      {/* Optional Loading Message */}
      {message && (
        <p className="mt-4 text-white text-lg font-medium text-center">
          {message}
        </p>
      )}

      {/* Optional: pulsing dots animation */}
      <div className="flex space-x-2 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block w-3 h-3 bg-white rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 0.6,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FullPageLoading;
