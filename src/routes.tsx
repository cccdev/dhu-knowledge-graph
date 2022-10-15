/* eslint-disable react/react-in-jsx-scope */
import ErrorPage from '@/pages/ErrorPage'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
])
