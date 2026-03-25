const express = require("express");
const router = express.Router();

const {
  getMessages,
  getUnreadCount,
  markAsRead,
} = require("../controllers/messageController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/:senderId/:receiverId", authMiddleware, getMessages);
router.get("/unread/:userId", authMiddleware, getUnreadCount);
router.post("/mark-read", authMiddleware, markAsRead);

module.exports = router;
