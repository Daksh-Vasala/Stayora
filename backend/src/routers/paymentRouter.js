const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");

const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.post("/create-order", paymentController.createOrder);

router.post("/verify-payment", paymentController.verifyPayment);

module.exports = router;