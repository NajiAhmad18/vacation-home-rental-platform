import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, MapPin, Bed, Bath, Square } from "lucide-react";
import { useHomeStore } from "../../stores/useHomeStore";
import { useBookingStore } from "../../stores/useBookingStore";
import { useReviewStore } from "../../stores/useReviewStore";

function StarRating({ rating, onRatingChange, interactive = false }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-all duration-200`}
          onClick={interactive ? () => onRatingChange?.(star) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          disabled={!interactive}
        >
          <Star
            className={`w-5 h-5 ${star <= (hoverRating || rating) ? "text-yellow-400 fill-current" : "text-gray-300"} transition-colors duration-200`}
          />
        </button>
      ))}
    </div>
  );
}

export default function Review() {
  const { bookingId } = useParams();
  const { getBookingById } = useBookingStore();
  const {  fetchReviewsByHome, addReview: addReviewStore, reviews } = useReviewStore();
  const { getHomeById } = useHomeStore();

  const [home, setHome] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "", userName: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1️⃣ Fetch booking
        const booking = await getBookingById(bookingId);
        if (!booking) throw new Error("Booking not found");

        // 2️⃣ Set home from booking
        const homeData = booking.homeId;
        setHome(homeData);

        // 3️⃣ Fetch all reviews for this home
        await fetchReviewsByHome(homeData._id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [bookingId, getBookingById, fetchReviewsByHome]);

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (!home) return <p className="text-center py-20">Home not found</p>;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if ( !newReview.comment.trim() || newReview.rating === 0) return;

    // Add review by booking
    await addReviewStore(bookingId, newReview);

    // Refresh all reviews for the home after submission
    await fetchReviewsByHome(home._id);

    setNewReview({ rating: 0, comment: "", userName: "" });
  };

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : home.averageRating || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Home Details */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-full min-h-[300px]">
              <img src={home.images?.[0]} alt={home.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full font-semibold text-blue-600">
                LKR {home.price}
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{home.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{home.location?.city}, {home.location?.district}</span>
              </div>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-1">
                  <Bed className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{home.bedrooms} beds</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Bath className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{home.bathrooms} baths</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Square className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{home.floorArea || "N/A"} sq ft</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {home.features?.map((f, i) => (
                    <span key={i} className="text-gray-700 text-sm">• {f}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <StarRating rating={Math.round(averageRating)} />
                  <span className="text-gray-700 font-semibold">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-gray-500">({reviews.length} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Write a Review</h2>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <StarRating
                    rating={newReview.rating}
                    onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                    interactive={true}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Share your experience..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Reviews ({reviews.length})
              </h2>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-start space-x-4">
                      <img
                        src={review.user?.avatar || "https://via.placeholder.com/50"}
                        alt={review.user?.name || "alt"}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{review.user?.name || "User Name"}</h4>
                          <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <StarRating rating={review.rating} />
                          <span className="text-sm text-gray-600">({review.rating}/5)</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
