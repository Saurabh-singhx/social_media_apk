import { useEffect, useState } from 'react'
import './App.css'
import AuthForm from './pages/AuthForm'
import { Toaster } from 'react-hot-toast'
import { authStore } from './store/authStore'
import { Navigate, Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import { HashLoader } from "react-spinners";
import PostView from './pages/PostView'
import Notifications from './pages/Notifications'

function App() {
  const [showMyPosts, setShowMyPosts] = useState(false); // Toggle state
  const { isCheckingAuth, checkAuth, authUser, socket } = authStore();
  
  useEffect(() => {

    checkAuth();

  }, [])


  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <HashLoader color={"#f8e513"} size={40} />
      </div>
    )
  }
  

  return (
    <div >
      <Routes>
        <Route path="/" element={authUser ? <><div className='fixed top-0 w-full z-20'><Navbar showMyPosts={showMyPosts} setShowMyPosts={setShowMyPosts} /></div> <HomePage showMyPosts={showMyPosts} /></> : <Navigate to="/loginSignUp" />} />
        <Route path="/loginSignUp" element={!authUser ? <AuthForm /> : <Navigate to="/" />} />
        <Route path="/post/:id" element={authUser ? <PostView /> : <Navigate to="/loginSignUp" />} />
        <Route path="/notifications" element={authUser ? <><Navbar /> <Notifications /></> : "/loginSignUp"} />
      </Routes>


      <Toaster />
    </div>


  )
}

export default App
