const Booking = require("../models/bookingModel");

const createBooking = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = { createBooking };
