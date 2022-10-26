/* eslint-disable react/react-in-jsx-scope */
import ErrorPage from '@/pages/ErrorPage'
import Home from '@/pages/Home'
import Detail from '@/pages/Detail'
import Login from '@/pages/Login'
import Admin from '@/pages/Admin'
import Register from '@/pages/Register'
import Search from '@/pages/Search'
import React, { Suspense } from 'react'
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
    {
        path: '/detail',
        element: <Detail />,
    },
    {
        path: '/admin',
        element: <Admin />,
    },
    {
        path: '/search',
        element: <Search />,
    },
])
