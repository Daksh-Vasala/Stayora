// utils/cancellationUtil.js

/**
 * Calculate refund amount based on cancellation timing
 * @param {Object} booking - Booking object with checkIn date and totalPrice
 * @returns {Object} Refund details
 */
const calculateRefund = (booking) => {
  const checkInDate = new Date(booking.checkIn);
  const today = new Date();
  const daysUntilCheckIn = Math.ceil((checkInDate - today) / (1000 * 60 * 60 * 24));
  
  const totalAmount = booking.totalPrice;
  
  // Pending bookings - full refund
  if (booking.status === "pending") {
    return {
      refundAmount: totalAmount,
      percentage: 100,
      message: "Full refund"
    };
  }
  
  // More than 7 days - full refund
  if (daysUntilCheckIn > 7) {
    return {
      refundAmount: totalAmount,
      percentage: 100,
      message: "Full refund (7+ days before check-in)"
    };
  }
  
  // 3-7 days - 75% refund
  if (daysUntilCheckIn >= 3 && daysUntilCheckIn <= 7) {
    return {
      refundAmount: Math.round(totalAmount * 0.75),
      percentage: 75,
      message: "75% refund (3-7 days before check-in)"
    };
  }
  
  // Less than 3 days - 50% refund
  if (daysUntilCheckIn > 0 && daysUntilCheckIn < 3) {
    return {
      refundAmount: Math.round(totalAmount * 0.5),
      percentage: 50,
      message: "50% refund (less than 3 days before check-in)"
    };
  }
  
  // After check-in - no refund
  return {
    refundAmount: 0,
    percentage: 0,
    message: "No refund for cancellations on or after check-in"
  };
};

/**
 * Check if booking can be cancelled
 * @param {Object} booking - Booking object
 * @returns {boolean} Can cancel or not
 */
const canCancel = (booking) => {
  if (booking.status === "cancelled") return false;
  if (booking.status === "completed") return false;
  
  const checkInDate = new Date(booking.checkIn);
  const today = new Date();
  
  // Cannot cancel after check-in
  if (checkInDate < today) return false;
  
  // Can cancel if pending or confirmed
  return booking.status === "pending" || booking.status === "confirmed";
};

module.exports = { calculateRefund, canCancel };