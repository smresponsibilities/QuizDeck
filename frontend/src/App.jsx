import "./App.css";
import LandingPage from "./pages/landing";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import { Route, Routes } from "react-router";
import QuizApp from "./pages/test";
import Quiz from "./pages/quiz";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" index element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/quiz" element={<QuizApp />} />
      <Route
        path="/createquiz"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
