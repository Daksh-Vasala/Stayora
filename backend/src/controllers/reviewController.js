const Review = require("../models/reviewModel");

// CREATE REVIEW
exports.createReview = async (req, res) => {
  try {

    const review = await Review.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: review
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// GET REVIEWS
exports.getReviews = async (req, res) => {
  try {

    const reviews = await Review.find()
      .populate("user")
      .populate("property");

    res.json({
      success: true,
      data: reviews
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// DELETE REVIEW
exports.deleteReview = async (req, res) => {
  try {

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Review deleted"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};