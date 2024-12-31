import axios from "axios";

export async function SaveQuizHandler(e) {
  try {
    console.log(e);
    const response = await axios.post(
      `${import.meta.env.VITE_BASEURL}/quiz/createquiz`,
      {
        quizname: e.quizname,
        questions: e.questions,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
