import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropertyCard from "../components/user/PropertyCard.jsx";
import { useHomeStore } from "../stores/useHomeStore.js";
import {
  Search,
  Compass,
  ShieldCheck,
  CreditCard,
  HeartHandshake,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

function HomePage() {
  const { homes, fetchAllHomes, loading, error } = useHomeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllHomes();
  }, [fetchAllHomes]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?query=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/explore");
    }
  };

  const trendingDestinations = [
    { name: "Bali", count: "42 stays", query: "Bali", gradient: "from-amber-400 to-orange-500" },
    { name: "Paris", count: "29 stays", query: "Paris", gradient: "from-pink-500 to-rose-600" },
    { name: "Kyoto", count: "18 stays", query: "Kyoto", gradient: "from-emerald-400 to-teal-600" },
    { name: "Cape Town", count: "12 stays", query: "Cape Town", gradient: "from-blue-500 to-indigo-600" },
  ];

  // Slice the first 4 homes for featured stays
  const featuredHomes = homes.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* 1. Hero Search Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        {/* Soft Background circles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          <span className="inline-flex items-center space-x-1.5 bg-blue-500/10 text-blue-400 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 border border-blue-500/20">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Discover Verified Holiday Stays</span>
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15]">
            Find Your Next{" "}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Dream Stay
            </span>
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-base sm:text-lg text-blue-100/80 leading-relaxed">
            Book fully verified room listings, private beach villas, and city apartments with Stripe-encrypted checkouts.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto mt-10 bg-white p-2 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col sm:flex-row gap-2 border border-gray-100"
          >
            <div className="flex-1 relative flex items-center px-4">
              <Search className="w-5 h-5 text-gray-400 absolute left-4" />
              <input
                type="text"
                placeholder="Where do you want to stay? (e.g. Colombo, Bali...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 py-3 text-gray-800 placeholder-gray-400 text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl sm:rounded-2xl transition duration-200 text-sm shadow-md shadow-blue-500/10 flex items-center justify-center space-x-2"
            >
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. Value Propositions / Trust Factors */}
        <section className="py-12 -mt-8 relative z-10">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Verified Stays</h3>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  Every home photo and location coordinate is audited for accuracy.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Safe Stripe Payments</h3>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  Fully encrypted, 3D-Secure checkouts with automated invoice generation.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">24/7 Local Support</h3>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  Dedicated guest helpline to support reservations and host coordination.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Trending Destinations Section */}
        <section className="py-8">
          <div className="flex justify-between items-end mb-8 text-left">
            <div>
              <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Inspiration</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">Trending Destinations</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trendingDestinations.map((dest) => (
              <Link
                key={dest.name}
                to={`/explore?query=${encodeURIComponent(dest.query)}`}
                className="group relative h-40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Visual gradient cover acting as placeholder for local images */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${dest.gradient} opacity-90 transition-opacity duration-300 group-hover:opacity-100`}></div>
                
                {/* Overlay pattern for depth */}
                <div className="absolute inset-0 bg-black/10"></div>
                
                <div className="absolute bottom-6 left-6 text-left text-white">
                  <h3 className="text-lg font-bold">{dest.name}</h3>
                  <p className="text-xs text-white/80 mt-1 font-medium">{dest.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Host Promotional Banner (Ad) */}
        <section className="py-10">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl text-white p-8 sm:p-12 text-left relative overflow-hidden shadow-lg flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="relative z-10 max-w-xl">
              <span className="bg-white/10 text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-white/20">
                Partner Hosting
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-4 tracking-tight leading-tight">
                Earn Income Hosting Your Vacation Space
              </h2>
              <p className="text-blue-100 mt-3 text-sm leading-relaxed">
                List your room or villa on StayFinder and start welcoming global guests. Safe payouts, guest validation, and automated PDF invoice billing.
              </p>
            </div>
            <div className="relative z-10 flex-shrink-0">
              <Link
                to="/owner"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 hover:bg-blue-50 font-bold px-6 py-3.5 rounded-2xl shadow-md transition duration-200 text-sm"
              >
                <span>List Your Room</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Featured Properties Section */}
        <section className="py-10">
          <div className="flex justify-between items-end mb-8 text-left">
            <div>
              <span className="text-blue-600 text-xs font-bold uppercase tracking-wider flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Featured Stays</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                Explore Popular Rentals
              </h2>
            </div>
            <Link
              to="/explore"
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center space-x-1 group"
            >
              <span>Explore All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="min-h-[200px] flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm">Fetching featured stays...</p>
            </div>
          ) : error ? (
            <p className="text-center text-red-500 py-10 font-medium">{error}</p>
          ) : featuredHomes.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
              <p className="text-gray-500 text-sm font-medium">No vacation properties listed yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredHomes.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default HomePage;
