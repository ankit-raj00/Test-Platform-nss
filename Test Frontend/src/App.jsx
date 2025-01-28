import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import apiService from './Backend/auth'
import { adminlogin, adminLogout, login , logout } from './Store/authslice'
import Footer from './Components/Footer'
import Header from './Components/Header'
import { Outlet } from 'react-router-dom'
import adminService from './Backend/adminAuth'


function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const admindetail  = useSelector((state)=>state.auth.adminData)

  useEffect(() => {
    apiService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        
        dispatch(login({userData}))
      } else {
        dispatch(logout())
      }
    })

    adminService.getCurrentAdmin()
    .then((adminData) => {
      if (adminData) {
        
        console.log(1 , adminData)
        dispatch(adminlogin({adminData}))
      } else {
        dispatch(adminLogout())
      }
    })
    setLoading(false)
  }, [])

 
  
  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>
        <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : null
}

export default App
