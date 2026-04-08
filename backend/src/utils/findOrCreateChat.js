const Chat = require("../models/chatModel");

const findOrCreateChat = async (user1, user2, property) => {
  try {
    // Validate inputs
    if (!user1 || !user2) {
      throw new Error("Both user1 and user2 are required");
    }

    let chat = await Chat.findOne({
      members: { $all: [user1, user2] },
      property: property || null
    })

    if(!chat) {
      chat = await Chat.create({
        members: [user1, user2],
        property
      })
    }

    return chat;
  } catch (error) {
    console.error("Error in findOrCreateChat:", error.message);
    throw error;
  }
}

module.exports = findOrCreateChat;