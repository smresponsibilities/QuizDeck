import { Server } from "socket.io";
import {
  handleCreateRoom,
  handleDisconnect,
  handleJoinRoom,
  handleNextQuestion,
  handleStartQuiz,
  handleSubmitAnswer,
} from "../controllers/socket.controller.js";

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

  // Handle client connections
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Socket event handlers
    socket.on("create-room", (quizData) =>
      handleCreateRoom(socket, io, quizData)
    );

    socket.on("join-room", (roomId) => handleJoinRoom(socket, io, roomId));

    socket.on("start-quiz", (roomId) => handleStartQuiz(socket, io, roomId));

    socket.on("submit-answer", (data) => handleSubmitAnswer(socket, io, data));

    socket.on("next-question", (roomId) =>
      handleNextQuestion(socket, io, roomId)
    );

    socket.on("disconnect", () => handleDisconnect(socket, io));
  });

  return io;
};
