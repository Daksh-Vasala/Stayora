const Booking = require("../models/bookingModel");
const Review = require("../models/reviewModel");
const Property = require("../models/propertyModel") 

// CREATE REVIEW
exports.createReview = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);

    if (booking.status !== "completed" && booking.paymentStatus !== "paid") {
      return res.status(400).json({
        message: "You can only review after completing your stay",
      });
    }

    if (booking.guest.toString() !== userId) {
      return res.status(403).json({
        message: "Not authorized to review this booking",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Invalid rating",
      });
    }

    const existingReview = await Review.findOne({ booking: bookingId });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this booking",
      });
    }

    const review = await Review.create({
      rating,
      comment,
      user: userId,
      booking: bookingId,
      property: booking.property,
    });

    const propertyId = review.property
    const reviews = await Review.find({ property: propertyId });

    let total = 0;

    reviews.forEach((r) => {
      total += r.rating;
    });

    const avg = reviews.length ? total / reviews.length : 0;

    await Property.findByIdAndUpdate(propertyId, {
      rating: avg,
      reviewCount: reviews.length,
    });
    
    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getReviewByBooking = async (req, res) => {
  try {
    const bookingId  = req.params.id;
    const userId = req.user.id;

    const review = await Review.findOne({
      booking: bookingId,
      user: userId,
    }).populate("user", "name email");

    res.status(200).json({
      review: review || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// UPDATE REVIEW
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    const review = await Review.findOne({
      _id: id,
      user: userId,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found or unauthorized",
      });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    // Update property average rating
    const reviews = await Review.find({ property: review.property });
    let total = 0;
    reviews.forEach((r) => (total += r.rating));
    const avg = reviews.length ? total / reviews.length : 0;

    await Property.findByIdAndUpdate(review.property, {
      rating: avg,
      reviewCount: reviews.length,
    });

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE REVIEW
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const review = await Review.findOne({
      _id: id,
      user: userId,
    });

    if (!review && userRole !== "admin") {
      return res.status(404).json({
        message: "Review not found or unauthorized",
      });
    }

    const reviewToDelete = review || await Review.findById(id);
    const propertyId = reviewToDelete.property;

    await reviewToDelete.deleteOne();

    // Update property average rating
    const reviews = await Review.find({ property: propertyId });
    let total = 0;
    reviews.forEach((r) => (total += r.rating));
    const avg = reviews.length ? total / reviews.length : 0;

    await Property.findByIdAndUpdate(propertyId, {
      rating: avg,
      reviewCount: reviews.length,
    });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// controllers/reviewController.js

// Get property reviews and ratings
exports.getPropertyReviews = async (req, res) => {
  try {
    const propertyId = req.params.id;
    
    // Get all reviews for this property
    const reviews = await Review.find({ property: propertyId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    
    // Calculate average rating
    let averageRating = 0;
    reviews.forEach(review => {
      averageRating += review.rating;
    });
    averageRating = reviews.length ? averageRating / reviews.length : 0;
    
    res.json({
      success: true,
      reviews,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: reviews.length
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};