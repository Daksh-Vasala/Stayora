const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");

const authMiddleware = require("../middlewares/authMiddleware");
const hostMiddleware = require("../middlewares/hostMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.post("/", authMiddleware, bookingController.createBooking);
router.get(
  "/",
  authMiddleware,
  hostMiddleware,
  bookingController.getBookingsOfHost,
);
router.get(
  "/getAll",
  authMiddleware,
  adminMiddleware,
  bookingController.getAllBookings,
);
router.get("/:id", authMiddleware, bookingController.getBookingById);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  bookingController.updateBooking,
);
router.delete("/:id", authMiddleware, bookingController.deleteBooking);

module.exports = router;
