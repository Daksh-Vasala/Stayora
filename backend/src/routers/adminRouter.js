// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAdminStats,
  getRecentBookings,
  getPendingProperties,
  getRecentUsers,
  getRecentProperties
} = require("../controllers/adminController");
const allowRoles = require("../middlewares/allowedRoles");

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(allowRoles("admin"));

// Dashboard routes
router.get("/stats", getAdminStats);
router.get("/recent-bookings", getRecentBookings);
router.get("/pending-properties", getPendingProperties);
router.get("/recent-users", getRecentUsers);
router.get("/recent-properties", getRecentProperties);

module.exports = router;