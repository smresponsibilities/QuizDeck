import { generateRoomId, validateRoomData } from "../utils/room.utils.js";

const quizRooms = {};

export const createRoom = (hostId, quizData) => {
  validateRoomData(quizData);
  const roomId = generateRoomId();

  quizRooms[roomId] = {
    host: hostId,
    quiz: quizData,
    players: [],
    currentQuestionIndex: 0,
    scores: {},
    isQuizStarted: false,
  };

  console.log("Room created with data: ", quizRooms[roomId]);
  return roomId;
};

export const joinRoom = (roomId, playerId) => {
  const room = quizRooms[roomId];

  if (!room) {
    throw new Error("Room does not exist");
  }

  if (room.isQuizStarted) {
    throw new Error("Quiz has already started");
  }

  room.players.push(playerId);
  room.scores[playerId] = 0;

  console.log(`Player ${playerId} joined room ${roomId}`);
  return {
    quizname: room.quiz.quizname,
    totalQuestions: room.quiz.questions.length,
  };
};

export const startQuiz = (roomId, hostId) => {
  const room = quizRooms[roomId];

  if (!room) {
    throw new Error("Room does not exist");
  }

  if (room.host !== hostId) {
    throw new Error("Only the host can start the quiz");
  }

  room.isQuizStarted = true;

  return room.quiz.questions[room.currentQuestionIndex];
};

export const submitAnswer = (roomId, playerId, answerIndex) => {
  const room = quizRooms[roomId];

  if (!room) {
    throw new Error("Room does not exist");
  }

  const currentQuestion = room.quiz.questions[room.currentQuestionIndex];

  const isCorrect = currentQuestion.options[answerIndex]?.isAnswer;

  if (isCorrect) {
    room.scores[playerId] += 1;
  }

  return {
    playerId,
    answerIndex,
    isCorrect,
  };
};

export const nextQuestion = (roomId, hostId) => {
  const room = quizRooms[roomId];

  if (!room) {
    throw new Error("Room does not exist");
  }

  if (room.host !== hostId) {
    throw new Error("Only the host can progress to the next question");
  }

  room.currentQuestionIndex++;

  if (room.currentQuestionIndex < room.quiz.questions.length) {
    return room.quiz.questions[room.currentQuestionIndex];
  } else {
    // Quiz ended
    return null;
  }
};

export const getRoomScores = (roomId) => {
  const room = quizRooms[roomId];

  if (!room) {
    throw new Error("Room does not exist");
  }

  return room.scores;
};

export const removePlayerFromRoom = (roomId, playerId) => {
  const room = quizRooms[roomId];
  if (!room) return;

  room.players = room.players.filter((id) => id !== playerId);
  delete room.scores[playerId];

  console.log(`Player ${playerId} removed from room ${roomId}`);
};

export const deleteRoom = (roomId) => {
  if (quizRooms[roomId]) {
    delete quizRooms[roomId];
    console.log(`Room ${roomId} deleted`);
  } else {
    console.warn(`Attempted to delete non-existent room ${roomId}`);
  }
};

export const getRooms = () => quizRooms;
