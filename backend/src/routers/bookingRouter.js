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

router.get("/:id", authMiddleware, bookingController.getBookingById);

router.delete("/:id", authMiddleware, bookingController.deleteBooking);

module.exports = router;
