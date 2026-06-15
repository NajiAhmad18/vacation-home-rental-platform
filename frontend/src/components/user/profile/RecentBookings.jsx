import React from 'react';
import BookingCard from './BookingCard';
import { Clock } from 'lucide-react';

const RecentBookings = () => {
  const recentBookings = [
    {
      id: 4,
      propertyName: 'Ocean View Hotel',
      location: 'Miami Beach, Florida',
      checkIn: '2024-01-15',
      checkOut: '2024-01-20',
      guests: 2,
      totalPrice: 650,
      status: 'completed',
      image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 5,
      propertyName: 'Historic Downtown Loft',
      location: 'Boston, Massachusetts',
      checkIn: '2023-12-10',
      checkOut: '2023-12-15',
      guests: 3,
      totalPrice: 890,
      status: 'completed',
      image: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 6,
      propertyName: 'Lakeside Cottage',
      location: 'Lake Tahoe, California',
      checkIn: '2023-11-20',
      checkOut: '2023-11-25',
      guests: 4,
      totalPrice: 1100,
      status: 'completed',
      image: 'https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 7,
      propertyName: 'Urban Studio Apartment',
      location: 'New York City, New York',
      checkIn: '2023-10-05',
      checkOut: '2023-10-10',
      guests: 2,
      totalPrice: 750,
      status: 'cancelled',
      image: 'https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recent Bookings</h1>
          <p className="text-gray-600 mt-1">Your booking history and past stays</p>
        </div>
        <div className="text-sm text-gray-500">
          {recentBookings.length} past booking{recentBookings.length !== 1 ? 's' : ''}
        </div>
      </div>

      {recentBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Booking History</h3>
          <p className="text-gray-600 mb-6">You haven't made any bookings yet</p>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Start Exploring
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              showCancelButton={false}
              isHistorical={true}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {recentBookings.length > 0 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
            <span className="font-medium">12</span> results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-1 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700">
              1
            </button>
            <button className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentBookings;