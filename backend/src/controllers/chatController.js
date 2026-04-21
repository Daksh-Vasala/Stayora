const Chat = require("../models/chatModel");

const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({
      members: userId,
    })
      .populate("members", "name role email")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createChat = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    // Search for existing chat based ONLY on the two users
    // This ensures there's only one chat between any two users, regardless of property
    let chat = await Chat.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = await Chat.create({
        members: [senderId, receiverId],
      });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserChats, createChat };
