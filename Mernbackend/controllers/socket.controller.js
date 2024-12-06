import {
  createRoom,
  deleteRoom,
  getRooms,
  joinRoom,
  removePlayerFromRoom,
  startQuiz,
  submitAnswer,
} from "../services/room.service.js";

export const handleCreateRoom = (socket, io, quizData) => {
  try {
    const roomId = createRoom(socket.id, quizData);
    socket.join(roomId);
    socket.emit("room-created", roomId);
  } catch (error) {
    socket.emit("room-error", error.message);
  }
};

export const handleJoinRoom = (socket, io, roomId) => {
  try {
    const quizInfo = joinRoom(roomId, socket.id);
    socket.join(roomId);

    // Notify host about new player
    const rooms = getRooms();
    const hostSocketId = rooms[roomId].host;

    const hostSocket = Array.from(io.sockets.sockets.values()).find(
      (s) => s.id === hostSocketId
    );

    if (hostSocket) {
      hostSocket.emit("player-joined", {
        playerId: socket.id,
        playerCount: rooms[roomId].players.length,
      });
    }

    socket.emit("join-successful", { roomId, quiz: quizInfo });
  } catch (error) {
    socket.emit("join-error", error.message);
  }
};

export const handleStartQuiz = (socket, io, roomId) => {
  try {
    const firstQuestion = startQuiz(roomId, socket.id);

    io.to(roomId).emit("next-question", {
      questionText: firstQuestion.text,
      options: firstQuestion.options,
      timeLimit: firstQuestion.timeLimit || 30,
    });
  } catch (error) {
    socket.emit("quiz-error", error.message);
  }
};

export const handleSubmitAnswer = (socket, io, { roomId, answerId }) => {
  try {
    const answerResult = submitAnswer(roomId, socket.id, answerId);

    const rooms = getRooms();
    const hostSocketId = rooms[roomId].host;

    const hostSocket = Array.from(io.sockets.sockets.values()).find(
      (s) => s.id === hostSocketId
    );

    if (hostSocket) {
      hostSocket.emit("player-answered", answerResult);
    }
  } catch (error) {
    socket.emit("answer-error", error.message);
  }
};

export const handleNextQuestion = (socket, io, roomId) => {
  try {
    const nextQuestion = nextQuestion(roomId, socket.id);

    if (nextQuestion) {
      io.to(roomId).emit("next-question", {
        questionText: nextQuestion.text,
        options: nextQuestion.options,
        timeLimit: nextQuestion.timeLimit || 30,
      });
    } else {
      // Quiz ended, send final scores
      const finalScores = getRoomScores(roomId);
      io.to(roomId).emit("quiz-ended", finalScores);
    }
  } catch (error) {
    socket.emit("quiz-error", error.message);
  }
};

export const handleDisconnect = (socket, io) => {
  // Find and handle rooms where this socket was involved
  const rooms = getRooms();

  Object.keys(rooms).forEach((roomId) => {
    const room = rooms[roomId];

    if (room.host === socket.id) {
      // If host disconnects, end the room
      io.to(roomId).emit("host-disconnected");
      deleteRoom(roomId);
    } else {
      // Remove player from room
      removePlayerFromRoom(roomId, socket.id);

      const hostSocket = Array.from(io.sockets.sockets.values()).find(
        (s) => s.id === room.host
      );

      if (hostSocket) {
        hostSocket.emit("player-left", {
          playerId: socket.id,
          playerCount: room.players.length,
        });
      }
    }
  });
};
