import { v4 as uuidv4 } from "uuid";

export const generateRoomId = () => {
  return uuidv4().slice(0, 6).toUpperCase();
};

export const validateRoomData = (quizData) => {
  if (!quizData || !quizData.quizname || !quizData.questions) {
    throw new Error("Invalid quiz data");
  }
  return true;
};
