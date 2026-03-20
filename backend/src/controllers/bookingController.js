const Booking = require("../models/bookingModel");
const Property = require("../models/propertyModel");

// CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guestsCount } = req.body;

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
    const totalPrice = property.pricePerNight;

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
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("property")
      .populate("guest");

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE BOOKING
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("property")
      .populate("guest");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE BOOKING
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE BOOKING
exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Booking deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
