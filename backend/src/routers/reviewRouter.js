const express = require("express");
const router = express.Router();

const {
  createReview,
  getReviewByBooking,
  updateReview,
  deleteReview,
  getPropertyReviews
} = require("../controllers/reviewController");

const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware)
router.post("/:id", createReview);
router.get("/booking/:id", getReviewByBooking);
router.get("/property/:id", getPropertyReviews);

// In your review routes file
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);
module.exports = router;