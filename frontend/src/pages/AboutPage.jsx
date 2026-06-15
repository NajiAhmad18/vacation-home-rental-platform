import React from "react";
import { Link } from "react-router-dom";
import { Award, ShieldCheck, HeartHandshake, Compass, Users, MapPin } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Bookings Handled", value: "15,000+" },
    { label: "Verified Properties", value: "1,200+" },
    { label: "Customer Satisfaction", value: "99.4%" },
    { label: "Active Destinations", value: "85+" },
  ];

  const values = [
    {
      title: "Verified Trust",
      description: "Every listing on our platform undergoes rigorous verification to guarantee physical matches and safe stays.",
      icon: ShieldCheck,
      color: "text-blue-500 bg-blue-50",
    },
    {
      title: "Seamless Payments",
      description: "Built on top of Stripe payment systems to offer secure checkout and flexible cancellations.",
      icon: Award,
      color: "text-emerald-500 bg-emerald-50",
    },
    {
      title: "24/7 Guest Care",
      description: "Our dedicated support team is available around the clock to support owners and guests globally.",
      icon: HeartHandshake,
      color: "text-violet-500 bg-violet-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase bg-blue-500/10 px-3 py-1 rounded-full">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-4 tracking-tight leading-tight">
            Redefining Your Holiday <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Stay Experience</span>
          </h1>
          <p className="text-blue-100/80 mt-6 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            LuxeKey started with a simple vision: to connect travelers with premium, fully verified vacation rentals while delivering total checkout security.
          </p>
        </div>
      </div>

      {/* Stats Board */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((stat, i) => (
            <div key={stat.label} className={i < 3 ? "lg:border-r border-gray-100" : ""}>
              <p className="text-3xl md:text-4xl font-extrabold text-blue-600">{stat.value}</p>
              <p className="text-gray-500 text-xs md:text-sm mt-2 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Values */}
      <div className="max-w-7xl mx-auto px-4 mt-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900">Why LuxeKey?</h2>
          <p className="text-gray-500 mt-3 text-sm md:text-base leading-relaxed">
            We operate at the intersection of premium home hosting, guest hospitality, and secure, modern booking systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className="bg-white rounded-3xl border border-gray-100/80 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 text-left"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${val.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Showcase / Story Section */}
      <div className="max-w-7xl mx-auto px-4 mt-24 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-3xl text-white overflow-hidden shadow-xl lg:flex items-center">
          <div className="p-8 md:p-12 lg:w-1/2 text-left">
            <h2 className="text-3xl font-extrabold tracking-tight">Ready to Host Your Home?</h2>
            <p className="text-blue-100 mt-4 leading-relaxed text-sm md:text-base">
              Join thousands of homeowners and room hosts listing their properties on LuxeKey. Manage bookings, secure deposits, issue automated invoice reports, and receive payouts via Stripe seamlessly.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/owner"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-2xl shadow-md hover:bg-blue-50 transition duration-200 text-sm"
              >
                Become a Host
              </Link>
              <Link
                to="/explore"
                className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-2xl hover:bg-blue-800 transition duration-200 text-sm"
              >
                Explore Destinations
              </Link>
            </div>
          </div>
          <div className="hidden lg:block lg:w-1/2 self-stretch relative min-h-[300px]">
            {/* Elegant gradient graphic in place of local asset */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 via-indigo-800 to-indigo-900 flex items-center justify-center">
              <div className="text-center p-8 space-y-4">
                <Compass className="w-16 h-16 text-blue-400 mx-auto animate-pulse" />
                <p className="text-lg font-semibold tracking-wide">Find Your Escape, Anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
