const mongoose = require("mongoose");

const DBConnection = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Databse connected ✅");
    })
    .catch((error) => {
      console.log("Databse failed to connect ❌", error);
    })
}

module.exports = DBConnection;