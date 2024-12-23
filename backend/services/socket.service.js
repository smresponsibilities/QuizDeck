import { Server } from "socket.io";
import {
  handleCreateRoom,
  handleDisconnect,
  handleJoinRoom,
  handleNextQuestion,
  handleStartQuiz,
  handleSubmitAnswer,
} from "../controllers/socket.controller.js";

export const initSocketService = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2000,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    // Create Room Event
    socket.on("create-room", (quizData) =>
      handleCreateRoom(socket, io, quizData)
    );

    // Join Room Event
    socket.on("join-room", (roomId) => handleJoinRoom(socket, io, roomId));

    // Start Quiz Event
    socket.on("start-quiz", (roomId) => handleStartQuiz(socket, io, roomId));

    // Submit Answer Event
    socket.on("submit-answer", (data) => handleSubmitAnswer(socket, io, data));

    // Next Question Event
    socket.on("next-question", (roomId) =>
      handleNextQuestion(socket, io, roomId)
    );

    // Disconnect handling
    socket.on("disconnect", () => handleDisconnect(socket, io));
  });

  return io;
};
