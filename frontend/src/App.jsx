import { useEffect, useState } from 'react'
import './App.css'
import AuthForm from './pages/AuthForm'
import { Toaster } from 'react-hot-toast'
import { authStore } from './store/authStore'
import { Loader } from 'lucide-react'
import { Navigate, Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import { HashLoader } from "react-spinners";
import UsersList from './components/UsersList'
import AddUsersCard from './components/addUsersCard'

function App() {
  const [showMyPosts, setShowMyPosts] = useState(false); // Toggle state
  const { isCheckingAuth, checkAuth, authUser } = authStore();



  useEffect(() => {

    checkAuth();

  }, [])

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* <Loader className="w-10 h-10 animate-spin text-yellow-500" /> */}
        <HashLoader color={"#f8e513"} size={40} />
      </div>
    )
  }

  
  
  return (
    <div >
      <Routes>
        <Route path="/" element={authUser ? <><div className='fixed top-0 w-full z-20'><Navbar showMyPosts={showMyPosts} setShowMyPosts={setShowMyPosts} /></div> <HomePage showMyPosts={showMyPosts} /></> : <Navigate to="/loginSignUp" />} />
        <Route path="/loginSignUp" element={!authUser ? <AuthForm /> : <Navigate to="/" />} />
      </Routes>
      
      <Toaster />
    </div>


  )
}

export default App
