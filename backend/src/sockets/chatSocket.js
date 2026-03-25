const messageSchema = require("../models/messageModel");

const chatSocket = (io) => {
  const users = {};
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // Register user
    socket.on("register", (userId) => {
      users[userId] = socket.id;
      console.log("User: ", users);
    });

    socket.on("sendMessage", async ({ sender, receiver, message }) => {
      try {
        console.log("📩", sender, "→", receiver, ":", message);

        const newMessage = await messageSchema.create({
          sender,
          receiver,
          message,
        });

        const receiverSocketId = users[receiver];

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", newMessage);

          socket.emit("receiveMessage", newMessage);
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);

      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          break;
        }
      }
    });
  });
};

module.exports = chatSocket;
