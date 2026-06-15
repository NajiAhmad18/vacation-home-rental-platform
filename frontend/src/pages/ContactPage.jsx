import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Mail, Phone, MapPin, Send, HelpCircle, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      toast.success("Thank you! Your message has been sent successfully. We will get back to you within 24 hours.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1200);
  };

  const contactOptions = [
    {
      title: "Email Support",
      detail: "support@luxekey.com",
      description: "Get in touch with our help desk directly.",
      icon: Mail,
    },
    {
      title: "Call Helpline",
      detail: "+94 11 234 5678",
      description: "Direct assistance with bookings and checkout.",
      icon: Phone,
    },
    {
      title: "Headquarters",
      detail: "Galle Road, Colombo, SL",
      description: "Visit our operations and sales offices.",
      icon: MapPin,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase bg-blue-500/10 px-3 py-1 rounded-full">
            Support Desk
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 tracking-tight">
            How Can We <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Help You?</span>
          </h1>
          <p className="text-blue-100/70 mt-4 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Have questions about booking, hosting, or a refund? Drop us a message below or reach out via our helpline.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Cards */}
          <div className="lg:col-span-1 space-y-6">
            {contactOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <div
                  key={opt.title}
                  className="bg-white rounded-3xl border border-gray-100 p-6 flex items-start space-x-4 shadow-sm hover:shadow-md transition-all duration-200 text-left"
                >
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">{opt.title}</h3>
                    <p className="text-base font-semibold text-blue-600 mt-1 select-all">{opt.detail}</p>
                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{opt.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 text-left">
              <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <span>Submit a Support Ticket</span>
              </h2>
              <p className="text-gray-500 text-xs mt-1.5">
                Fields marked with <span className="text-red-500 font-bold">*</span> are required.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                      Your Name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                      Email Address <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Inquiring about a booking refund"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    Detailed Message <span className="text-red-500 font-bold">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Describe your question or issue in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/10 hover:shadow-lg transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Ticket...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Ticket</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
