const express = require("express");
const router = express.Router();

const {
  createPayment,
  getPayments,
  updatePayment
} = require("../controllers/paymentController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createPayment);
router.get("/", authMiddleware, getPayments);
router.put("/:id", authMiddleware, updatePayment);

module.exports = router;