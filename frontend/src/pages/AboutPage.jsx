import React from "react";
import { Link } from "react-router-dom";
import {
  Home, Globe, Users, Award, Target, Heart, Shield,
  ArrowRight, Star, TrendingUp, MapPin, CheckCircle,
} from "lucide-react";

const TEAM = [
  {
    name: "Aiden Castillo",
    role: "Co-Founder & CEO",
    bio: "15+ years in hospitality tech. Passionate about making travel accessible for everyone.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Sofia Navarrete",
    role: "Head of Product",
    bio: "Former Airbnb PM. Obsessed with building seamless user experiences.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Marcus Chen",
    role: "CTO",
    bio: "Full-stack engineer with expertise in secure payment systems and distributed infrastructure.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
  },
];

const MILESTONES = [
  { year: "2020", label: "Founded", desc: "LuxeKey was born from a vision to make luxury stays accessible." },
  { year: "2021", label: "10K Users", desc: "Reached our first milestone of 10,000 registered guests." },
  { year: "2022", label: "Global Expansion", desc: "Expanded to 48 countries with 3,400+ verified listings." },
  { year: "2024", label: "Stripe Integration", desc: "Launched secure Stripe-powered checkout with PDF invoicing." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-20 page-enter" style={{ background: "var(--surface)" }}>

      {/* ── Hero ─────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-24 px-4 text-white"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #312e81 100%)" }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-300 text-xs font-semibold px-4 py-2 rounded-full border border-white/10 mb-6">
            <Globe className="w-3.5 h-3.5" />
            Our Story
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight mb-6">
            About <span className="gradient-text-blue">LuxeKey</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            We're on a mission to make premium vacation stays accessible to everyone — backed by verified listings,
            secure payments, and world-class guest support.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* ── Stats ─────────────────────────────── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: "12K+", label: "Happy Guests", icon: Users },
            { value: "3.4K", label: "Verified Stays", icon: Home },
            { value: "48", label: "Countries", icon: Globe },
            { value: "4.9★", label: "Average Rating", icon: Star },
          ].map((stat) => (
            <div key={stat.label} className="card p-6 text-center hover:border-blue-100 transition-all">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="stat-number text-3xl">{stat.value}</div>
              <p className="text-xs text-gray-500 font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* ── Mission & Vision ──────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-8">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-3">Our Mission</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              To connect global travelers with extraordinary, verified vacation homes while empowering property
              owners to earn securely and grow their hosting business — all on one trusted platform.
            </p>
          </div>
          <div className="card p-8">
            <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-5">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-3">Our Vision</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              A world where every traveler can find a home away from home — verified, affordable, and memorable.
              We're building the infrastructure for the next generation of vacation rentals.
            </p>
          </div>
        </section>

        {/* ── Values ────────────────────────────── */}
        <section>
          <div className="text-center mb-10">
            <div className="section-label justify-center"><Heart className="w-3.5 h-3.5" /> Core Values</div>
            <h2 className="section-title">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, color: "blue", title: "Trust & Safety", desc: "Every listing is manually verified. Every transaction is SSL-encrypted." },
              { icon: Heart, color: "rose", title: "Guest First", desc: "Your comfort and satisfaction drives every decision we make." },
              { icon: Globe, color: "emerald", title: "Inclusivity", desc: "Travel should be for everyone. We offer stays at every price point." },
              { icon: Award, color: "amber", title: "Excellence", desc: "We only list properties that meet our stringent quality standards." },
              { icon: CheckCircle, color: "violet", title: "Transparency", desc: "No hidden fees. No surprises. What you see is what you pay." },
              { icon: Users, color: "indigo", title: "Community", desc: "Thousands of verified hosts and guests building trust together." },
            ].map((v) => (
              <div key={v.title} className="card p-6 hover:border-blue-100 transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  v.color === "blue" ? "bg-blue-50 text-blue-600" :
                  v.color === "rose" ? "bg-rose-50 text-rose-600" :
                  v.color === "emerald" ? "bg-emerald-50 text-emerald-600" :
                  v.color === "amber" ? "bg-amber-50 text-amber-600" :
                  v.color === "violet" ? "bg-violet-50 text-violet-600" :
                  "bg-indigo-50 text-indigo-600"
                }`}>
                  <v.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1.5">{v.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Journey Timeline ───────────────────── */}
        <section>
          <div className="text-center mb-10">
            <div className="section-label justify-center"><MapPin className="w-3.5 h-3.5" /> Our Journey</div>
            <h2 className="section-title">How We Got Here</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-blue-100 -translate-x-1/2" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className={`relative flex gap-6 sm:gap-0 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                  <div className="sm:w-1/2 sm:px-8 pl-10">
                    <div className="card p-5 hover:border-blue-100 transition-all">
                      <span className="pill pill-blue text-xs mb-2">{m.year}</span>
                      <h3 className="font-bold text-gray-900 text-sm mt-2 mb-1">{m.label}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                  {/* Dot */}
                  <div className="absolute left-4 sm:left-1/2 top-5 w-3 h-3 bg-blue-600 rounded-full -translate-x-1/2 ring-4 ring-blue-100" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ──────────────────────────────── */}
        <section>
          <div className="text-center mb-10">
            <div className="section-label justify-center"><Users className="w-3.5 h-3.5" /> The Team</div>
            <h2 className="section-title">Meet the People Behind LuxeKey</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEAM.map((member) => (
              <div key={member.name} className="card p-6 text-center hover:border-blue-100 transition-all">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 ring-4 ring-blue-50"
                />
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-xs text-blue-600 font-semibold mt-0.5 mb-3">{member.role}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ───────────────────────────────── */}
        <section className="card p-10 sm:p-14 text-center" style={{ background: "linear-gradient(135deg, #eff6ff, #eef2ff)" }}>
          <h2 className="text-3xl font-black text-gray-900 mb-3">Ready to Explore?</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-7">
            Join thousands of travelers who have discovered their perfect stays through LuxeKey.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/explore" className="btn-primary px-8 py-3.5 text-sm">
              Browse Properties
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
