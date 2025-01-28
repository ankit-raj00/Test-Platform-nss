import React from 'react'
import {useDispatch} from 'react-redux'
import apiService from '../Backend/auth'
import { logout } from '../Store/authslice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        apiService.logoutUser().then(() => {
            dispatch(logout())
        })
    }
  return (
    <button
    className='text-white inline-block px-6 py-2 rounded-lg font-medium transition-colors duration-300 hover:bg-blue-100 hover:text-blue-600 hover:underline'
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn