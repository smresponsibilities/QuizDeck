import LoginForm from "../components/loginform";
import Card from "../components/card";

export default function Login() {
  return (
    <div className="grid h-screen grid-cols-12">
      <div className="col-span-6 flex flex-col items-center justify-center backdrop-filter backdrop-blur-sm bg-opacity-10 bg-gray-200">
        <img className="h-[500px] w-[500px]"
          src="src/assets/XA4Qwn1zDmgC4UCZBOYQTIAVAy12_images_quiz_doodle-v2_3_1733325386_generation.png"
          alt=""
        />
      </div>
      <div className="col-span-6 flex flex-col justify-center items-center">
        <Card>
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
