import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Heart,
  Share2,
  Star,
  Calendar,
  ExternalLink,
} from "lucide-react";
import PropertyGallery from "../components/user/PropertyGallery.jsx";
import OverviewItem from "../components/user/OverviewItem.jsx";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useMap } from "../../provider/GoogleMapsProvider.jsx";
import { useHomeStore } from "../stores/useHomeStore.js";
import { Home, Bath, Ruler, Layers, Car } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PropertyDescription from "../components/user/PropertyDescription .jsx";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getHomeById, loading, error } = useHomeStore();
  const [home, setHome] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { isLoaded } = useMap();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const data = await getHomeById(id);
        setHome(data);
      } catch (err) {
        console.error("Failed to fetch home:", err.message);
      }
    };
    fetchHome();
  }, [id, getHomeById]);

  if (loading) return <p className="text-center py-20">Loading home...</p>;
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;
  if (!home) return <p className="text-center py-20">No home found.</p>;

  const toggleWishlist = () => setIsWishlisted(!isWishlisted);

  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      })
      .catch((err) => console.error("Failed to copy link:", err));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {home.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-blue-600" />
              {home.location?.province}, {home.location?.district},{" "}
              {home.location?.city}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="font-medium text-gray-800">
                {home.averageRating?.toFixed(1) || "0.0"}
              </span>
              <span className="text-sm text-gray-500">
                ({home.reviewsCount || 0} reviews)
              </span>
            </span>
          </div>
        </div>

        {/* Share Button */}
        <div className="relative inline-block">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm border border-blue-200 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>

          {/* Floating "Copied" */}
          <AnimatePresence>
            {copied && (
              <motion.span
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -15 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="absolute left-1/2 -translate-x-1/2 -top-4 text-xs font-semibold text-white bg-black bg-opacity-80 px-2 py-1 rounded"
              >
                Copied
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 font-sans">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Image Gallery */}
          <PropertyGallery images={home.images} title={home.title} />

          {/* Description */}
          <PropertyDescription description={home.description} />

          {/* Features */}
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-4">
              Features & Amenities
            </h2>
            <div className="flex flex-wrap gap-2">
              {home.features?.map((feature, idx) => (
                <span
                  key={idx}
                  className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium shadow hover:scale-105 transition-transform"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Overview */}
          <div>
            <div className="grid grid-cols-2 gap-4">
              <OverviewItem
                icon={Home}
                value={home.bedrooms}
                label="Bedrooms"
              />
              <OverviewItem
                icon={Bath}
                value={home.bathrooms}
                label="Bathrooms"
              />
              <OverviewItem
                icon={Ruler}
                value={`${home.floorArea} m²`}
                label="Floor Area"
              />
              <OverviewItem icon={Layers} value={home.floors} label="Floors" />
              <OverviewItem
                icon={Ruler}
                value={`${home.landArea} m²`}
                label="Land Area"
              />
              <OverviewItem icon={Car} value={home.parking} label="Parking" />
            </div>
          </div>

          {/* Booking Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md space-y-4 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500">Price per night</div>
                <div className="text-2xl font-bold text-gray-900">
                  ${home.price?.toLocaleString()}
                </div>
              </div>
              <button
                onClick={toggleWishlist}
                title={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
                className={`p-2 rounded-full border transition-transform duration-200 ${
                  isWishlisted
                    ? "bg-red-500 text-white scale-110"
                    : "text-gray-600 hover:text-red-500 hover:scale-105"
                }`}
                aria-label="Toggle Wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => navigate(`/book-home/${home._id}`)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Check Availability
            </button>
          </div>

          {/* Location Map */}
          {home.location && isLoaded && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Section Header */}
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">
                  Location
                </h2>
              </div>

              {/* Google Map */}
              <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <GoogleMap
                  center={{
                    lat: home.location.latitude || 0,
                    lng: home.location.longitude || 0,
                  }}
                  zoom={15}
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  options={{
                    fullscreenControl: true,
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    rotateControl: false,
                    scaleControl: false,
                  }}
                >
                  <Marker
                    position={{
                      lat: home.location.latitude || 0,
                      lng: home.location.longitude || 0,
                    }}
                  />
                </GoogleMap>
              </div>

              {/* Google Maps Link */}
              <a
                href={`https://www.google.com/maps?q=${home.location.latitude},${home.location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mt-3 items-center gap-1 text-blue-600 font-medium hover:underline text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                View on Google Maps
              </a>

              {/* Address Info */}
              <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-inner">
                <h3 className="text-gray-700 font-medium text-sm mb-1">
                  Address
                </h3>
                <p className="text-gray-900 text-sm">
                  {home.location?.address || "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
