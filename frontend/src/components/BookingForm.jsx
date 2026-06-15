import { useState } from "react";
import {
  parseISO,
  isBefore,
  isSameDay,
  addDays,
  startOfDay,
  setHours,
  setMinutes,
  isAfter,
} from "date-fns";
import { useBookingStore } from "../stores/useBookingStore";
import { useParams, useNavigate } from "react-router-dom"; // ⬅️ added useNavigate

export default function BookingForm({
  selectedDates,
  setSelectedDates,
  bookedDates,
  homeId,
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    idCard: "",
    acceptPolicy: false,
  });

  const { id } = useParams();
  const navigate = useNavigate(); // ⬅️ init

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { createBooking, loading } = useBookingStore();

  // Check if a single date is already booked
  const isBooked = (dateStr) => {
    if (!dateStr) return false;
    const date = parseISO(dateStr);
    return bookedDates.some((booked) => isSameDay(parseISO(booked), date));
  };

  // Validate date according to booking rules
  const isDateSelectable = (date) => {
    const now = new Date();
    const today = startOfDay(now);
    const cutoffTime = setMinutes(setHours(today, 14), 0); // 2:00 PM

    if (isBefore(date, today)) return false; // can't select past dates
    if (isSameDay(date, today) && isAfter(now, cutoffTime)) return false; // same day after 2 PM
    return true;
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    let newDates = { ...selectedDates, [name]: value };
    setError("");
    setSuccess("");

    const date = parseISO(value);

    // 🚫 Past date or same-day after 2 PM
    if (!isDateSelectable(date)) {
      setError(
        "Invalid date. You cannot select past dates or today after 2:00 PM."
      );
      if (name === "startDate") {
        newDates.startDate = "";
        newDates.endDate = "";
      } else {
        newDates.endDate = "";
      }
      setSelectedDates(newDates);
      return;
    }

    // 🚫 Block only check-in if already booked
    if (name === "startDate" && isBooked(value)) {
      setError(`The selected check-in date (${value}) is already booked`);
      newDates.startDate = "";
      newDates.endDate = "";
      setSelectedDates(newDates);
      return;
    }

    // Validate range if both start and end are selected
    if (newDates.startDate && newDates.endDate) {
      const start = parseISO(newDates.startDate);
      const end = parseISO(newDates.endDate);

      if (!isBefore(start, end)) {
        setError("Check-in date must be before check-out date");
        newDates.endDate = "";
        setSelectedDates(newDates);
        return;
      }

      // Check nights in between start and end
      let current = new Date(start);
      const endExclusive = new Date(end);
      while (current < endExclusive) {
        if (bookedDates.some((b) => isSameDay(parseISO(b), current))) {
          setError(
            "Your selected date range includes nights that are already booked"
          );
          newDates.endDate = "";
          setSelectedDates(newDates);
          return;
        }
        current = addDays(current, 1);
      }
    }

    setSelectedDates(newDates);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Generate booked nights array excluding check-out date
  const generateBookedDates = (checkIn, checkOut) => {
    const dates = [];
    let current = new Date(checkIn);
    const end = new Date(checkOut);

    while (current < end) {
      dates.push(new Date(current).toISOString().split("T")[0]);
      current = addDays(current, 1);
    }

    return dates;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedDates.startDate || !selectedDates.endDate) {
      setError("Please select both check-in and check-out dates");
      return;
    }

    const bookedNights = generateBookedDates(
      selectedDates.startDate,
      selectedDates.endDate
    );

    const bookingPayload = {
      homeId: id,
      guestName: form.name,
      phone: form.phone,
      idCard: form.idCard,
      startDate: selectedDates.startDate,
      endDate: selectedDates.endDate,
      bookedDates: bookedNights,
    };

    try {
      const result = await createBooking(bookingPayload);
      const bookingId = result?.data?._id || result?.data?.id;

      // Optional: brief success message before redirect
      setSuccess("Booking created! Redirecting to payment…");

      // ⬅️ Redirect to the payment page
      // If your route is /payment/:bookingId, swap the path below accordingly.
      navigate(`/user/payment/${bookingId}`);
    } catch (err) {
      setError(err.message || "Failed to confirm booking");
      return;
    } finally {
      // reset form fields (optional)
      setForm({
        name: "",
        phone: "",
        idCard: "",
        acceptPolicy: false,
      });
      setSelectedDates({ startDate: "", endDate: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border rounded px-4 py-2"
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        className="w-full border rounded px-4 py-2"
        required
      />
      <input
        type="text"
        name="idCard"
        placeholder="ID Card Number"
        value={form.idCard}
        onChange={handleChange}
        className="w-full border rounded px-4 py-2"
        required
      />
      <div className="flex gap-4">
        <input
          type="date"
          name="startDate"
          value={selectedDates.startDate}
          onChange={handleDateChange}
          className="border rounded px-4 py-2 w-full"
          required
        />
        <input
          type="date"
          name="endDate"
          value={selectedDates.endDate}
          onChange={handleDateChange}
          className="border rounded px-4 py-2 w-full"
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="acceptPolicy"
          checked={form.acceptPolicy}
          onChange={handleChange}
          required
        />
        <span className="text-sm text-gray-700">
          I accept the booking policy
        </span>
      </label>

      <button
        type="submit"
        className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Processing..." : "Confirm Booking"}
      </button>
    </form>
  );
}
