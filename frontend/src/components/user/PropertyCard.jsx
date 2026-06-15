import React, { useState } from "react";
import { Heart, MapPin, BedDouble, Bath, Star, Wifi, Car, Snowflake } from "lucide-react";
import { useNavigate } from "react-router-dom";

const amenityIcons = {
  WiFi: Wifi,
  Parking: Car,
  "Air Conditioning": Snowflake,
};

const PropertyCard = ({ property }) => {
  const [isLiked, setIsLiked] = useState(property.isLiked || false);
  const navigate = useNavigate();

  const handleLikeToggle = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const rating = property.averageRating?.toFixed(1) || "0.0";
  const reviewCount = property.reviewsCount || 0;
  const price = property.price?.toLocaleString() || "0";

  return (
    <div
      onClick={() => navigate(`/home/${property._id}`)}
      className="property-card animate-fade-in"
      style={{ animationDuration: "0.4s" }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "220px" }}>
        <img
          src={property.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80"}
          alt={property.title}
          className="card-img"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Wishlist button */}
        <button
          onClick={handleLikeToggle}
          className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full shadow-lg transition-all duration-200 ${
            isLiked
              ? "bg-rose-500 text-white scale-110"
              : "bg-white/90 text-gray-500 hover:text-rose-500 hover:scale-105"
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        </button>

        {/* Rating badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-sm">
          <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
          <span className="text-xs font-bold text-gray-900">{rating}</span>
          {reviewCount > 0 && (
            <span className="text-xs text-gray-500">({reviewCount})</span>
          )}
        </div>

        {/* Price badge */}
        <div className="absolute bottom-3 right-3 bg-blue-600 text-white px-3 py-1.5 rounded-xl shadow-sm">
          <span className="text-sm font-bold">${price}</span>
          <span className="text-[10px] text-blue-200 ml-0.5">/night</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold mb-2">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">
            {property.location?.city || "Unknown City"}
            {property.location?.district ? `, ${property.location.district}` : ""}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-3">
          {property.title || "Luxury Vacation Stay"}
        </h3>

        {/* Divider */}
        <div className="divider" style={{ margin: "12px 0" }} />

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5 text-gray-400" />
            <span>{property.bedrooms || 1} Bed{property.bedrooms !== 1 ? "s" : ""}</span>
          </div>
          <div className="h-3.5 w-px bg-gray-200" />
          <div className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5 text-gray-400" />
            <span>{property.bathrooms || 1} Bath{property.bathrooms !== 1 ? "s" : ""}</span>
          </div>
          <div className="h-3.5 w-px bg-gray-200" />
          <div className="flex gap-1 flex-wrap">
            {property.features?.slice(0, 1).map((f, i) => (
              <span key={i} className="pill pill-blue text-[10px] px-2 py-0.5">{f}</span>
            ))}
            {property.features?.length > 1 && (
              <span className="text-[10px] text-gray-400 font-medium">+{property.features.length - 1}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
