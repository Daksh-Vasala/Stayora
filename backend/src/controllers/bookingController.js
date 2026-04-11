const Booking = require("../models/bookingModel");
const Property = require("../models/propertyModel");
const User = require("../models/userModel");
const { calculateRefund, canCancel } = require("../utils/cancellationLogic");

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guestsCount } = req.body;
    const { id } = req.user;

    const user = await User.findById(id);
    if (!user.is_verified) {
      return res.status(401).json({
        message: "Your account is not verified, please verify first",
      });
    }

    const existingBooking = await Booking.findOne({
      property: propertyId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          checkIn: { $lt: checkOut },
          checkOut: { $gt: checkIn },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Property not available for booking",
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(400).json({
        message: "Property not found",
      });
    }

    const host = property.host;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Calculate nights
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24),
    );

    if (nights <= 0) {
      return res.status(400).json({
        message: "Invalid booking dates",
      });
    }

    const subtotal = nights * property.pricePerNight;

    const taxRate = 0.05; // 5% tax
    const taxes = Math.round(subtotal * taxRate);
    const totalPrice = subtotal + taxes;

    const booking = await Booking.create({
      property: propertyId,
      checkIn,
      checkOut,
      host,
      guest: req.user.id,
      guestsCount,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: "Booking created",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL BOOKINGS
const getBookingsOfHost = async (req, res) => {
  try {
    const bookings = await Booking.find({ host: req.user.id })
      .populate("property")
      .populate("guest");

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// GET SINGLE BOOKING
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("property")
      .populate("guest")
      .populate("host");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// DELETE BOOKING
const deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Booking deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const getBookingOfUser = async (req, res) => {
  try {
    const { id } = req.user;
    const bookings = await Booking.find({
      guest: id,
    });

    if (bookings.length === 0) {
      return res.status(400).json({
        message: "No bookings found for this user",
      });
    }

    res.json({
      success: true,
      message: "Bookings fetched",
      data: bookings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// controllers/bookingController.js

// controllers/bookingController.js

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check ownership
    if (booking.guest.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

    // Already cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled",
      });
    }

    // Completed bookings cannot be cancelled
    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a completed booking",
      });
    }

    // Check if check-in date has passed
    const checkInDate = new Date(booking.checkIn);
    const today = new Date();

    if (checkInDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel after check-in date",
      });
    }

    // Calculate days until check-in
    const daysUntilCheckIn = Math.ceil(
      (checkInDate - today) / (1000 * 60 * 60 * 24),
    );

    // Update booking status
    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    booking.cancelledBy = "guest";

    let refundAmount = 0;
    let refundPercentage = 0;
    let cancellationMessage = "";

    // Handle based on payment status
    if (
      booking.paymentStatus === "unpaid" ||
      booking.paymentStatus === "pending"
    ) {
      // No payment made - just cancel, no refund
      cancellationMessage = "Booking cancelled. No payment was made.";
      refundAmount = 0;
      refundPercentage = 0;
    } else if (booking.paymentStatus === "paid") {
      // Calculate refund based on days until check-in
      if (daysUntilCheckIn > 7) {
        refundAmount = booking.totalPrice;
        refundPercentage = 100;
        cancellationMessage = `Full refund of ₹${refundAmount} (cancelled ${daysUntilCheckIn} days before check-in)`;
        booking.paymentStatus = "refunded";
      } else if (daysUntilCheckIn >= 3 && daysUntilCheckIn <= 7) {
        refundAmount = Math.round(booking.totalPrice * 0.75);
        refundPercentage = 75;
        cancellationMessage = `75% refund of ₹${refundAmount} (cancelled ${daysUntilCheckIn} days before check-in)`;
        booking.paymentStatus = "refunded";
      } else if (daysUntilCheckIn > 0 && daysUntilCheckIn < 3) {
        refundAmount = Math.round(booking.totalPrice * 0.5);
        refundPercentage = 50;
        cancellationMessage = `50% refund of ₹${refundAmount} (cancelled ${daysUntilCheckIn} days before check-in)`;
        booking.paymentStatus = "refunded";
      } else {
        refundAmount = 0;
        refundPercentage = 0;
        cancellationMessage =
          "No refund applicable for cancellation at this time";
      }
    }

    booking.refundAmount = refundAmount;
    booking.refundPercentage = refundPercentage;
    booking.cancellationMessage = cancellationMessage;
    booking.refundProcessedAt = refundAmount > 0 ? new Date() : null;

    await booking.save();

    res.status(200).json({
      success: true,
      message: cancellationMessage,
      data: {
        refundAmount,
        refundPercentage,
        paymentStatus: booking.paymentStatus,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};

// Add to bookingController.jsc
const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentId } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        paymentStatus: "paid",
        status: "confirmed",
        paymentId: paymentId,
      },
      { new: true },
    );

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getBookingsOfHost,
  deleteBooking,
  getBookingOfUser,
  getBookingOfUser,
  cancelBooking,
  confirmPayment,
};
