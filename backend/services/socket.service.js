import { Server } from "socket.io";
import {
  handleCreateRoom,
  handleDisconnect,
  handleEndQuiz,
  handleJoinRoom,
  handleNextQuestion,
  handleStartQuiz,
  handleSubmitAnswer,
} from "../controllers/socket.controller.js";
import jwt from "jsonwebtoken";

/**
 * Initializes the socket.io service
 * @param {import('http').Server} server - The HTTP server instance
 * @returns {Server} Initialized Socket.IO server
 */
export const initSocketService = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2000,
      skipMiddlewares: true,
    },
  });

  // Add middleware to extract username from token
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.username = decoded.username; // Store username in socket
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
    next();
  });

  // Handle client connections
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.username || socket.id);

    // Socket event handlers
    socket.on("create-room", (quizData) =>
      handleCreateRoom(socket, io, quizData)
    );

    socket.on("join-room", (roomId) => handleJoinRoom(socket, io, roomId));

    socket.on("start-quiz", (data) => handleStartQuiz(socket, io, data));

    socket.on("submit-answer", (data) => handleSubmitAnswer(socket, io, data));

    socket.on("next-question", (data) => handleNextQuestion(socket, io, data));

    socket.on("end-quiz", (data) => {
      handleEndQuiz(socket, io, data);
    });

    socket.on("disconnect", () => handleDisconnect(socket, io));
  });

  return io;
};
