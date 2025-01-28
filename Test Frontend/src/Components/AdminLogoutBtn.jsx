import React from 'react'
import {useDispatch} from 'react-redux'
import adminService from '../Backend/adminAuth'
import {adminLogout as logout } from '../Store/authslice'

function AdminLogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        adminService.logoutAdmin().then(() => {
            dispatch(logout())
        })
    }
  return (
    <button
    className='text-white inline-block px-6 py-2 rounded-lg font-medium transition-colors duration-300 hover:bg-blue-100 hover:text-blue-600 hover:underline'
    onClick={logoutHandler}
    >Admin Logout</button>
  )
}

export default AdminLogoutBtn