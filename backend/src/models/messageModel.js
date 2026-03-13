const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
{
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  property: {
    type: Schema.Types.ObjectId,
    ref: "Property"
  },

  message: {
    type: String,
    required: true,
    trim: true
  },

  isRead: {
    type: Boolean,
    default: false
  }

},
{ timestamps: true }
);

messageSchema.index({ sender: 1, receiver: 1 });

module.exports = mongoose.model("Message", messageSchema);