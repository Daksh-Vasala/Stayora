// routes/hostRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const allowedRoles = require("../middlewares/allowedRoles");
const {
  getHostEarnings,
  getPropertyEarnings,
  getDashboardStats,
  getHostBookings,
  getTopProperties
} = require("../controllers/hostController");

router.use(authMiddleware);
router.use(allowedRoles("host"));

router.get("/earnings", getHostEarnings);
router.get("/earnings/properties", getPropertyEarnings);
router.get("/dashboard/stats", getDashboardStats);
router.get("/bookings", getHostBookings);
router.get("/properties/top", getTopProperties);

module.exports = router;
