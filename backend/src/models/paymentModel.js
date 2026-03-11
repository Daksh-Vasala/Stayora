const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },

    guest: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    amount: Number,

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "wallet"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);
