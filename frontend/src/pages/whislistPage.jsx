import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlistStore } from "../stores/useWishlistStore.js";
import { useAuthStore } from "../stores/useAuthStore.js";
import {
  Heart, MapPin, Star, BedDouble, Bath, Home, ArrowRight, Loader2
} from "lucide-react";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const user = useAuthStore((state) => state.user);
  const { wishlist, loading, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user, fetchWishlist]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--surface)" }}>
        <div className="card p-12 text-center max-w-sm mx-4">
          <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to see your Wishlist</h2>
          <p className="text-gray-500 text-sm mb-6">Save your favourite stays and access them anytime.</p>
          <Link to="/auth/sign-in" className="btn-primary px-6 py-3 text-sm">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--surface)" }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-500 text-sm">Loading your wishlist…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 page-enter" style={{ background: "var(--surface)" }}>

      {/* Hero Banner */}
      <div
        className="relative overflow-hidden py-14 px-4 text-white"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #312e81 100%)" }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-300 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-white/10 mb-4">
            <Heart className="w-3.5 h-3.5" />
            Saved Properties
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">My Wishlist</h1>
          <p className="text-blue-200 text-sm">
            {wishlist.length > 0
              ? `${wishlist.length} ${wishlist.length === 1 ? "property" : "properties"} saved`
              : "No saved properties yet."}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {wishlist.length === 0 ? (
          <div className="card p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-rose-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 text-sm max-w-sm mb-6">
              Start browsing and tap the heart icon on any property to save it here.
            </p>
            <Link to="/explore" className="btn-primary px-8 py-3 text-sm">
              Browse Properties
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((property, i) => (
              <div
                key={property._id}
                className="card overflow-hidden group animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80"}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromWishlist(property._id)}
                    className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-rose-500 text-white shadow-lg hover:bg-rose-600 transition-all duration-200"
                    aria-label="Remove from wishlist"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>

                  {/* Rating */}
                  {property.averageRating > 0 && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-sm">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
                      <span className="text-xs font-bold text-gray-900">{property.averageRating?.toFixed(1)}</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="absolute bottom-3 right-3 bg-blue-600 text-white px-3 py-1.5 rounded-xl shadow-sm">
                    <span className="text-sm font-bold">${property.price?.toLocaleString()}</span>
                    <span className="text-[10px] text-blue-200 ml-0.5">/night</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold mb-1.5">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">
                      {property.location?.city || "Unknown City"}
                      {property.location?.district ? `, ${property.location.district}` : ""}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-3 line-clamp-1">{property.title}</h3>

                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    {property.bedrooms && (
                      <span className="flex items-center gap-1">
                        <BedDouble className="h-3.5 w-3.5" />
                        {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
                      </span>
                    )}
                    {property.bathrooms && (
                      <span className="flex items-center gap-1">
                        <Bath className="h-3.5 w-3.5" />
                        {property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}
                      </span>
                    )}
                    {property.maxGuests && (
                      <span className="flex items-center gap-1">
                        <Home className="h-3.5 w-3.5" />
                        {property.maxGuests} guests
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/home/${property._id}`}
                    className="btn-primary w-full py-2.5 text-xs"
                  >
                    View Property
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
