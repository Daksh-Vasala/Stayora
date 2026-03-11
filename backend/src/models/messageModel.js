const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },

    message: String,

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Message", messageSchema);
