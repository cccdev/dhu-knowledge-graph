import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import LoginForm from './LoginForm'

const Login : React.FC = () => {
  return (
    <div className='loginOuter'>
      <LoginForm></LoginForm>
    </div>
  )
}

export default Login
