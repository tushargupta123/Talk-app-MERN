const express = require("express");
const connect = require("./config/db");
const app = express();
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cors = require("cors");
const path = require("path");
const http = require("http"); // Import http module for socket.io

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(express.static(path.join(__dirname, "/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

const server = http.createServer(app); // Create a server using http module
const io = require("socket.io")(server, {
  cors: {
    origin: "https://lets-chat-sage.vercel.app",
  },
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  console.log("connected to server.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) {
      return;
    }
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("disconnect", () => {
    console.log("disconnected from server.io");
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  connect();
});
