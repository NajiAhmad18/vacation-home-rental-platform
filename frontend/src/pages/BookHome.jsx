import { useState } from "react";
import BookingForm from "../components/BookingForm.jsx";
import Calendar from "../components/Calendar.jsx";
import { useParams } from "react-router-dom";
import { useBookingStore } from "../stores/useBookingStore.js";
import { useEffect } from "react";

export default function BookHome() {
  const [selectedDates, setSelectedDates] = useState({
    startDate: "",
    endDate: "",
  });

  const { id } = useParams();

  const { bookings, fetchBookingsByHomeId, loading, error } = useBookingStore();

  // Fetch bookings when page loads
  useEffect(() => {
    if (id) {
      fetchBookingsByHomeId(id);
    }
  }, [id, fetchBookingsByHomeId]);

  // Extract booked dates from bookings
  const bookedDates = bookings.flatMap((b) => b.bookedDates);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Book Your Stay
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          <BookingForm
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            bookedDates={bookedDates}
          />
          <Calendar bookedDates={bookedDates} selectedDates={selectedDates} />
        </div>
      </div>
    </div>
  );
}
