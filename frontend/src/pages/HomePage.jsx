import React, { useEffect, useState } from "react";
import FilterBar from "../components/user/Filter.jsx";
import PropertyCard from "../components/user/PropertyCard.jsx";
import Pagination from "../components/user/Pagination.jsx";
import { useHomeStore } from "../stores/useHomeStore.js";

function HomePage() {
  const { homes, fetchAllHomes, loading, error } = useHomeStore();
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 8;

  useEffect(() => {
    fetchAllHomes();
  }, []);

  const totalPages = Math.ceil(homes.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const endIndex = startIndex + propertiesPerPage;
  const currentProperties = homes.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      <FilterBar properties={homes} />

      <section id="all-properties" className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Explore Properties
            </h2>
            <p className="text-gray-600 mt-2">
              Discover your next rental from {homes.length} listings
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading properties...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : currentProperties.length === 0 ? (
            <p className="text-center text-gray-500">No properties available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}

          {currentProperties.length > 0 && (
            <div className="mt-10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
