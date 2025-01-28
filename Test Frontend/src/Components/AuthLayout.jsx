import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function AuthLayout({children, authentication = true}) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)
    const adminstatus = useSelector(state => state.auth.adminstatus)

    useEffect(() => {
        //TODO: make it more easy to understand

        // if (authStatus ===true){
        //     navigate("/")
        // } else if (authStatus === false) {
        //     navigate("/login")
        // }
        
        //let authValue = authStatus === true ? true : false

        if(authentication && !authStatus && !adminstatus){
            navigate("/login")
        } 
        setLoader(false)
    }, [authStatus, navigate, authentication,adminstatus])

  return loader ? <h1>Loading...</h1> : <>{children}</>
}

