const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const chatSocket = require("./src/sockets/chatSocket");

const PORT = process.env.PORT;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

chatSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
