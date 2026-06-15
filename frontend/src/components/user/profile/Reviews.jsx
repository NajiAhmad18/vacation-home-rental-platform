import React from 'react';
import ReviewCard from './ReviewCard';
import { Star } from 'lucide-react';

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      propertyName: 'Ocean View Hotel',
      location: 'Miami Beach, Florida',
      rating: 5,
      review: 'Amazing stay! The ocean view was breathtaking and the staff was incredibly helpful. The room was clean and comfortable. Would definitely stay again!',
      date: '2024-01-22',
      canEdit: false,
      images: ['https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400'],
      hostResponse: 'Thank you for the wonderful review! We\'re delighted you enjoyed your stay.'
    },
    {
      id: 2,
      propertyName: 'Historic Downtown Loft',
      location: 'Boston, Massachusetts',
      rating: 4,
      review: 'Great location in the heart of downtown. The loft was spacious and had character. Only minor issue was the noise from the street at night.',
      date: '2023-12-18',
      canEdit: false,
      images: ['https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=400']
    },
    {
      id: 3,
      propertyName: 'Lakeside Cottage',
      location: 'Lake Tahoe, California',
      rating: 5,
      review: 'Perfect getaway! The cottage was cozy and the lake view was stunning. Great for a peaceful retreat away from the city.',
      date: '2023-11-27',
      canEdit: true,
      images: ['https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg?auto=compress&cs=tinysrgb&w=400']
    }
  ];

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Reviews</h1>
          <p className="text-gray-600 mt-1">Reviews you've submitted for your stays</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 text-amber-500">
            <Star size={20} fill="currentColor" />
            <span className="text-lg font-semibold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-gray-600">Your average rating</p>
        </div>
      </div>

      {/* Review Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Review Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
            <p className="text-sm text-gray-600">Total Reviews</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{reviews.filter(r => r.hostResponse).length}</p>
            <p className="text-sm text-gray-600">Host Responses</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{reviews.filter(r => r.canEdit).length}</p>
            <p className="text-sm text-gray-600">Can Edit</p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
          <p className="text-gray-600 mb-6">Share your experiences by leaving reviews for your stays</p>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Browse Past Bookings
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Help Section */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Star className="text-amber-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-900 mb-2">
              Review Guidelines
            </h3>
            <p className="text-amber-700 mb-3">
              You can edit your reviews within 12 hours of submission. After that, reviews become permanent to maintain authenticity.
            </p>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Be honest and constructive in your feedback</li>
              <li>• Include specific details about your stay</li>
              <li>• Photos help other travelers make informed decisions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;