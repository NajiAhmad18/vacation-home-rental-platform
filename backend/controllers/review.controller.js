import Review from "../models/review.model.js";
import Booking from "../models/booking.model.js";
import Home from "../models/home.model.js";

// ➕ Add review for a booking
export const addReview = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    // 1️⃣ Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // 2️⃣ Check if review already exists
    const existingReview = await Review.findOne({
      booking: bookingId,
      user: userId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You already submitted a review for this booking" });
    }

    // 3️⃣ Create review
    const review = await Review.create({
      booking: bookingId,
      user: userId,
      rating,
      comment,
    });

    // 4️⃣ Update home's rating summary
    const homeId = booking.homeId;
    const stats = await Review.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "booking",
          foreignField: "_id",
          as: "booking",
        },
      },
      { $unwind: "$booking" },
      { $match: { "booking.homeId": homeId } },
      {
        $group: {
          _id: "$booking.homeId",
          averageRating: { $avg: "$rating" },
          reviewsCount: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Home.findByIdAndUpdate(homeId, {
        averageRating: stats[0].averageRating,
        reviewsCount: stats[0].reviewsCount,
      });
    }

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// 📖 Get reviews by booking
export const getReviewsByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const reviews = await Review.find({ booking: bookingId })
      .populate("user", "username profile.profileImage")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 📖 Get reviews by home
export const getReviewsByHomeId = async (req, res) => {
  try {
    const { homeId } = req.params;

    const bookings = await Booking.find({ homeId }).select("_id");
    const bookingIds = bookings.map((b) => b._id);

    const reviews = await Review.find({ booking: { $in: bookingIds } })
      .populate("user", "username profile.profileImage")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📝 Owner reply to review
export const replyToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { text } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.ownerReply = {
      text,
      createdAt: new Date(),
    };

    await review.save();
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ❌ Delete review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const booking = await Booking.findById(review.booking);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await Review.findByIdAndDelete(reviewId);

    // Recalculate home's rating
    const homeId = booking.homeId;
    const stats = await Review.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "booking",
          foreignField: "_id",
          as: "booking",
        },
      },
      { $unwind: "$booking" },
      { $match: { "booking.homeId": homeId } },
      {
        $group: {
          _id: "$booking.homeId",
          averageRating: { $avg: "$rating" },
          reviewsCount: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Home.findByIdAndUpdate(homeId, {
        averageRating: stats[0].averageRating,
        reviewsCount: stats[0].reviewsCount,
      });
    } else {
      await Home.findByIdAndUpdate(homeId, {
        averageRating: 0,
        reviewsCount: 0,
      });
    }

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
