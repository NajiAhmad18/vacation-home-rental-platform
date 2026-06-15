import React, { useState } from "react";
import { Heart, MapPin, Home, Bath, Ruler, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({ property }) => {
  const [isLiked, setIsLiked] = useState(property.isLiked || false);
  const navigate = useNavigate();

  const handleLikeToggle = (e) => {
    e.stopPropagation(); // prevent card click
    setIsLiked(!isLiked);
  };

  return (
    <div
      onClick={() => navigate(`/home/${property._id}`)}
      className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 group"
    >
      <div className="relative">
        <img
          src={property.images?.[0] || "/placeholder.png"}
          alt={property.title}
          className="w-full h-48 object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300"
        />

        <button
          onClick={handleLikeToggle}
          className={`absolute top-3 right-3 p-2 rounded-full ${
            isLiked
              ? "bg-red-500 text-white shadow-md"
              : "bg-white text-gray-600 hover:text-red-500"
          } transition-all duration-200`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
        </button>

        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-semibold text-gray-800">
            {property.averageRating?.toFixed(1) || "0.0"}
          </span>
          <span className="text-xs text-gray-500">
            ({property.reviewsCount || 0})
          </span>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
            {property.title}
          </h3>
          <div className="text-right">
            <span className="text-lg font-bold text-blue-600">
              ${property.price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 block">/month</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="h-4 w-4 mr-1 text-blue-500" />
          {property.location?.city}, {property.location?.district}
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            {property.bedrooms} Beds
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {property.bathrooms} Baths
          </div>
          <div className="flex items-center gap-1">
            <Ruler className="h-4 w-4" />
            {property.floorArea} sqft
          </div>
        </div>

        <div className="flex flex-wrap gap-1 pt-2">
          {property.features?.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
            >
              {feature}
            </span>
          ))}
          {property.features?.length > 3 && (
            <span className="text-xs text-gray-500">
              +{property.features.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
