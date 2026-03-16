const Payment = require("../models/paymentModel");

// CREATE PAYMENT
exports.createPayment = async (req, res) => {
  try {

    const payment = await Payment.create(req.body);

    res.status(201).json({
      success: true,
      data: payment
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// GET PAYMENTS
exports.getPayments = async (req, res) => {
  try {

    const payments = await Payment.find()
      .populate("booking");

    res.json({
      success: true,
      data: payments
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// UPDATE PAYMENT
exports.updatePayment = async (req, res) => {
  try {

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      data: payment
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};