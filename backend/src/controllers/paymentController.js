const Payment = require("../models/paymentModel");
const Booking = require("../models/bookingModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// CREATE PAYMENT
exports.createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("property");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const amount = booking.totalPrice;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + bookingId,
    });

    const payment = await Payment.create({
      booking: bookingId,
      guest: booking.guest,
      host: booking.host,
      amount,
      razorpayOrderId: order.id,
    });

    res.status(201).json({
      success: true,
      paymentId: payment._id,
      order,  // Add this line
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// GET PAYMENTS
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: expectedSignature,
        paymentStatus: "paid",
      },
    );

    await Booking.findByIdAndUpdate(payment.booking, { paymentStatus: "paid", status: "confirmed" });

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PAYMENT
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
