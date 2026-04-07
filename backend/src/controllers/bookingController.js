const Booking = require("../models/bookingModel");
const Property = require("../models/propertyModel");
const User = require("../models/userModel");

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guestsCount } = req.body;
    const { id } = req.user;

    const user = await User.findById(id);
    if(!user.is_verified){
      return res.status(401).json({
        message: "Your account is not verified, please verify first"
      })
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
      .populate("guest");

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
    const { id } = req.params;
    const bookings = await Booking.find({
      guest: id
    })
     res.json({
      message: "Bookings fetched"
     })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Internal server error"
    })
  }
}

module.exports = {
  createBooking,
  getBookingById,
  getBookingsOfHost,
  deleteBooking,
  getBookingOfUser
};
