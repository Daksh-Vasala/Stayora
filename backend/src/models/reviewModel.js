const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    // 🔷 Which property is being reviewed
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    // 🔷 Who wrote the review (guest)
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔷 Link to booking (VERY IMPORTANT)
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true, // one review per booking
    },

    // 🔷 Rating (1 to 5)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // 🔷 Review text
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);


// ✅ Index for fast property reviews
reviewSchema.index({ property: 1 });

// ✅ Optional: prevent same user spamming same property
reviewSchema.index({ user: 1, property: 1 });

module.exports = mongoose.model("Review", reviewSchema);