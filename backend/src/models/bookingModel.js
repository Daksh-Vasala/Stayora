const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },

    guest: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    checkIn: Date,

    checkOut: Date,

    guestsCount: Number,

    totalPrice: Number,

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
