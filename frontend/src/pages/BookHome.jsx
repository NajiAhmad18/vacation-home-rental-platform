import { useState, useEffect } from "react";
import BookingForm from "../components/BookingForm.jsx";
import Calendar from "../components/Calendar.jsx";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useBookingStore } from "../stores/useBookingStore.js";
import { useHomeStore } from "../stores/useHomeStore.js";
import {
  ArrowLeft, Calendar as CalendarIcon, MapPin, Star, BedDouble,
  Bath, ShieldCheck, CreditCard, Info,
} from "lucide-react";

export default function BookHome() {
  const [selectedDates, setSelectedDates] = useState({ startDate: "", endDate: "" });
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings, fetchBookingsByHomeId, loading: bookingLoading } = useBookingStore();
  const { getHomeById } = useHomeStore();
  const [home, setHome] = useState(null);
  const [homeLoading, setHomeLoading] = useState(true);

  useEffect(() => {
    if (id) fetchBookingsByHomeId(id);
  }, [id, fetchBookingsByHomeId]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getHomeById(id);
        setHome(data);
      } catch (e) {
        console.error(e);
      } finally {
        setHomeLoading(false);
      }
    };
    if (id) load();
  }, [id, getHomeById]);

  const bookedDates = bookings.flatMap((b) => b.bookedDates);

  return (
    <div className="min-h-screen pb-20" style={{ background: "var(--surface)" }}>
      {/* ── Page Header ─────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Book Your Stay</h1>
            {home && (
              <p className="text-xs text-gray-500 mt-0.5 truncate max-w-sm">{home.title}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Property summary strip ─────────────────── */}
        {!homeLoading && home && (
          <div className="card p-5 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center animate-fade-in">
            <img
              src={home.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=200&q=80"}
              alt={home.title}
              className="w-full sm:w-28 h-24 sm:h-20 object-cover rounded-xl flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-gray-900 text-base truncate">{home.title}</h2>
              <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  {home.location?.city}, {home.location?.district}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  {home.averageRating?.toFixed(1) || "0.0"} ({home.reviewsCount || 0} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5" /> {home.bedrooms} beds
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5" /> {home.bathrooms} baths
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xl font-black text-gray-900">${home.price?.toLocaleString()}</div>
              <div className="text-xs text-gray-400">per night</div>
            </div>
          </div>
        )}

        {/* ── Main Content ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Booking Form */}
          <div className="card p-6 sm:p-8 animate-fade-in">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Guest Details</h3>
                <p className="text-xs text-gray-500">Fill in your information to reserve</p>
              </div>
            </div>
            <BookingForm
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              bookedDates={bookedDates}
            />
          </div>

          {/* Right: Calendar + Info */}
          <div className="space-y-5 animate-fade-in" style={{ animationDelay: "100ms" }}>
            {/* Calendar */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                Availability Calendar
              </h3>
              <Calendar bookedDates={bookedDates} selectedDates={selectedDates} />
              {bookingLoading && (
                <p className="text-xs text-gray-400 text-center mt-3 animate-pulse-soft">
                  Loading availability…
                </p>
              )}
            </div>

            {/* Trust badges */}
            <div className="card p-5 space-y-3">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Booking Assurance</h4>
              {[
                { icon: ShieldCheck, color: "text-emerald-600", text: "Free cancellation within 24 hours of booking" },
                { icon: CreditCard, color: "text-blue-600", text: "Stripe‑encrypted secure payment checkout" },
                { icon: Info, color: "text-violet-600", text: "Your ID is used only for verification purposes" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs text-gray-600">
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${item.color}`} />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Back link */}
            {home && (
              <Link
                to={`/home/${id}`}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to property details
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
