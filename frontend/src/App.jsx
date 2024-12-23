import "./App.css";
import LandingPage from "./pages/landing";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { Route, Routes } from "react-router";
import QuizApp from "./pages/test";
import Quiz from "./pages/quiz";

function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/test" element={<QuizApp />} />
      <Route path="/createquiz" element={< Quiz/>} />
      
    </Routes>
  );
}

export default App;
