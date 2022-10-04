/* eslint-disable react/react-in-jsx-scope */
import App from '@/App'
import ErrorPage from '@/components/ErrorPage'
import Login from '@/components/Login'
import Register from '@/components/Register'
import { createBrowserRouter } from 'react-router-dom'
export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
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
