import Quiz from "../models/quiz.model.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createQuizHandler = async (req, res) => {
  try {
    // console.log(req.body);
    const quiz = req.body.questions;
    const title = req.body.quizname;
    const user = req.user;
    // console.log(quiz);
    // console.log(title);
    // console.log(user);

    const savedQuiz = await Quiz.create({
      quizname: title,
      questions: quiz,
      creator: user._id,
    });

    await User.updateOne(
      { _id: user._id },
      { $push: { quizzes: savedQuiz._id } }
    );

    res.status(200).json({
      message: "Quiz saved successfully",
      success: true,
      quiz: savedQuiz,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error saving quiz",
      success: false,
      error: err,
    });
  }
};

export const getQuizHandler = async (req, res) => {
  try {
    const user = req.user;
    const quizzes = await Quiz.find({ creator: user._id });
    res
      .status(200)
      .json(new ApiResponse(200, quizzes, "Quizzes fetched successfully"));
  } catch (err) {
    res.status(500).json({
      message: "Error fetching quizzes",
      success: false,
      error: err,
    });
  }
};
