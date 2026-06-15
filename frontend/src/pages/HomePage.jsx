import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropertyCard from "../components/user/PropertyCard.jsx";
import { useHomeStore } from "../stores/useHomeStore.js";
import {
  Search, Compass, ShieldCheck, CreditCard, HeartHandshake,
  ArrowRight, TrendingUp, Star, Users, Home, Sparkles,
  MapPin, ChevronRight, Award, Clock,
} from "lucide-react";

const TRENDING = [
  {
    name: "Bali",
    country: "Indonesia",
    count: "42 stays",
    query: "Bali",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Paris",
    country: "France",
    count: "29 stays",
    query: "Paris",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Kyoto",
    country: "Japan",
    count: "18 stays",
    query: "Kyoto",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Cape Town",
    country: "South Africa",
    count: "12 stays",
    query: "Cape Town",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80",
  },
];

const STATS = [
  { value: "12K+", label: "Happy Guests" },
  { value: "3.4K", label: "Verified Stays" },
  { value: "48", label: "Countries" },
  { value: "4.9", label: "Avg Rating" },
];

const TRUST = [
  {
    icon: ShieldCheck,
    color: "blue",
    title: "Verified Stays",
    desc: "Every listing is manually verified for accuracy, cleanliness, and safety standards.",
  },
  {
    icon: CreditCard,
    color: "emerald",
    title: "Stripe Secure Payments",
    desc: "Fully encrypted 3D-Secure checkout — your card details are never stored.",
  },
  {
    icon: HeartHandshake,
    color: "violet",
    title: "24/7 Guest Support",
    desc: "Dedicated helpline around the clock for any booking or hosting query.",
  },
];

const colorMap = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-100" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", ring: "ring-violet-100" },
};

