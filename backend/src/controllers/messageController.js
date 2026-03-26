const Message = require("../models/messageModel");

// GET MESSAGES
const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({
      chat: chatId,
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// GET UNREAD COUNT
const getUnreadCount = async (req, res) => {
  const { userId } = req.params;
  try {
    const count = await Message.countDocuments({
      receiver: userId,
      isRead: false,
    });

    res.status(200).json({
      data: count,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// MARK AS READ
const markAsRead = async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    await Message.updateMany(
      {
        sender: senderId,
        receiver: receiverId,
        isRead: false,
      },
      { isRead: true },
    );

    res.status(200).json({ message: "Marked as read" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = { getMessages, getUnreadCount, markAsRead };
