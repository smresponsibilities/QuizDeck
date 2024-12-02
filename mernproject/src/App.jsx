
import './App.css'
import LandingPage from './pages/landing'
import SignUp from './pages/signup'
import Login from './pages/login'
import Navbar from './components/navbar'
import Footer from './components/footer'

function App() {

  return (

    <div className='flex flex-col  gap-10'>
      <Navbar/>

      {/* <LandingPage /> */}
      <Login />

      <Footer />
    
    </div>

  )
}

export default App