function HomePage() {
  const { homes, fetchAllHomes, loading, error } = useHomeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [heroLoaded, setHeroLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllHomes();
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, [fetchAllHomes]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(searchQuery.trim() ? `/explore?query=${encodeURIComponent(searchQuery)}` : "/explore");
  };

  const featuredHomes = homes.slice(0, 8);

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--surface)" }}>

      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[580px] sm:min-h-[620px] flex items-center">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1800&q=80')" }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-slate-900/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Decorative orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />

        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-36 sm:py-24 w-full transition-all duration-700 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="max-w-3xl">
            {/* Pill badge */}
            <div className="hidden sm:inline-flex items-center gap-2 glass-dark text-blue-200 text-xs font-semibold px-4 py-2 rounded-full mb-5 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-blue-400" />
              <span>Discover Verified Luxury Stays Worldwide</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] text-white mb-5">
              Find Your{" "}
              <span className="gradient-text-hero">Perfect</span>
              <br />
              <span className="text-white">Escape</span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-lg max-w-xl leading-relaxed mb-8 max-w-xs sm:max-w-xl">
              Browse fully verified vacation homes, private villas, and city apartments — backed by Stripe‑encrypted checkouts.
            </p>

            {/* Search form */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-row gap-2 max-w-2xl"
            >
              <div className="flex-1 relative flex items-center bg-white rounded-2xl shadow-2xl border border-gray-100 min-w-0">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 sm:left-4 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="City, location or property..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-12 pr-3 py-3 sm:py-4 bg-transparent text-gray-800 placeholder-gray-400 text-sm focus:outline-none rounded-2xl"
                />
              </div>
              <button
                type="submit"
                className="btn-primary px-4 sm:px-8 py-3 sm:py-4 rounded-2xl text-sm whitespace-nowrap flex-shrink-0"
                style={{ borderRadius: "16px" }}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search Stays</span>
              </button>
            </form>

            {/* Quick tags */}
            <div className="flex flex-wrap gap-2 mt-5">
              {["Bali", "Paris", "Colombo", "Kyoto"].map((place) => (
                <button
                  key={place}
                  onClick={() => navigate(`/explore?query=${place}`)}
                  className="glass-dark text-white/90 text-xs px-3.5 py-1.5 rounded-full hover:bg-white/20 transition-all duration-200 border border-white/10"
                >
                  {place}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-dark rounded-t-2xl px-4 sm:px-8 py-4 grid grid-cols-4 gap-2 sm:gap-4 border-t border-white/10">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-base sm:text-2xl font-black text-white">{s.value}</div>
                  <div className="text-[10px] sm:text-xs text-white/70 font-medium mt-0.5 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Trust Factors ──────────────────────────────── */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRUST.map((item) => {
              const { bg, text, ring } = colorMap[item.color];
              return (
                <div
                  key={item.title}
                  className="card p-6 flex gap-5 items-start hover:border-blue-100 transition-all duration-300"
                >
                  <div className={`w-12 h-12 ${bg} ${text} rounded-2xl flex items-center justify-center flex-shrink-0 ring-4 ${ring}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Trending Destinations ──────────────────────── */}
        <section className="py-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="section-label">
                <Compass className="w-3.5 h-3.5" />
                Inspiration
              </div>
              <h2 className="section-title">Trending Destinations</h2>
            </div>
            <Link
              to="/explore"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 group"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {TRENDING.map((dest, i) => (
              <Link
                key={dest.name}
                to={`/explore?query=${encodeURIComponent(dest.query)}`}
                className="group relative h-40 sm:h-56 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-all duration-300" />

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="text-[10px] font-semibold text-white/70 uppercase tracking-widest mb-1">{dest.country}</p>
                  <h3 className="text-xl font-black">{dest.name}</h3>
                  <p className="text-xs text-white/70 mt-1 flex items-center gap-1">
                    <Home className="w-3 h-3" />
                    {dest.count}
                  </p>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Promotional Ad Banner ──────────────────────── */}
        <section className="py-8">
          <div
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-7 sm:p-14 flex flex-col md:flex-row justify-between items-center gap-6"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)" }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2" />

            {/* Content */}
            <div className="relative z-10 max-w-xl text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10 mb-5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Partner Hosting Program
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
                Earn By Sharing
                <br />
                <span className="text-blue-300">Your Space</span>
              </h2>
              <p className="text-blue-100 text-sm leading-relaxed">
                Join thousands of hosts on LuxeKey. Safe Stripe payouts, automated invoicing, and a global network of verified travelers.
              </p>
              <div className="flex flex-wrap gap-4 mt-6 text-xs text-white/70">
                <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-400" /> Verified payouts</div>
                <div className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-blue-400" /> Auto invoicing</div>
                <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-400" /> 24/7 support</div>
              </div>
            </div>

            {/* CTA */}
            <div className="relative z-10 flex-shrink-0 flex flex-col items-center gap-3">
              <Link
                to="/owner"
                className="inline-flex items-center gap-2.5 bg-white text-blue-700 font-bold px-7 py-4 rounded-2xl shadow-lg hover:bg-blue-50 transition-all duration-200 text-sm group"
              >
                List Your Property
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-xs text-white/50">Free to list — no setup fees</p>
            </div>
          </div>
        </section>

        {/* ── Featured Properties ────────────────────────── */}
        <section className="py-10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="section-label">
                <TrendingUp className="w-3.5 h-3.5" />
                Featured Stays
              </div>
              <h2 className="section-title">Explore Popular Rentals</h2>
            </div>
            <Link
              to="/explore"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 group"
            >
              Explore All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-3xl overflow-hidden">
                  <div className="skeleton h-56" />
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
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          ) : featuredHomes.length === 0 ? (
            <div className="card p-16 text-center">
              <Home className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No vacation properties listed yet.</p>
              <p className="text-gray-400 text-sm mt-1">Check back soon — new stays are added daily.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredHomes.map((property, i) => (
                <div
                  key={property._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-10 sm:hidden">
            <Link to="/explore" className="btn-primary px-8 py-3 text-sm">
              View All Properties
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ── Why LuxeKey ──────────────────────────────────── */}
        <section className="py-12">
          <div className="card p-10 sm:p-14">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <div className="section-label justify-center">
                <Star className="w-3.5 h-3.5" />
                Why Choose Us
              </div>
              <h2 className="section-title">The LuxeKey Difference</h2>
              <p className="text-gray-500 text-sm mt-3">
                We go beyond just listing stays — every property is curated, verified, and backed by our guest-first guarantee.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { icon: ShieldCheck, color: "blue", title: "100% Verified", desc: "Every photo and listing detail is manually reviewed" },
                { icon: CreditCard, color: "emerald", title: "Secure Checkout", desc: "PCI-DSS compliant Stripe payments with 3D Secure" },
                { icon: Users, color: "violet", title: "Community Driven", desc: "Real guest reviews powering trust and transparency" },
                { icon: Award, color: "amber", title: "Best Price", desc: "Our price-match guarantee gives you the best rate" },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                    item.color === "blue" ? "bg-blue-50 text-blue-600" :
                    item.color === "emerald" ? "bg-emerald-50 text-emerald-600" :
                    item.color === "violet" ? "bg-violet-50 text-violet-600" :
                    "bg-amber-50 text-amber-600"
                  }`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1.5">{item.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter / CTA strip ────────────────────── */}
        <section className="py-10 pb-4">
          <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">Ready to explore?</h3>
              <p className="text-gray-500 text-sm mt-1">Browse thousands of stays and book your next adventure today.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
              <Link to="/explore" className="btn-primary px-6 py-3 text-sm justify-center">
                Browse Properties
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 px-6 py-3 rounded-2xl transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default HomePage;
