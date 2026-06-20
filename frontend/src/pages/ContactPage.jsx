import React, { useState } from "react";
import {
  Mail, Phone, MapPin, Send, CheckCircle, AlertCircle,
  MessageSquare, Clock, HeartHandshake, Globe,
} from "lucide-react";

const FAQS = [
  { q: "How do I cancel a booking?", a: "You can cancel free of charge within 24 hours of booking. After that, our standard cancellation policy applies." },
  { q: "Is my payment information secure?", a: "Yes. We use Stripe — a PCI DSS Level 1 certified payment processor. Your card details are never stored on our servers." },
  { q: "How do I list my property?", a: "Register as a Host, complete your profile, and use the Owner Dashboard to add your property with photos and pricing." },
  { q: "What happens if there's an issue at check-in?", a: "Contact our 24/7 support team immediately. We'll coordinate with the host and provide alternative arrangements if needed." },
];

const Field = ({ id, name, type = "text", placeholder, value, onChange, error, icon: Icon, rows }) => (
  <div>
    <label htmlFor={id} className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
      {placeholder}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-start pt-3.5 pointer-events-none">
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
      )}
      {rows ? (
        <textarea
          id={id} name={name} value={value} onChange={onChange} rows={rows} placeholder={placeholder}
          className={`input-premium ${Icon ? "pl-11" : ""} resize-none ${error ? "error" : ""}`}
        />
      ) : (
        <input
          id={id} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
          className={`input-premium ${Icon ? "pl-11" : ""} ${error ? "error" : ""}`}
        />
      )}
    </div>
    {error && (
      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
      </p>
    )}
  </div>
);

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters.";

    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email.";

    if (!form.subject.trim()) e.subject = "Subject is required.";
    else if (form.subject.trim().length < 5) e.subject = "Subject must be at least 5 characters.";

    if (!form.message.trim()) e.message = "Message is required.";
    else if (form.message.trim().length < 20) e.message = "Message must be at least 20 characters.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen pb-20 page-enter" style={{ background: "var(--surface)" }}>

      {/* ── Hero ─────────────────────────────────── */}
      <div
        className="relative overflow-hidden py-20 px-4 text-white"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #312e81 100%)" }}
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-300 text-xs font-semibold px-4 py-2 rounded-full border border-white/10 mb-5">
            <HeartHandshake className="w-3.5 h-3.5" /> We're Here to Help
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Contact <span className="gradient-text-blue">LuxeKey</span></h1>
          <p className="text-blue-200 text-base max-w-xl mx-auto">
            Have a question, issue, or want to partner with us? Our team responds within 24 hours.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* ── Contact Info Cards ─────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: Phone, color: "blue", title: "Phone", info: "+94 11 234 5678", sub: "Mon–Fri, 8am–8pm" },
            { icon: Mail, color: "violet", title: "Email", info: "support@luxekey.com", sub: "We reply within 24h" },
            { icon: MapPin, color: "emerald", title: "Address", info: "100 Galle Road", sub: "Colombo, Sri Lanka" },
          ].map((item) => (
            <div key={item.title} className="card p-6 text-center hover:border-blue-100 transition-all">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                item.color === "blue" ? "bg-blue-50 text-blue-600" :
                item.color === "violet" ? "bg-violet-50 text-violet-600" :
                "bg-emerald-50 text-emerald-600"
              }`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
              <p className="text-gray-700 text-sm font-semibold">{item.info}</p>
              <p className="text-gray-400 text-xs mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Form + Sidebar ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Form */}
          <div className="lg:col-span-3 card p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Send a Message</h2>
                <p className="text-xs text-gray-400">Fill in the form and we'll get back to you</p>
              </div>
            </div>

            {submitted ? (
              <div className="text-center py-10 animate-scale-in">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">
                  Thanks for reaching out. Our support team will reply within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-primary mt-6 px-6 py-2.5 text-sm mx-auto"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field id="name" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} error={errors.name} icon={null} />
                  <Field id="email" name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} error={errors.email} icon={Mail} />
                </div>
                <Field id="subject" name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} error={errors.subject} icon={null} />
                <Field id="message" name="message" placeholder="Your Message" value={form.message} onChange={handleChange} error={errors.message} icon={null} rows={5} />

                <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-sm font-bold">
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-5">
            {/* Hours */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-sm">Support Hours</h3>
              </div>
              <div className="space-y-2.5 text-sm">
                {[
                  { day: "Monday – Friday", hours: "8:00 AM – 8:00 PM" },
                  { day: "Saturday", hours: "9:00 AM – 6:00 PM" },
                  { day: "Sunday", hours: "Emergency only" },
                ].map((item) => (
                  <div key={item.day} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <span className="text-gray-600">{item.day}</span>
                    <span className="font-semibold text-gray-900 text-xs">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-sm">Follow Us</h3>
              </div>
              <div className="flex gap-3">
                {["Twitter", "Instagram", "LinkedIn"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="flex-1 text-center text-xs font-semibold text-gray-600 border border-gray-200 py-2 rounded-xl hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQ ───────────────────────────────── */}
        <section>
          <div className="text-center mb-8">
            <div className="section-label justify-center"><MessageSquare className="w-3.5 h-3.5" /> FAQ</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`card overflow-hidden transition-all duration-200 cursor-pointer ${activeFaq === i ? "border-blue-200" : "hover:border-gray-300"}`}
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                <div className="flex justify-between items-center p-5">
                  <p className="text-sm font-semibold text-gray-900 pr-4">{faq.q}</p>
                  <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-sm font-bold transition-all ${
                    activeFaq === i ? "bg-blue-600 text-white rotate-45" : "bg-gray-100 text-gray-500"
                  }`}>+</div>
                </div>
                {activeFaq === i && (
                  <div className="px-5 pb-5 animate-fade-in">
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
