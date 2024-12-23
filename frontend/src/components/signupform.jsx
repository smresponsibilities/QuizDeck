import axios from "axios";

export default function SignUpForm() {
  const signupHandler = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await axios.post("http://localhost:8080/user/signup", {
      username,
      email,
      password,
    });
    console.log(response);
  };

  return (
    <>
      {/* fields -type
      name/username -string
        email -string
        password -string
        password confirmation -string
        submit -button */}

      <form
        className="flex flex-col content-around gap-1 bg-none"
        onSubmit={signupHandler}
      >
        <label htmlFor="UserName">Username</label>
        <input type="text" id="username" name="username" />

        <label htmlFor="Email">Email</label>
        <input type="email" id="email" name="email" />

        <label htmlFor="Password">Password</label>
        <input type="password" id="password" name="password" />

        <button type="submit" className="my-5 border-2 border-rose-500">
          Signup
        </button>
      </form>
    </>
  );
}
