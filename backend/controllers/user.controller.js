// controllers/user.controller.js
import Booking from "../models/booking.model.js";
import Notification from "../models/notification.model.js";
import Review from "../models/review.model.js";

export const getOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔹 Stats
    const activeBookings = await Booking.countDocuments({
      user: userId,
      status: "active",
    });

    const unreadNotifications = await Notification.countDocuments({
      user: userId,
      read: false,
    });

    const reviewsSubmitted = await Review.countDocuments({
      user: userId,
    });

    const stats = { activeBookings, unreadNotifications, reviewsSubmitted };

    // 🔹 Recent Activity
    const recentBookings = await Booking.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("property status createdAt");

    const recentNotifs = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title type createdAt read");

    const recentReviews = await Review.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("property rating createdAt");

    const recentActivity = [
      ...recentBookings.map((b) => ({
        title: `Booking for ${b.property}`,
        type: "booking",
        status: b.status === "active" ? "success" : "info",
        date: b.createdAt,
      })),
      ...recentNotifs.map((n) => ({
        title: n.title,
        type: n.type,
        status: n.read ? "info" : "success",
        date: n.createdAt,
      })),
      ...recentReviews.map((r) => ({
        title: `Review submitted for ${r.property}`,
        type: "review",
        status: "success",
        date: r.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    res.json({ success: true, stats, recentActivity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
