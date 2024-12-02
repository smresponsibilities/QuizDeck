export default function LoginForm() {

    return (
      <>
      {/* fields -type
      name/username -string
        email -string
        password -string
        password confirmation -string
        submit -button */}

        <form className="flex flex-col gap-1 ">
            
            <label htmlFor="UserName">Username</label>
            <input type="text" id="username" name="username" />


            <label htmlFor="Password">Password</label>
            <input type="password" id="password" name="password" />


            <button type="submit">Login</button>
            <button type="submit">Forget Password</button>






            </form>

      
      </>
    )
  }
  