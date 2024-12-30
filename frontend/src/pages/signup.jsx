import SignUpForm from "../components/signupform";

export default function SignUp() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF3355] rounded-full opacity-50 blur-xl"></div>
      <div className="absolute top-1/2 -left-32 w-96 h-96 bg-[#FFD700] rounded-full opacity-40 blur-xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#00CC8F] rounded-full opacity-40 blur-xl"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us to start creating quizzes!</p>
        </div>
        
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
