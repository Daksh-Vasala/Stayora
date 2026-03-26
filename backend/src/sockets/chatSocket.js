const Message = require("../models/messageModel");
const findOrCreateChat = require("../utils/findOrCreateChat");
const Chat = require("../models/chatModel");

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // Register user
    socket.on("register", (userId) => {
      socket.join(userId)
    });

    socket.on("sendMessage", async ({ sender, receiver, message, property }) => {
      try {
        console.log("📩", sender, "→", receiver, ":", message);
        const chat = await findOrCreateChat(sender, receiver, property);

        const newMessage = await Message.create({
          chat: chat._id,
          sender,
          receiver,
          message,
          property
        });

        await Chat.findByIdAndUpdate(chat._id, {
          lastMessage: newMessage._id,
          updatedAt: new Date(),
        });

        io.to(receiver).emit("receiveMessage", newMessage);
        io.to(sender).emit("receiveMessage", newMessage);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

module.exports = chatSocket;
