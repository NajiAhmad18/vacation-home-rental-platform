import React, { useEffect, useState } from "react";
import { MapPin, Star, Eye, Edit, Trash2, Plus, Archive } from "lucide-react";
import { useHomeStore } from "../../stores/useHomeStore";
import EditHomeModal from "./EditHomeModal";

const AllHomes = () => {
  const { homes, getHomesByOwner, toggleAvailable, deleteHome, loading } = useHomeStore();
  const [selectedHome, setSelectedHome] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  useEffect(() => {
    getHomesByOwner();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-gray-500 text-center animate-pulse">
        Loading homes...
      </div>
    );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this home?")) {
      try {
        await deleteHome(id);
        alert("Home deleted successfully!");
      } catch (err) {
        alert("Failed to delete home: " + err.message);
      }
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          My Properties
        </h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </button>
      </div>

      {/* Property list */}
      <div className="space-y-4">
        {homes.map((property) => (
          <div
            key={property._id}
            className="flex bg-white rounded-xl shadow-sm overflow-hidden"
            style={{ height: "150px" }} // Fixed height for balanced layout
          >
            {/* Left Image */}
            <div className="w-36 h-full flex-shrink-0 relative">
              <img
                src={property.images?.[0] || "https://via.placeholder.com/150"}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                  property.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {property.status === "active" ? "Active" : "Hidden"}
              </span>
            </div>

            {/* Right Content */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-base font-semibold line-clamp-2">{property.title}</h3>
                  <span className="text-sm font-semibold text-blue-600 whitespace-nowrap">
                    ${property.price}/night
                  </span>
                </div>

                <div className="flex items-center text-gray-500 text-xs mb-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>
                    {property.location?.city}, {property.location?.district}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="ml-1">{property.averageRating}</span>
                    <span className="ml-1 text-gray-400">({property.reviewsCount})</span>
                  </div>
                </div>
              </div>

              {/* Actions with labels */}
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => { setSelectedHome(property); setViewMode(true); }}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                <button
                  onClick={() => { setSelectedHome(property); setViewMode(false); }}
                  className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => toggleAvailable(property._id)}
                  className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center ${
                    property.status === "active"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  <Archive className="w-4 h-4 mr-1" />
                  {property.status === "active" ? "Archive" : "Unarchive"}
                </button>
                <button
                  onClick={() => handleDelete(property._id)}
                  className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / View Modal */}
      <EditHomeModal
        home={selectedHome}
        isOpen={!!selectedHome}
        onClose={() => setSelectedHome(null)}
        readOnly={viewMode}
      />
    </div>
  );
};

export default AllHomes;
