const mongoose = require("mongoose");

const db = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database connected ✅");
    })
    .catch((error) => {
      console.log("Database failed to connect ❌", error);
    })
}

module.exports = db;