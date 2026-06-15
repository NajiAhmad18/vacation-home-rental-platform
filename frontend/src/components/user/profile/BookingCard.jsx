import React from 'react';
import { MapPin, Calendar, Users, DollarSign, MoreHorizontal } from 'lucide-react';

const BookingCard = ({ booking, onCancel, showCancelButton = false, isHistorical = false }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="md:flex">
        {/* Property Image */}
        <div className="md:w-48 h-48 md:h-auto">
          <img
            src={booking.image}
            alt={booking.propertyName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Booking Details */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {booking.propertyName}
              </h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin size={16} className="mr-1" />
                <span className="text-sm">{booking.location}</span>
              </div>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                {getStatusText(booking.status)}
              </span>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Booking Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-600">Check-in</p>
                <p className="text-sm font-medium">{formatDate(booking.checkIn)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-600">Check-out</p>
                <p className="text-sm font-medium">{formatDate(booking.checkOut)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-600">Guests</p>
                <p className="text-sm font-medium">{booking.guests}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-sm font-medium">${booking.totalPrice}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                View Details
              </button>
              {isHistorical && booking.status === 'completed' && (
                <button className="px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
                  Leave Review
                </button>
              )}
              {!isHistorical && (
                <button className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  Contact Host
                </button>
              )}
            </div>
            {showCancelButton && booking.status !== 'cancelled' && (
              <button
                onClick={() => onCancel(booking)}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;