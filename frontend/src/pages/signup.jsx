import SignUpForm from "../components/signupform";
import Card from "../components/card";

export default function SignUp() {
  return (
    <div className="align-center flex h-screen justify-center py-20">
      <Card>
        <SignUpForm />
      </Card>
    </div>
  );
}
