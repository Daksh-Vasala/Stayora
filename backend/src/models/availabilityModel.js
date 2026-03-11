const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const availabilitySchema = new Schema(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },

    date: Date,

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Availability", availabilitySchema);
