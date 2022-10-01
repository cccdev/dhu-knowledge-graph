import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import RegisterForm from './RegisterForm'

const Register : React.FC = () => {
  return (
    <div className='registerOuter'>
      <RegisterForm></RegisterForm>
    </div>
  )
}

export default Register
