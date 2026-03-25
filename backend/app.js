const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const cookieParser = require("cookie-parser");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

require("dotenv").config();
const PORT = process.env.PORT;

const db = require("./src/config/db.js");
db();

const userRouter = require("./src/routers/userRouter.js");
const propertyRouter = require("./src/routers/propertyRouter.js");
const bookingRouter = require("./src/routers/bookingRouter.js");
const reviewRouter = require("./src/routers/reviewRouter.js");
const messageRouter = require("./src/routers/messageRouter.js");
const paymentRouter = require("./src/routers/paymentRouter.js");

app.use("/user", userRouter);
app.use("/property", propertyRouter);
app.use("/bookings", bookingRouter);
app.use("/reviews", reviewRouter);
app.use("/messages", messageRouter);
app.use("/payments", paymentRouter);

module.exports = app;
