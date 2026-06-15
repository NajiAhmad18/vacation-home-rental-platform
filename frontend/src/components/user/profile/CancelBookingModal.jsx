import React, { useState } from 'react';
import { X, AlertTriangle, Calendar, DollarSign } from 'lucide-react';

const CancelBookingModal = ({ booking, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const cancelReasons = [
    'Change in travel plans',
    'Found alternative accommodation',
    'Emergency situation',
    'Health concerns',
    'Work commitments',
    'Other'
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateRefund = () => {
    const checkInDate = new Date(booking.checkIn);
    const today = new Date();
    const daysUntilCheckIn = Math.ceil((checkInDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilCheckIn >= 7) {
      return booking.totalPrice * 0.9; // 90% refund
    } else if (daysUntilCheckIn >= 3) {
      return booking.totalPrice * 0.5; // 50% refund
    } else {
      return 0; // No refund
    }
  };

  const refundAmount = calculateRefund();
  const cancellationFee = booking.totalPrice - refundAmount;

  const handleConfirm = () => {
    const finalReason = reason === 'Other' ? customReason : reason;
    console.log('Cancellation reason:', finalReason);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Cancel Booking</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{booking.propertyName}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>Check-in: {formatDate(booking.checkIn)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>Check-out: {formatDate(booking.checkOut)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign size={16} />
                  <span>Total paid: ${booking.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Information */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-2">Refund Policy</h4>
            <div className="space-y-2 text-sm text-amber-700">
              <div className="flex justify-between">
                <span>Refund amount:</span>
                <span className="font-medium">${refundAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Cancellation fee:</span>
                <span className="font-medium">${cancellationFee}</span>
              </div>
              <div className="border-t border-amber-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>You will receive:</span>
                  <span>${refundAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Reason for cancellation (optional)
            </label>
            <div className="space-y-2">
              {cancelReasons.map((reasonOption) => (
                <label key={reasonOption} className="flex items-center">
                  <input
                    type="radio"
                    name="reason"
                    value={reasonOption}
                    checked={reason === reasonOption}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{reasonOption}</span>
                </label>
              ))}
            </div>
            
            {reason === 'Other' && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please specify your reason..."
                className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
              />
            )}
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
              <div className="text-sm text-red-700">
                <p className="font-medium mb-1">Are you sure you want to cancel?</p>
                <p>This action cannot be undone. You will be charged according to the cancellation policy.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Keep Booking
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;