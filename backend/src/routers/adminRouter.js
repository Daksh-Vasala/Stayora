// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAdminStats,
  getRecentBookings,
  getPendingProperties,
  getRecentUsers,
  getRecentProperties,
  getAllPropertiesForAdmin,
  getAllUsers,
  approveProperty,
  rejectProperty,
  updateBooking,
  toggleStatus,
  getAllBookings,
} = require("../controllers/adminController");
const allowRoles = require("../middlewares/allowedRoles");

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(allowRoles("admin"));

// Dashboard routes
router.get("/getUsers", getAllUsers);
router.get("/getProperties", getAllPropertiesForAdmin);
router.patch("/:id/approve", approveProperty);
router.patch("/:id/reject", rejectProperty);
router.put("/booking/:id", updateBooking);
router.patch("/booking/:id/status", toggleStatus);
router.get("/getAllBookings", getAllBookings);
router.get("/stats", getAdminStats);
router.get("/recent-bookings", getRecentBookings);
router.get("/pending-properties", getPendingProperties);
router.get("/recent-users", getRecentUsers);
router.get("/recent-properties", getRecentProperties);

module.exports = router;
