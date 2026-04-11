const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
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

    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.checkIn;
        },
        message: "Check-out must be after check-in",
      },
    },

    guestsCount: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    // 🔷 Booking status
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    // 🔷 Payment status
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed", "refunded"],
      default: "unpaid",
    },

    // 🔷 Payment gateway reference
    paymentId: {
      type: String,
    },

    // 🔷 Expiration ONLY for pending bookings
    expiresAt: {
      type: Date,
      default: function () {
        if (this.status === "pending") {
          return new Date(Date.now() + 15 * 60 * 1000); // 15 min
        }
        return null;
      },
    },

    // 🔷 Cancellation reason
    cancellationReason: {
      type: String,
    },

    // 🔷 Cancellation tracking
    cancelledAt: {
      type: Date,
      default: null,
    },

    // 🔷 Refund details
    refundAmount: {
      type: Number,
      default: 0,
    },

    refundPercentage: {
      type: Number,
      default: 0,
    },

    refundProcessedAt: {
      type: Date,
      default: null,
    },

    // 🔷 Cancellation message
    cancellationMessage: {
      type: String,
      default: "",
    },

    // 🔷 Who cancelled
    cancelledBy: {
      type: String,
      enum: ["guest", "host", "admin", null],
      default: null,
    },

    // 🔷 Completed at
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);


// ✅ Middleware to manage expiresAt correctly
bookingSchema.pre("save", function () {
  // If status is changed
  if (this.isModified("status")) {
    // Remove expiry if not pending
    if (["confirmed", "cancelled", "completed"].includes(this.status)) {
      this.expiresAt = null;
    }

    // If somehow set back to pending, reassign expiry
    if (this.status === "pending" && !this.expiresAt) {
      this.expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    }
  }
});


// ✅ (Optional but recommended) Index for expiry queries
bookingSchema.index({ status: 1, expiresAt: 1 });

module.exports = mongoose.model("Booking", bookingSchema);