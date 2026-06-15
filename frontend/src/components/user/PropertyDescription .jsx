import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const PropertyDescription = ({ description }) => {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  const TRUNCATED_HEIGHT = 200; // initial truncated height in px

  const updateHeight = () => {
    if (contentRef.current) {
      setHeight(expanded ? `${contentRef.current.scrollHeight}px` : `${TRUNCATED_HEIGHT}px`);
    }
  };

  // Update height when description or expanded state changes
  useEffect(() => {
    updateHeight();
  }, [expanded, description]);

  // Recalculate height on window resize for responsiveness
  useEffect(() => {
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [expanded, description]);

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>

      <motion.div
        animate={{ height }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="relative bg-gray-50 border border-gray-200 shadow-sm rounded-xl overflow-hidden"
      >
        {/* Container padding ensures bottom space */}
        <div ref={contentRef} className="prose prose-lg px-6 py-10 whitespace-pre-line">
          {description}
        </div>

        {/* Inner bottom shadow when truncated */}
        {!expanded && (
          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-gray-50 to-transparent"></div>
        )}
      </motion.div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
      >
        {expanded ? "Show Less" : "Show More"}
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="inline-block"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>
    </div>
  );
};

export default PropertyDescription;
