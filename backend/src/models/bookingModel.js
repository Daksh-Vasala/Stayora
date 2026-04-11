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

    // 🔷 Expiration for pending bookings only
    expiresAt: {
      type: Date,
      default: function () {
        // Only set expiration for pending bookings
        if (this.status === "pending") {
          return new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
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

    // 🔷 Cancellation message (what user sees)
    cancellationMessage: {
      type: String,
      default: "",
    },

    // 🔷 Who cancelled (user, host, or admin)
    cancelledBy: {
      type: String,
      enum: ["guest", "host", "admin", null],
      default: null,
    },

    // 🔷 Completed at (when trip ended)
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// ✅ TTL Index - Only auto-delete documents that are:
// 1. Status is "pending"
// 2. expiresAt has passed
bookingSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { status: "pending" },
  },
);

// ✅ Middleware to manage expiresAt when status changes
bookingSchema.pre("save", function () {
  // If status changes to confirmed, cancelled, or completed, remove expiration
  if (this.isModified("status")) {
    if (["confirmed", "cancelled", "completed"].includes(this.status)) {
      this.expiresAt = null;
    }
    // If status changes back to pending (unlikely but possible), set new expiration
    else if (this.status === "pending" && !this.expiresAt) {
      this.expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    }
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
