
import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Add from './pages/Add'
import Sidebar from './components/Sidebar'
import Orders from './pages/Orders'
import List from './pages/List'
import { useEffect, useState } from 'react'
import Login from './components/Login'
export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = "$";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
  
  useEffect(() => {
     localStorage.setItem('token' , token)
  } , [token])
  return (
    <div className='bg-gray-50 min-h-screen '>
      {token === '' ? <Login setToken={setToken} /> :
        <>
          <Navbar setToken={setToken} />
          <hr className='border-gray-200' />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-800 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token}  />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>




          <Toaster
            position="top-center"
            reverseOrder={false}
          />
        </>
      }
    </div>
  )
}

export default App
