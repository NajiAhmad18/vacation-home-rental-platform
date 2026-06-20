import { useState } from "react";
import {
  parseISO, isBefore, isSameDay, addDays,
  startOfDay, setHours, setMinutes, isAfter, differenceInCalendarDays,
} from "date-fns";
import { useBookingStore } from "../stores/useBookingStore";
import { useParams, useNavigate } from "react-router-dom";
import {
  User, Phone, CreditCard as IdCard, Calendar, AlertCircle,
  CheckCircle, ArrowRight, Info, Shield,
} from "lucide-react";

/* ── Field Component ────────────────────────── */
const Field = ({ icon: Icon, id, name, type = "text", placeholder, value, onChange, error, disabled }) => (
  <div>
    <label htmlFor={id} className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
      {placeholder}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`input-premium pl-11 ${error ? "error" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      />
    </div>
    {error && (
      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);

export default function BookingForm({ selectedDates, setSelectedDates, bookedDates }) {
  const [form, setForm] = useState({ name: "", phone: "", idCard: "", acceptPolicy: false });
  const [errors, setErrors] = useState({});
  const [submitMsg, setSubmitMsg] = useState("");
  const [submitError, setSubmitError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const { createBooking, loading } = useBookingStore();

  /* ── Helpers ────────────────────────────────── */
  const isBooked = (dateStr) => {
    if (!dateStr) return false;
    const date = parseISO(dateStr);
    return bookedDates.some((b) => isSameDay(parseISO(b), date));
  };

  const isDateSelectable = (date) => {
    const now = new Date();
    const today = startOfDay(now);
    const cutoff = setMinutes(setHours(today, 14), 0);
    if (isBefore(date, today)) return false;
    if (isSameDay(date, today) && isAfter(now, cutoff)) return false;
    return true;
  };

  const nightCount =
    selectedDates.startDate && selectedDates.endDate
      ? Math.max(0, differenceInCalendarDays(parseISO(selectedDates.endDate), parseISO(selectedDates.startDate)))
      : 0;

  /* ── Date Validation ────────────────────────── */
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    let newDates = { ...selectedDates, [name]: value };
    setErrors((prev) => ({ ...prev, date: "" }));
    setSubmitError("");

    if (!value) { setSelectedDates(newDates); return; }
    const date = parseISO(value);

    if (!isDateSelectable(date)) {
      setErrors((prev) => ({ ...prev, date: "Invalid date — cannot select past dates or today after 2:00 PM." }));
      if (name === "startDate") { newDates.startDate = ""; newDates.endDate = ""; }
      else newDates.endDate = "";
      setSelectedDates(newDates);
      return;
    }

    if (name === "startDate" && isBooked(value)) {
      setErrors((prev) => ({ ...prev, date: `Check-in date ${value} is already booked.` }));
      newDates.startDate = ""; newDates.endDate = "";
      setSelectedDates(newDates);
      return;
    }

    if (newDates.startDate && newDates.endDate) {
      const start = parseISO(newDates.startDate);
      const end = parseISO(newDates.endDate);
      if (!isBefore(start, end)) {
        setErrors((prev) => ({ ...prev, date: "Check-out must be after check-in." }));
        newDates.endDate = "";
        setSelectedDates(newDates);
        return;
      }
      let cur = new Date(start);
      while (cur < end) {
        if (bookedDates.some((b) => isSameDay(parseISO(b), cur))) {
          setErrors((prev) => ({ ...prev, date: "Your date range overlaps with existing bookings." }));
          newDates.endDate = "";
          setSelectedDates(newDates);
          return;
        }
        cur = addDays(cur, 1);
      }
    }
    setSelectedDates(newDates);
  };

  /* ── Form Validation ────────────────────────── */
  const validate = () => {
    const newErrors = {};
    const nameTrimmed = form.name.trim();
    if (!nameTrimmed) newErrors.name = "Full name is required.";
    else if (nameTrimmed.length < 3) newErrors.name = "Name must be at least 3 characters.";
    else if (!/^[a-zA-Z\s'-]+$/.test(nameTrimmed)) newErrors.name = "Name may only contain letters, spaces, hyphens or apostrophes.";

    const phoneTrimmed = form.phone.trim();
    if (!phoneTrimmed) newErrors.phone = "Phone number is required.";
    else if (!/^\+?[0-9\s\-()]{7,15}$/.test(phoneTrimmed)) newErrors.phone = "Enter a valid phone number (7–15 digits).";

    const idTrimmed = form.idCard.trim();
    if (!idTrimmed) newErrors.idCard = "ID card number is required.";
    else if (idTrimmed.length < 5) newErrors.idCard = "ID must be at least 5 characters.";

    if (!selectedDates.startDate || !selectedDates.endDate)
      newErrors.date = "Please select both check-in and check-out dates.";

    if (!form.acceptPolicy) newErrors.policy = "You must accept the booking policy.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Input handler ──────────────────────────── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Prevent non-numeric in phone
    if (name === "phone") {
      const cleaned = value.replace(/[^0-9\s\-()+]/g, "");
      setForm((prev) => ({ ...prev, [name]: cleaned }));
    } else {
      setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ── Submit ─────────────────────────────────── */
  const generateBookedNights = (checkIn, checkOut) => {
    const dates = [];
    let cur = new Date(checkIn);
    const end = new Date(checkOut);
    while (cur < end) {
      dates.push(new Date(cur).toISOString().split("T")[0]);
      cur = addDays(cur, 1);
    }
    return dates;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(""); setSubmitMsg("");
    if (!validate()) return;

    const bookedNights = generateBookedNights(selectedDates.startDate, selectedDates.endDate);
    const payload = {
      homeId: id,
      guestName: form.name.trim(),
      phone: form.phone.trim(),
      idCard: form.idCard.trim(),
      startDate: selectedDates.startDate,
      endDate: selectedDates.endDate,
      bookedDates: bookedNights,
    };

    try {
      const result = await createBooking(payload);
      const bookingId = result?.data?._id || result?.data?.id;
      setSubmitMsg("Booking created! Redirecting to payment…");
      setTimeout(() => navigate(`/user/payment/${bookingId}`), 800);
    } catch (err) {
      setSubmitError(err.message || "Failed to confirm booking. Please try again.");
    } finally {
      setForm({ name: "", phone: "", idCard: "", acceptPolicy: false });
      setSelectedDates({ startDate: "", endDate: "" });
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Guest info */}
      <Field
        icon={User} id="name" name="name" placeholder="Full Name"
        value={form.name} onChange={handleChange} error={errors.name}
      />
      <Field
        icon={Phone} id="phone" name="phone" type="tel" placeholder="Phone Number"
        value={form.phone} onChange={handleChange} error={errors.phone}
      />
      <Field
        icon={IdCard} id="idCard" name="idCard" placeholder="ID Card / Passport Number"
        value={form.idCard} onChange={handleChange} error={errors.idCard}
      />

      {/* Date pickers */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Stay Dates
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "startDate", label: "Check-in" },
            { name: "endDate", label: "Check-out" },
          ].map((d) => (
            <div key={d.name}>
              <div className="text-[10px] text-gray-400 font-medium mb-1">{d.label}</div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  name={d.name}
                  value={selectedDates[d.name]}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`input-premium pl-10 text-sm ${errors.date ? "error" : ""}`}
                />
              </div>
            </div>
          ))}
        </div>
        {errors.date && (
          <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {errors.date}
          </p>
        )}
        {nightCount > 0 && !errors.date && (
          <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            {nightCount} night{nightCount !== 1 ? "s" : ""} selected
          </p>
        )}
      </div>

      {/* Policy */}
      <div className="rounded-2xl bg-blue-50/70 border border-blue-100 p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              name="acceptPolicy"
              checked={form.acceptPolicy}
              onChange={handleChange}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                form.acceptPolicy
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-gray-300"
              }`}
            >
              {form.acceptPolicy && <CheckCircle className="w-3.5 h-3.5 text-white" />}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-800">I accept the booking policy</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              By confirming, you agree to our cancellation policy and terms of stay.
            </p>
          </div>
        </label>
        {errors.policy && (
          <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.policy}
          </p>
        )}
      </div>

      {/* Feedback messages */}
      {submitError && (
        <div className="rounded-2xl bg-red-50 border border-red-100 p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}
      {submitMsg && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 flex gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-700">{submitMsg}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-4 text-sm font-bold rounded-2xl"
        style={{ borderRadius: "16px" }}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <Shield className="w-4 h-4" />
            Confirm & Proceed to Payment
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
        <Info className="w-3.5 h-3.5" />
        You won't be charged yet — payment is on the next step.
      </p>
    </form>
  );
}
