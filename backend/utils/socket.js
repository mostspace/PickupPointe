const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const Message = require("../models/Message");

const users = {};

const createChatSocketServer = (server) => {
  const io = socketIO(server, {
    path: "/chat-server",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  console.log("Chat socket server is running...");
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const senderId = socket.userId;
    const senderRole = socket.userRole;

    users[senderId] = socket.id;
    console.log(`User connected: ${senderId}`);
    // Handle sending a message
    socket.on(
      "send-message",
      async ({
        receiverId,
        receiverRole,
        content,
        images: imagesData,
        files: filesData,
      }) => {
        const images = imagesData || [];
        const files = filesData || [];
        try {
          await Message.create({
            senderId,
            senderRole,
            receiverId,
            receiverRole,
            content,
            images,
            files,
          });
          const receiverSocketId = users[receiverId];

          if (receiverSocketId) {
            socket.to(receiverSocketId).emit("receive-message", {
              senderId,
              content,
              images,
              files,
            });
          }
        } catch (error) {
          console.log("Error saving message", error.message);
        }
      }
    );

    // Handle typing events
    socket.on("typing", ({ receiverId }) => {
      const receiverSocketId = users[receiverId];
      if (receiverSocketId) {
        socket.to(receiverSocketId).emit("typing", { senderId });
      }
    });

    // Handle typing stopped events
    socket.on("typing-stopped", ({ senderId, receiverId }) => {
      const receiverSocketId = users[receiverId];
      if (receiverSocketId) {
        socket.to(receiverSocketId).emit("typing-stopped", { senderId });
      }
    });

    // Handle disconnect events
    socket.on("disconnect", () => {
      // Optionally remove the user from the users object when they disconnect
      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          break;
        }
      }
      console.log("User disconnected", socket.id);
    });
  });
};

module.exports = {
  createChatSocketServer,
};
