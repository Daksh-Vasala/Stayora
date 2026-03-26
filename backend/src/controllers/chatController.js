const Chat = require("../models/chatModel");

const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({
      members: userId,
    })
      .populate("members", "name email")
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
  const { receiverId, property } = req.body;
  const senderId = req.user.id;

  let chat = await Chat.findOne({
    members: { $all: [senderId, receiverId] },
    property,
  });

  if (!chat) {
    chat = await Chat.create({
      members: [senderId, receiverId],
      property,
    });
  }

  res.json(chat);
};

module.exports = { getUserChats, createChat };