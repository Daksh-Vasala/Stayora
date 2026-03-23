const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true
    },

    password: {
      type: String,
      rquired: true
    },
    role: {
      type: String,
      enum: ["admin", "host", "guest"],
      default: "guest",
    },
    phone: {
      type: String,
      unique: true
    },

    profilePic: String,

    resetPasswordToken: {
      type: String
    },

    resetPasswordExpire: {
      type: Date
    },

    is_verified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
