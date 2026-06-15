import React, { useEffect, useState } from "react";
import FilterBar from "../components/user/Filter.jsx";
import PropertyCard from "../components/user/PropertyCard.jsx";
import Pagination from "../components/user/Pagination.jsx";
import { useHomeStore } from "../stores/useHomeStore.js";
import { Search, Compass, SlidersHorizontal, X, MapPin, TrendingUp } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const QUICK_FILTERS = ["All", "Villa", "Apartment", "Studio", "Beachfront", "Mountain", "City"];

export default function ExplorePage() {
  const { homes, fetchAllHomes, loading, error } = useHomeStore();
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [activeFilter, setActiveFilter] = useState("All");
  const propertiesPerPage = 9;

  useEffect(() => {
    fetchAllHomes();
  }, [fetchAllHomes]);

  useEffect(() => {
    const q = searchParams.get("query");
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const filteredProperties = homes.filter((home) => {
    const query = searchQuery.toLowerCase().trim();
    const loc = home.location || {};
    const matchesSearch =
      !query ||
      home.title?.toLowerCase().includes(query) ||
      home.description?.toLowerCase().includes(query) ||
      loc.city?.toLowerCase().includes(query) ||
      loc.district?.toLowerCase().includes(query) ||
      loc.province?.toLowerCase().includes(query) ||
      loc.address?.toLowerCase().includes(query) ||
      home.address?.toLowerCase().includes(query);

    const matchesFilter =
      activeFilter === "All" ||
      home.title?.toLowerCase().includes(activeFilter.toLowerCase()) ||
      home.features?.some((f) => f.toLowerCase().includes(activeFilter.toLowerCase())) ||
      home.description?.toLowerCase().includes(activeFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const currentProperties = filteredProperties.slice(startIndex, startIndex + propertiesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen pb-20 page-enter" style={{ background: "var(--surface)" }}>

      {/* ── Header Banner ───────────────────────── */}
      <div
        className="relative overflow-hidden text-white py-16 px-4"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #312e81 100%)" }}
      >
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10 mb-4">
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                Explore Listings
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-2">
                Find Your Stay
              </h1>
              <p className="text-blue-200 text-sm">
                {homes.length > 0 ? `${homes.length} verified properties available` : "Browse verified rooms, villas, and apartments."}
              </p>
            </div>

            {/* Search input */}
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by city, title, or keywords…"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-12 pr-12 py-4 bg-white text-gray-900 placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-xl"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Quick Filters ────────────────────── */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
          </span>
          <div className="flex gap-2 flex-wrap">
            {QUICK_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeFilter === f
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Advanced filter bar ──────────────── */}
        <div className="card p-3 mb-6">
          <FilterBar properties={homes} />
        </div>

        {/* ── Status ──────────────────────────── */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-bold text-gray-900">{filteredProperties.length}</span>{" "}
              {filteredProperties.length === 1 ? "stay" : "stays"}
              {searchQuery && (
                <span className="text-gray-400"> for "<span className="text-blue-600 font-semibold">{searchQuery}</span>"</span>
              )}
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all"
            >
              <X className="w-3 h-3" /> Clear Search
            </button>
          )}
        </div>

        {/* ── Properties Grid ──────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden">
                <div className="skeleton" style={{ height: "220px" }} />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                  <div className="skeleton h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="card p-12 text-center">
            <p className="text-red-500 font-semibold text-sm mb-1">Failed to load properties</p>
            <p className="text-gray-400 text-xs">{error}</p>
          </div>
        ) : currentProperties.length === 0 ? (
          <div className="card p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
              <SlidersHorizontal className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No properties found</h3>
            <p className="text-gray-500 text-sm max-w-sm">
              We couldn't find any stays matching your search. Try adjusting your filters or search keywords.
            </p>
            <button
              onClick={() => { clearSearch(); setActiveFilter("All"); }}
              className="btn-primary mt-6 px-6 py-2.5 text-sm"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProperties.map((property, i) => (
                <div
                  key={property._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
