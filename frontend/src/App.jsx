import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AuthForm from './pages/AuthForm'
import { Toaster } from 'react-hot-toast'
import { authStore } from './store/authStore'
import { Loader } from 'lucide-react'
import { Navigate, Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'

function App() {
  const { isCheckingAuth, checkAuth, authUser} = authStore();
  


  useEffect(() => {

    checkAuth();

  }, [])

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    )
  }
  // console.log(authUser)
  return (
    <div >
      <Routes>
        <Route path="/" element={authUser ? <><div className='fixed top-0 w-full z-20'><Navbar/></div> <HomePage/></> : <Navigate to="/loginSignUp" />} />
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/loginSignUp" />} />
        <Route path="/loginSignUp" element={!authUser ? <AuthForm /> : <Navigate to="/" />} />
      </Routes>
      <Toaster />
    </div>
  

  )
}

export default App
