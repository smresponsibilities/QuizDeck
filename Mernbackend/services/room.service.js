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

  return {
    title: room.quiz.title,
    totalQuestions: room.quiz.questions.length,
  };
};

export const startQuiz = (roomId, hostId) => {
  const room = quizRooms[roomId];

  if (!room) {
    throw new Error("Room does not exist");
  }

  if (room.host !== hostId) {
    throw new Error("Only host can start the quiz");
  }

  room.isQuizStarted = true;

  return room.quiz.questions[room.currentQuestionIndex];
};

export const submitAnswer = (roomId, playerId, answerId) => {
  const room = quizRooms[roomId];

  if (!room) {
    throw new Error("Room does not exist");
  }

  const currentQuestion = room.quiz.questions[room.currentQuestionIndex];

  if (answerId === currentQuestion.correctOptionId) {
    room.scores[playerId] += 1;
  }

  return {
    playerId,
    answerId,
    isCorrect: answerId === currentQuestion.correctOptionId,
  };
};

export const nextQuestion = (roomId, hostId) => {
  const room = quizRooms[roomId];

  if (!room) {
    throw new Error("Room does not exist");
  }

  if (room.host !== hostId) {
    throw new Error("Only host can progress to next question");
  }

  room.currentQuestionIndex++;

  if (room.currentQuestionIndex < room.quiz.questions.length) {
    return room.quiz.questions[room.currentQuestionIndex];
  }

  return null; // Quiz ended
};

export const getRoomScores = (roomId) => {
  const room = quizRooms[roomId];
  return room ? room.scores : {};
};

export const getRoomByHostId = (hostId) => {
  return Object.values(quizRooms).find((room) => room.host === hostId);
};

export const removePlayerFromRoom = (roomId, playerId) => {
  const room = quizRooms[roomId];
  if (room) {
    room.players = room.players.filter((id) => id !== playerId);
    delete room.scores[playerId];
  }
};

export const deleteRoom = (roomId) => {
  delete quizRooms[roomId];
};

export const getRooms = () => quizRooms;
