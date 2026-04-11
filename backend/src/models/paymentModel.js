const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Booking",
    },

    guest: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    // 🔴 Razorpay fields (MANDATORY)
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },

    razorpayPaymentId: {
      type: String,
      ref: "Payment"
    },

    razorpaySignature: {
      type: String,
    },

    paymentStatus: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "wallet"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);