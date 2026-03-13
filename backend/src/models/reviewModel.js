const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },

    guest: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },

    comment: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Review", reviewSchema);
