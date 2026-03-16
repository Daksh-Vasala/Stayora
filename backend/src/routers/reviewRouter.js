const express = require("express");
const router = express.Router();

const {
  createReview,
  getReviews,
  deleteReview
} = require("../controllers/reviewController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createReview);
router.get("/", getReviews);
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;