import axios from "axios"

export default function SignUpForm() {

    const signupHandler = async (e) => {
        e.preventDefault()
        const username = e.target.username.value
        const password = e.target.password.value

        const response= await axios.post("http://localhost:8080/signup", {username, password});
        console.log(response);
    }

    return (
      <>
      {/* fields -type
      name/username -string
        email -string
        password -string
        password confirmation -string
        submit -button */}

        <form className="flex flex-col content-around" onSubmit={signupHandler}>
            
            <label htmlFor="UserName">UserName</label>
            <input type="text" id="username" name="username" />


            <label htmlFor="Password">Password</label>
            <input type="password" id="password" name="password" />


            <button type="submit" className="border-2 border-rose-500">Submit</button>






            </form>

      
      </>
    )
  }
  