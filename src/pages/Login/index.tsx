import { UserContext } from '@/context'
import React, { useContext, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { useNavigate } from 'react-router-dom'
import './index.less'
import LoginForm from './LoginForm'

const Login: React.FC = () => {
    const { userData } = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(()=>{
        if(userData.isLoggedIn)
            navigate('/')
    }, [])
    return (
        <div className="loginOuter">
            <LoginForm></LoginForm>
        </div>
    )
}

export default Login
