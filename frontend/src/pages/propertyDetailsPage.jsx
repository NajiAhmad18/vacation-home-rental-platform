import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  MapPin, Heart, Share2, Star, Calendar, ExternalLink,
  ArrowLeft, BedDouble, Bath, Ruler, Layers, Car,
  ShieldCheck, ArrowRight, Tag,
} from "lucide-react";
import PropertyGallery from "../components/user/PropertyGallery.jsx";
import OverviewItem from "../components/user/OverviewItem.jsx";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useMap } from "../../provider/GoogleMapsProvider.jsx";
import { useHomeStore } from "../stores/useHomeStore.js";
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--surface)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading property…</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--surface)" }}>
        <div className="card p-12 text-center max-w-md">
          <p className="text-red-500 font-semibold">{error}</p>
          <button onClick={() => navigate(-1)} className="btn-primary mt-4 px-6 py-2.5 text-sm">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    );

  if (!home)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--surface)" }}>
        <div className="card p-12 text-center max-w-md">
          <p className="text-gray-500 font-medium">Property not found.</p>
        </div>
      </div>
    );

  const toggleWishlist = () => setIsWishlisted(!isWishlisted);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen pb-20 page-enter" style={{ background: "var(--surface)" }}>
      {/* ── Sub-header ───────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back to Explore</span>
          </button>
          <div className="flex items-center gap-3">
            {/* Share */}
            <div className="relative">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <AnimatePresence>
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: -32 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-lg whitespace-nowrap shadow-lg"
                  >
                    Link Copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Wishlist */}
            <button
              onClick={toggleWishlist}
              className={`flex items-center gap-1.5 text-sm font-medium border px-3 py-1.5 rounded-xl transition-all ${
                isWishlisted
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : "text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">{isWishlisted ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Property Title Block ─────────────────── */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="pill pill-blue">Verified Stay</span>
            {home.features?.slice(0, 2).map((f, i) => (
              <span key={i} className="pill pill-green">{f}</span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 leading-tight mb-3">
            {home.title}
          </h1>
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="font-medium text-gray-700">
                {home.location?.city}, {home.location?.district}, {home.location?.province}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span className="font-bold text-gray-900">{home.averageRating?.toFixed(1) || "0.0"}</span>
              <span>({home.reviewsCount || 0} reviews)</span>
            </span>
          </div>
        </div>

        {/* ── Main Grid ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left Column ─── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <PropertyGallery images={home.images} title={home.title} />

            {/* Description */}
            <div className="card p-6">
              <PropertyDescription description={home.description} />
            </div>

            {/* Features & Amenities */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                Features & Amenities
              </h2>
              {home.features?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {home.features.map((feature, idx) => (
                    <span key={idx} className="feature-tag">{feature}</span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No features listed for this property.</p>
              )}
            </div>

            {/* Property Overview */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Property Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <OverviewItem icon={BedDouble} value={home.bedrooms} label="Bedrooms" />
                <OverviewItem icon={Bath} value={home.bathrooms} label="Bathrooms" />
                <OverviewItem icon={Ruler} value={`${home.floorArea} m²`} label="Floor Area" />
                <OverviewItem icon={Layers} value={home.floors} label="Floors" />
                <OverviewItem icon={Ruler} value={`${home.landArea} m²`} label="Land Area" />
                <OverviewItem icon={Car} value={home.parking} label="Parking" />
              </div>
            </div>
          </div>

          {/* ── Right Column (Sidebar) ─── */}
          <div className="space-y-5 lg:sticky lg:top-24 self-start">
            {/* Booking card */}
            <div className="card p-6 shadow-lg">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Price per night</p>
                  <div className="text-3xl font-black text-gray-900 mt-0.5">
                    ${home.price?.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    <span className="text-xs font-semibold text-gray-700">{home.averageRating?.toFixed(1) || "0.0"}</span>
                    <span className="text-xs text-gray-400">· {home.reviewsCount || 0} reviews</span>
                  </div>
                </div>
                <button
                  onClick={toggleWishlist}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
                    isWishlisted
                      ? "bg-rose-500 text-white border-rose-500"
                      : "text-gray-500 border-gray-200 hover:text-rose-500"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
              </div>

              <button
                onClick={() => navigate(`/book-home/${home._id}`)}
                className="btn-primary w-full py-4 text-sm font-bold rounded-2xl mb-3"
                style={{ borderRadius: "16px" }}
              >
                <Calendar className="w-4 h-4" />
                Reserve This Stay
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-xs text-gray-400 mb-4">
                You won't be charged until booking is confirmed
              </p>

              {/* Cost breakdown */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>${home.price?.toLocaleString()} × night</span>
                  <span>per night</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Cleaning fee</span>
                  <span>$75</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service fee</span>
                  <span>$89</span>
                </div>
                <div className="divider" style={{ margin: "8px 0" }} />
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total before taxes</span>
                  <span>${(home.price + 75 + 89)?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Trust */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Booking Guarantee</p>
              </div>
              <ul className="space-y-2 text-xs text-gray-500">
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" /> Verified property listing</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" /> Secure Stripe payment</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-violet-400 flex-shrink-0" /> 24/7 guest support</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" /> Instant booking confirmation</li>
              </ul>
            </div>

            {/* Google Map */}
            {home.location && isLoaded && (
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-gray-900 text-sm">Location</h3>
                </div>
                <div className="h-48 w-full rounded-2xl overflow-hidden border border-gray-100">
                  <GoogleMap
                    center={{ lat: home.location.latitude || 0, lng: home.location.longitude || 0 }}
                    zoom={15}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    options={{ fullscreenControl: false, zoomControl: true, streetViewControl: false, mapTypeControl: false }}
                  >
                    <Marker position={{ lat: home.location.latitude || 0, lng: home.location.longitude || 0 }} />
                  </GoogleMap>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${home.location.latitude},${home.location.longitude}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs text-blue-600 font-semibold hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in Google Maps
                </a>
                {home.location?.address && (
                  <p className="text-xs text-gray-500 mt-2">{home.location.address}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
