import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users, Brain, Trophy, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />


      <div className="flex-grow">

        <section className="bg-[#1368ce] text-white py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Welcome to QuizDeck</h2>
            <p className="text-xl md:text-2xl mb-8">Create, play, and learn with interactive quizzes!</p>
            <Button
              size="lg"
              className="bg-[#ffa602] text-primary hover:bg-[#ff9502]"
              onClick={() => navigate('/signup')}
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12">Why Choose QuizDeck?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Users className="h-12 w-12 text-[#e21b3c]" />}
                title="User Authentication"
                description="Securely authenticate and authorize users with JWT."
              />
              <FeatureCard
                icon={<Brain className="h-12 w-12 text-[#1368ce]" />}
                title="Create Quizzes"
                description="Easily create, edit, and delete quizzes."
              />
              <FeatureCard
                icon={<Trophy className="h-12 w-12 text-[#ffa602]" />}
                title="Leaderboard & Scoring"
                description="Track your performance and see how you rank on the leaderboard."

              />
              <FeatureCard
                icon={<Zap className="h-12 w-12 text-[#26890c]" />}
                title="Real-time Participation"
                description="Join quizzes in real-time and compete with others."

              />
            </div>
          </div>
        </section>


        <section className="bg-[#26890c] text-white py-20">
          <div className="container mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6">Ready to Start Quizzing?</h3>
            <p className="text-xl mb-8">Join thousands of learners and quiz enthusiasts on QuizDeck today!</p>
            <Button
              size="lg"
              className="bg-white text-[#26890c] hover:bg-gray-100"
              onClick={() => navigate('/login')}
            >
              Create Your First Quiz
            </Button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-center">{icon}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-xl mb-2 text-center">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
