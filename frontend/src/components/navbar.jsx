import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <div className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">QuizDeck</h1>
        <nav>
          <Button variant="ghost">Login</Button>
          <Button variant="secondary" className="ml-2">Sign Up</Button>
        </nav>
      </div>
    </div>
  );
}
