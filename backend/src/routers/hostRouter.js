// routes/hostRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const allowedRoles = require("../middlewares/allowedRoles")
const { getHostEarnings } = require("../controllers/hostController");

router.get("/earnings", authMiddleware, allowedRoles("host"), getHostEarnings);

module.exports = router;