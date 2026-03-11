const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    propertyType: {
      type: String,
      enum: ["apartment", "villa", "house", "studio"],
    },

    pricePerNight: {
      type: Number,
      required: true,
    },

    location: {
      city: String,
      country: String,
      address: String,
    },

    maxGuests: Number,

    bedrooms: Number,

    bathrooms: Number,

    beds: Number,

    amenities: [String],

    images: [String],

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("property", propertySchema);