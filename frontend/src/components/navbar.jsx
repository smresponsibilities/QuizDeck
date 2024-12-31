import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">QuizDeck</h1>
        <nav>
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            variant="secondary"
            className="ml-2"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </nav>
      </div>
    </div>
  );
}
