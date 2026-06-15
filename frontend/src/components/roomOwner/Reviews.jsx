import React, { useState } from "react";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Flag,
  Filter,
  Search,
} from "lucide-react";

const Reviews = () => {
  const [reviews] = useState([
    {
      id: 1,
      propertyName: "Sunset Villa",
      guestName: "Sarah Johnson",
      rating: 5,
      date: "2024-01-14",
      title: "Amazing stay with breathtaking views!",
      comment:
        "The villa exceeded all our expectations. The sunset views were absolutely stunning, and the property was immaculate. The host was very responsive and provided excellent recommendations for local restaurants. We will definitely be back!",
      helpful: 12,
      response:
        "Thank you so much for the wonderful review, Sarah! We're thrilled you enjoyed the sunset views and found everything to your liking. Looking forward to hosting you again soon!",
    },
    {
      id: 2,
      propertyName: "Ocean View Apartment",
      guestName: "Michael Chen",
      rating: 5,
      date: "2024-01-12",
      title: "Perfect location and great amenities",
      comment:
        "Fantastic apartment right by the beach. Everything was clean and well-maintained. The kitchen had everything we needed, and the WiFi was fast. Great communication from the host throughout our stay.",
      helpful: 8,
      response: null,
    },
    {
      id: 3,
      propertyName: "Mountain Cabin",
      guestName: "Emily Rodriguez",
      rating: 4,
      date: "2024-01-10",
      title: "Cozy cabin with minor issues",
      comment:
        "Beautiful location and very cozy cabin. The fireplace was perfect for cold evenings. However, the hot water took a while to heat up, and the WiFi was a bit spotty. Overall, still a great experience.",
      helpful: 5,
      response:
        "Thank you for your feedback, Emily! We're glad you enjoyed the cozy atmosphere. We've since addressed the hot water issue and upgraded our internet connection. Hope to see you again!",
    },
    {
      id: 4,
      propertyName: "Downtown Loft",
      guestName: "David Wilson",
      rating: 5,
      date: "2024-01-08",
      title: "Modern loft in perfect location",
      comment:
        "Stylish loft in the heart of downtown. Walking distance to restaurants, shops, and attractions. The space was exactly as described and very comfortable. Highly recommend!",
      helpful: 15,
      response: null,
    },
    {
      id: 5,
      propertyName: "Sunset Villa",
      guestName: "Lisa Thompson",
      rating: 3,
      date: "2024-01-05",
      title: "Good property but some concerns",
      comment:
        "The villa is beautiful and the location is great. However, we had some issues with the air conditioning not working properly on the first day. The host was quick to fix it, but it affected our first night's comfort.",
      helpful: 3,
      response:
        "We sincerely apologize for the AC issue, Lisa. We've since had the entire system serviced and installed backup units. Thank you for bringing this to our attention, and we hope you'll give us another chance.",
    },
  ]);

  const [filterRating, setFilterRating] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-500 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesRating =
      filterRating === "All" || review.rating.toString() === filterRating;
    const matchesSearch =
      review.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage:
      (reviews.filter((r) => r.rating === rating).length / reviews.length) *
      100,
  }));

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h1>
        <div className="text-sm text-gray-600">
          {filteredReviews.length} of {reviews.length} reviews
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-gray-600">Overall Rating</div>
            <div className="text-sm text-gray-500 mt-1">
              Based on {reviews.length} reviews
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rating Distribution
          </h3>
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Response Rate
          </h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
            <div className="text-gray-600">Reviews Responded</div>
            <div className="text-sm text-gray-500 mt-1">
              {reviews.filter((r) => r.response).length} of {reviews.length}{" "}
              reviews
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {review.guestName}
                  </h3>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-600">
                    {review.propertyName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="text-sm text-gray-500">
                    {formatDate(review.date)}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>

            {review.response && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <MessageSquare className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-900">
                    Host Response
                  </span>
                </div>
                <p className="text-blue-800 text-sm">{review.response}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">Helpful ({review.helpful})</span>
                </button>
              </div>

              {!review.response && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  Respond
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
          <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Reviews Found
          </h3>
          <p className="text-gray-500">
            {searchTerm || filterRating !== "All"
              ? "Try adjusting your search or filter criteria."
              : "You don't have any reviews yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Reviews;
