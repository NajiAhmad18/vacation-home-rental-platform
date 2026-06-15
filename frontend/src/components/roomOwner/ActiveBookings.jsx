import React, { useEffect } from "react";
import { Calendar, MapPin, User, Phone, Mail, CalendarCheck } from "lucide-react";
import { useBookingStore } from "../../stores/useBookingStore";

const ActiveBookings = () => {
  const { bookings, fetchBookingsForOwner, completeBooking, loading } =
    useBookingStore();

  useEffect(() => {
    fetchBookingsForOwner();
  }, [fetchBookingsForOwner]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const completeButtonClicked = async (bookingId) => {
    try {
      await completeBooking(bookingId);
      await fetchBookingsForOwner();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-700">Loading bookings...</div>;
  }

  // ✅ Only show active bookings
  const activeBookings = bookings.filter((b) => b.status === "active");

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Active Bookings</h1>
        <div className="text-sm text-gray-600">
          {activeBookings.length} active booking
          {activeBookings.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="space-y-6">
        {activeBookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {booking.homeId?.title}
                  </h3>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {booking.homeId?.location?.city},{" "}
                      {booking.homeId?.location?.province}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Guest Information */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Guest Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-900 font-medium">
                      {booking.guest?.name}
                    </p>
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {booking.guest?.email}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {booking.guest?.phone}
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Booking Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="text-gray-900 font-medium">
                        {formatDate(booking.checkInDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="text-gray-900 font-medium">
                        {formatDate(booking.checkOutDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nights:</span>
                      <span className="text-gray-900 font-medium">
                        {calculateNights(
                          booking.checkInDate,
                          booking.checkOutDate
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment & Checkout */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Payment & Checkout</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="text-xl font-bold text-green-600">
                        ${booking.totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booked on:</span>
                      <span className="text-gray-900">
                        {formatDate(booking.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex mt-4">
                    <button
                      onClick={() => completeButtonClicked(booking._id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center transition-colors"
                    >
                      <CalendarCheck className="w-4 h-4 mr-1" />
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeBookings.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Active Bookings
          </h3>
          <p className="text-gray-500">
            You don't have any active bookings at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActiveBookings;
