// routes/hostRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const allowedRoles = require("../middlewares/allowedRoles");
const {
  getHostEarnings,
  getPropertyEarnings,
} = require("../controllers/hostController");

router.use(authMiddleware);
router.use(allowedRoles("host"));

router.get("/earnings", getHostEarnings);
router.get("/earnings/properties", getPropertyEarnings);

module.exports = router;
