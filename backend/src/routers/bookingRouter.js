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
router.get(
  "/getAll",
  authMiddleware,
  allowedRoles("admin"),
  bookingController.getAllBookings,
);
router.get("/:id", authMiddleware, bookingController.getBookingById);
router.put(
  "/:id",
  authMiddleware,
  allowedRoles("admin"),
  bookingController.updateBooking,
);
router.patch(
  "/:id/status",
  authMiddleware,
  allowedRoles("admin"),
  bookingController.toggleStatus,
);
router.delete("/:id", authMiddleware, bookingController.deleteBooking);

module.exports = router;
