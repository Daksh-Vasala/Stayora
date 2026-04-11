const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");

const authMiddleware = require("../middlewares/authMiddleware");
const allowedRoles = require("../middlewares/allowedRoles");

router.post("/", authMiddleware, bookingController.createBooking);
router.get(
  "/",
  authMiddleware,
  allowedRoles("host"),
  bookingController.getBookingsOfHost,
);

router.get("/getBookings", authMiddleware, bookingController.getBookingOfUser);

router.get("/:id", authMiddleware, bookingController.getBookingById);

// Cancel booking
router.patch("/:id/cancel", authMiddleware, bookingController.cancelBooking);

router.delete("/:id", authMiddleware, bookingController.deleteBooking);

// routes/bookingRoutes.js
router.patch("/:id/confirm-payment", authMiddleware, bookingController.confirmPayment);

module.exports = router;
