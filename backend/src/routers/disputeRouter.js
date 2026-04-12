// routes/hostRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const allowedRoles = require("../middlewares/allowedRoles");
const { createDispute, getDisputeByBooking } = require("../controllers/disputeController");

router.use(authMiddleware);
router.use(allowedRoles("guest", "host"));

router.post("/:id", createDispute);
router.get("/booking/:id", getDisputeByBooking);

module.exports = router;
