// socket.controller.js

import {
  createRoom,
  deleteRoom,
  getRooms,
  joinRoom,
  removePlayerFromRoom,
  startQuiz,
  submitAnswer,
  nextQuestion,
} from "../services/room.service.js";

export const handleCreateRoom = (socket, io, quizData) => {
  try {
    const roomId = createRoom(socket.id, quizData);
    socket.join(roomId);
    console.log("Room created with ID:", roomId);
    socket.emit("room-created", roomId);
  } catch (error) {
    console.error("Error creating room:", error.message);
    socket.emit("room-error", { message: error.message });
  }
};

export const handleJoinRoom = (socket, io, roomId) => {
  try {
    const quizInfo = joinRoom(roomId, socket.id, socket);
    socket.join(roomId);

    const rooms = getRooms();
    const room = rooms[roomId];
    if (!room) return;

    // Create players info with names and count
    const playersInfo = {
      count: room.players.length,
      players: room.players, // This will be the array of playerIdentifiers (usernames or socket.ids)
    };

    // Emit to host
    const hostSocket = io.sockets.sockets.get(room.host);
    hostSocket?.emit("player-joined", {
      playerId: socket.username || socket.id,
      playerCount: room.players.length,
      players: room.players,
    });

    // Emit to all players in room
    io.to(roomId).emit("users-count", playersInfo);

    socket.emit("join-successful", { roomId, quiz: quizInfo });
  } catch (error) {
    console.error("Error joining room:", error.message);
    socket.emit("join-error", { message: error.message });
  }
};

export const handleStartQuiz = (socket, io, { roomId, question }) => {
  try {
    io.to(roomId).emit("question-changed", question);
  } catch (error) {
    console.error("Error starting quiz:", error.message);
    socket.emit("quiz-error", { message: error.message });
  }
};

export const handleSubmitAnswer = (socket, io, { roomId, answerIndex }) => {
  try {
    const result = submitAnswer(roomId, socket.id, answerIndex, socket);

    const rooms = getRooms();
    const hostSocketId = rooms[roomId]?.host;
    if (hostSocketId) {
      const hostSocket = io.sockets.sockets.get(hostSocketId);
      hostSocket?.emit("player-answered", result);
    }
    socket.emit("answer-submitted", result);
  } catch (error) {
    console.error("Error submitting answer:", error.message);
    socket.emit("answer-error", { message: error.message });
  }
};

export const handleNextQuestion = (socket, io, { roomId, question }) => {
  try {
    // Call nextQuestion to update the index and get the next question
    const nextQuestionData = nextQuestion(roomId, socket.id);

    if (nextQuestionData === null) {
      // Quiz has ended, handle end of quiz
      handleEndQuiz(socket, io, { roomId });
    } else {
      // Emit the next question to all players
      io.to(roomId).emit("question-changed", nextQuestionData);
    }
  } catch (error) {
    console.error("Error progressing to next question:", error.message);
    socket.emit("quiz-error", { message: error.message });
  }
};

export const handleEndQuiz = (socket, io, data) => {
  const { roomId } = data;
  const rooms = getRooms();
  const hostSocketId = rooms[roomId]?.host;
  //leaderboard
  const room = rooms[roomId];
  const scores = room.scores;
  const players = room.players;
  const leaderboard = players.map((playerId) => ({
    playerId,
    score: scores[playerId],
  }));
  leaderboard.sort((a, b) => b.score - a.score);
  if (hostSocketId) {
    const hostSocket = io.sockets.sockets.get(hostSocketId);
    hostSocket?.to(roomId).emit("quiz-ended");
  }
  io.to(roomId).emit("quiz-ended", leaderboard);
  deleteRoom(roomId);
};

export const handleDisconnect = (socket, io) => {
  const rooms = getRooms();
  Object.keys(rooms).forEach((roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    if (room.host === socket.id) {
      io.to(roomId).emit("host-disconnected");
      deleteRoom(roomId);
    } else if (room.players.includes(socket.id)) {
      removePlayerFromRoom(roomId, socket.id);

      const hostSocket = io.sockets.sockets.get(room.host);
      hostSocket?.emit("player-left", {
        playerId: socket.id,
        playerCount: room.players.length,
      });
    }
  });
};
