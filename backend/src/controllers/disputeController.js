const Booking = require("../models/bookingModel");
const Dispute = require("../models/disputeModel");

exports.createDispute = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ✅ Only guest or host
    if (
      booking.guest.toString() !== userId &&
      booking.host.toString() !== userId
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // ✅ Only after booking starts
    if (!["confirmed", "completed"].includes(booking.status)) {
      return res.status(400).json({
        message: "Cannot raise dispute now",
      });
    }

    // ✅ Prevent duplicate
    const existing = await Dispute.findOne({ booking: bookingId });

    if (existing) {
      return res.status(400).json({
        message: "Dispute already exists",
      });
    }

    const dispute = await Dispute.create({
      booking: bookingId,
      raisedBy: userId,
      reason,
    });

    res.status(201).json({
      success: true,
      dispute,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /disputes/booking/:bookingId - Check if dispute exists
exports.getDisputeByBooking = async (req, res) => {
  try {
    const  bookingId  = req.params.id;
    const dispute = await Dispute.findOne({ booking: bookingId });
    res.json({ dispute: dispute || null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};