import { useEffect, useState } from "react";
import { useHomeStore } from "../../stores/useHomeStore";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-hot-toast";

export default function RoomManagement() {
  const { homes, fetchAllHomes, loading, error, hideHomeByAdmin, updateHome } =
    useHomeStore();
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchAllHomes();
  }, [fetchAllHomes]);

  const handleStatusChange = async (id, currentStatus) => {
    try {
      if (currentStatus === "active") {
        await hideHomeByAdmin(id, "Violation of platform rules");
        toast.success("Room hidden due to violation");
      } else {
        await updateHome(id, { status: "active" });
        toast.success("Room activated");
      }
    } catch (err) {
      toast.error("Failed to update room status");
      console.error("Status change error:", err.message);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return <p className="text-center">Loading rooms...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      {homes.map((home) => (
        <div
          key={home._id}
          className="border rounded-2xl shadow-md p-5 bg-white hover:shadow-lg transition"
        >
          {/* Header row */}
          <div className="flex items-center justify-between">
            {/* Image + basic info */}
            <div className="flex items-center gap-4">
              {home.images?.[0] && (
                <img
                  src={home.images[0]}
                  alt={home.title}
                  className="w-24 h-24 object-cover rounded-xl border"
                />
              )}
              <div>
                <h2 className="font-semibold text-lg text-gray-800">
                  {home.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {home.location?.city}, {home.location?.district}
                </p>
                <p className="text-blue-600 font-bold text-base mt-1">
                  LKR {home.price}
                </p>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  home.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {home.status === "active" ? "Active" : "Hidden"}
              </span>
              <button
                onClick={() => handleStatusChange(home._id, home.status)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                  home.status === "active"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {home.status === "active" ? "Hide / Violation" : "Activate"}
              </button>

              <button
                onClick={() => toggleExpand(home._id)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                {expanded[home._id] ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
          </div>

          {/* Expanded details */}
          {expanded[home._id] && (
            <div className="mt-5 border-t pt-4 bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <p>
                  <span className="font-medium">Description:</span>{" "}
                  {home.description || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Bedrooms:</span> {home.bedrooms}{" "}
                  | <span className="font-medium">Bathrooms:</span>{" "}
                  {home.bathrooms}
                </p>
                <p>
                  <span className="font-medium">Floor Area:</span>{" "}
                  {home.floorArea || "N/A"} sq ft
                </p>
                <p>
                  <span className="font-medium">Land Area:</span>{" "}
                  {home.landArea || "N/A"} perches
                </p>
                <p>
                  <span className="font-medium">Parking:</span>{" "}
                  {home.parking || 0}
                </p>
                <p>
                  <span className="font-medium">Features:</span>{" "}
                  {home.features?.join(", ") || "None"}
                </p>
                <p>
                  <span className="font-medium">Approval:</span>{" "}
                  {home.isApproved ? "Approved ✅" : "Pending ❌"}
                </p>
                <p>
                  <span className="font-medium">Booked Dates:</span>{" "}
                  {home.bookedDates?.length > 0
                    ? home.bookedDates.join(", ")
                    : "None"}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
