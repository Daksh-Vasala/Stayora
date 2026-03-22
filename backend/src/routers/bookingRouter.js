const express = require("express");
const router = express.Router();

const {
  createBooking,
  getBookingsOfHost,
  getBookingById,
  updateBooking,
  deleteBooking
} = require("../controllers/bookingController");

const authMiddleware = require("../middlewares/authMiddleware");
const hostMiddleware = require("../middlewares/hostMiddleware");

router.post("/", authMiddleware, createBooking);
router.get("/", authMiddleware, hostMiddleware, getBookingsOfHost);
router.get("/:id", authMiddleware, getBookingById);
router.put("/:id", authMiddleware, updateBooking);
router.delete("/:id", authMiddleware, deleteBooking);

module.exports = router;