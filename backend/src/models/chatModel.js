const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timeStamps: true,
  },
);

module.exports = mongoose.model("Chat", chatSchema);
