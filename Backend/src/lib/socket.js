import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  // CRITICAL FOR RENDER: Keeps the connection from timing out
  pingInterval: 25000,
  pingTimeout: 20000,

  cors: {
    // CRITICAL FOR RENDER: Allows your live frontend to connect
    origin: ["http://localhost:5173", "https://enderxecho.onrender.com"],
    methods: ["GET", "POST"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {}; 

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // --- AGORA VIDEO CALL SIGNALING EVENTS ---
  socket.on("outgoing-call", (data) => {
    const { to, from, channelName, callerName } = data;
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incoming-call", { from, channelName, callerName });
    }
  });

  socket.on("call-accepted", (data) => {
    const { to } = data;
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-accepted");
    }
  });

  socket.on("call-rejected", (data) => {
    const { to } = data;
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-rejected");
    }
  });

  socket.on("call-ended", (data) => {
    const { to } = data;
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-ended");
    }
  });
  // --- END OF AGORA EVENTS ---

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const [key, value] of Object.entries(userSocketMap)) {
      if (value === socket.id) {
        delete userSocketMap[key];
        break;
      }
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };