import React, { useEffect, useState } from "react";
import FilterBar from "../components/user/Filter.jsx";
import PropertyCard from "../components/user/PropertyCard.jsx";
import Pagination from "../components/user/Pagination.jsx";
import { useHomeStore } from "../stores/useHomeStore.js";
import { Search, Compass, SlidersHorizontal } from "lucide-react";

export default function ExplorePage() {
  const { homes, fetchAllHomes, loading, error } = useHomeStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const propertiesPerPage = 8;

  useEffect(() => {
    fetchAllHomes();
  }, [fetchAllHomes]);

  // Handle Search & Filter logic
  const filteredProperties = homes.filter((home) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = home.title?.toLowerCase().includes(query);
    const locationMatch = home.location?.toLowerCase().includes(query) || home.address?.toLowerCase().includes(query);
    const descMatch = home.description?.toLowerCase().includes(query);
    return titleMatch || locationMatch || descMatch;
  });

  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const endIndex = startIndex + propertiesPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-12 px-4 mb-8">
        <div className="max-w-7xl mx-auto text-center md:text-left md:flex justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-extrabold flex items-center justify-center md:justify-start space-x-2">
              <Compass className="w-8 h-8 text-blue-400 animate-spin-slow" />
              <span>Explore Stays</span>
            </h1>
            <p className="text-blue-100 mt-2 text-sm md:text-base">
              Discover verified rooms, villas, and apartments tailored for you.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative max-w-md w-full mx-auto md:mx-0">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by city, title, or keywords..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 transition-all duration-350 text-sm shadow-inner"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Render horizontal category filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6">
          <FilterBar properties={homes} />
        </div>

        {/* Listings Status */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-800">{filteredProperties.length}</span> unique stays
          </p>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm font-medium">Fetching verified listings...</p>
          </div>
        ) : error ? (
          <div className="min-h-[300px] bg-white rounded-2xl border border-red-100 p-8 text-center flex flex-col items-center justify-center">
            <p className="text-red-500 font-semibold mb-2">Failed to load properties</p>
            <p className="text-gray-500 text-sm max-w-md">{error}</p>
          </div>
        ) : currentProperties.length === 0 ? (
          <div className="min-h-[350px] bg-white rounded-3xl border border-gray-100 p-12 text-center flex flex-col items-center justify-center shadow-sm">
            <SlidersHorizontal className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-800">No properties found</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-md">
              We couldn't find any stays matching your filters or search keywords. Try adjusting your search query or reset filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>

            {/* Pagination */}
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
