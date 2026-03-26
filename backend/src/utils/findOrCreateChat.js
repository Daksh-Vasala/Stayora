const Chat = require("../models/chatModel");

const findOrCreateChat = async (user1, user2, property) => {
  try { 
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
    console.log(error);
  }
}

module.exports = findOrCreateChat;