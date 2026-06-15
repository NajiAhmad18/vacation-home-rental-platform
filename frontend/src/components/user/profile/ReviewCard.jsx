import React, { useState } from 'react';
import { Star, Edit3, MapPin, Image as ImageIcon, MessageSquare } from 'lucide-react';

const ReviewCard = ({ review }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState(review.review);
  const [editedRating, setEditedRating] = useState(review.rating);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderStars = (rating, interactive = false, onRatingChange) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`${interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              size={16}
              className={star <= rating ? 'text-amber-400 fill-current' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
    );
  };

  const handleSave = () => {
    console.log('Updated review:', {
      id: review.id,
      rating: editedRating,
      review: editedReview
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedReview(review.review);
    setEditedRating(review.rating);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Review Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {review.propertyName}
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin size={16} className="mr-1" />
              <span className="text-sm">{review.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  renderStars(editedRating, true, setEditedRating)
                ) : (
                  renderStars(review.rating)
                )}
                <span className="text-sm text-gray-600">{formatDate(review.date)}</span>
              </div>
              {review.canEdit && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit3 size={14} />
                  <span>Edit</span>
                </button>
              )}
              {!review.canEdit && (
                <span className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-lg">
                  Cannot edit
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={editedReview}
                onChange={(e) => setEditedReview(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={4}
                placeholder="Share your experience..."
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">{review.review}</p>
            
            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex items-center space-x-3">
                <ImageIcon size={16} className="text-gray-400" />
                <div className="flex space-x-2">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Host Response */}
      {review.hostResponse && !isEditing && (
        <div className="bg-gray-50 border-t border-gray-200 p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageSquare size={16} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">Host Response</p>
              <p className="text-sm text-gray-700 leading-relaxed">{review.hostResponse}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;