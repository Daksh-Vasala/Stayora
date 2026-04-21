const Booking = require("../models/bookingModel");

function startBookingExpiryWorker() {
  setInterval(async () => {
    try {
      const now = new Date();

      const result = await Booking.updateMany(
        {
          status: "pending",
          expiresAt: { $lt: now },
        },
        {
          status: "cancelled",
          cancelledAt: now,
          cancelledBy: "admin",
          cancellationReason: "Payment timeout",
        },
      );

      await Booking.updateMany(
        {
          status: "confirmed",
          checkOut: { $lt: now },
        },
        {
          status: "completed",
          completedAt: now,
        },
      );

      if (result.modifiedCount > 0) {
        console.log(`Expired ${result.modifiedCount} bookings`);
      }
    } catch (err) {
      console.error("Expiry Worker Error:", err);
    }
  }, 60 * 1000); // every 1 min
}

module.exports = startBookingExpiryWorker;
