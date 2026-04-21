const Chat = require("../models/chatModel");

const findOrCreateChat = async (user1, user2) => {
  try {
    // Validate inputs
    if (!user1 || !user2) {
      throw new Error("Both user1 and user2 are required");
    }

    // Search for existing chat based ONLY on the two users
    // This ensures there's only one chat between any two users
    let chat = await Chat.findOne({
      members: { $all: [user1, user2] },
    });

    if (!chat) {
      chat = await Chat.create({
        members: [user1, user2],
      });
    }

    return chat;
  } catch (error) {
    console.error("Error in findOrCreateChat:", error.message);
    throw error;
  }
};

module.exports = findOrCreateChat;
