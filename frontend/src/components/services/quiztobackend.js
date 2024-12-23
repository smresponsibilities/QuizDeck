import axios from "axios";


export  async function SaveQuizHandler(e) {
    try {
        
          

      
          const response = await axios.post("http://localhost:3000/createquiz", {
            quizname: e.quizName,
            questions: e.questions

          });
          console.log(response);
        }
    catch (error) {
        console.error(error);
    }
}