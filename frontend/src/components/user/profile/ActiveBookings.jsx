import React, { useState } from 'react';
import BookingCard from './BookingCard';
import CancelBookingModal from './CancelBookingModal';

const ActiveBookings = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const activeBookings = [
    {
      id: 1,
      propertyName: 'Sunset Villa Resort',
      location: 'Santorini, Greece',
      checkIn: '2024-03-15',
      checkOut: '2024-03-20',
      guests: 2,
      totalPrice: 850,
      status: 'confirmed',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      propertyName: 'Mountain Cabin Retreat',
      location: 'Aspen, Colorado',
      checkIn: '2024-04-10',
      checkOut: '2024-04-15',
      guests: 4,
      totalPrice: 1200,
      status: 'pending',
      image: 'https://images.pexels.com/photos/1571457/pexels-photo-1571457.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      propertyName: 'City Center Apartment',
      location: 'Paris, France',
      checkIn: '2024-05-01',
      checkOut: '2024-05-07',
      guests: 2,
      totalPrice: 980,
      status: 'confirmed',
      image: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    console.log('Booking cancelled:', selectedBooking.id);
    setShowCancelModal(false);
    setSelectedBooking(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Bookings</h1>
          <p className="text-gray-600 mt-1">Manage your upcoming reservations</p>
        </div>
        <div className="text-sm text-gray-500">
          {activeBookings.length} active booking{activeBookings.length !== 1 ? 's' : ''}
        </div>
      </div>

      {activeBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Bookings</h3>
          <p className="text-gray-600 mb-6">You don't have any upcoming reservations</p>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Browse Properties
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancelClick}
              showCancelButton={true}
            />
          ))}
        </div>
      )}

      {showCancelModal && (
        <CancelBookingModal
          booking={selectedBooking}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelConfirm}
        />
      )}
    </div>
  );
};

export default ActiveBookings;