/**
 * @author 陆劲涛
 * @description App
 */
import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

const App: React.FC = () => {
    return (
        <div className="App">
            <RouterProvider router={router} />
        </div>
    )
}

export default App
