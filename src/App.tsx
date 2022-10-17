/**
 * @author 陆劲涛
 * @description App
 */
import { Footer } from 'antd/lib/layout/layout'
import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

const App: React.FC = () => {
    return (
        <div className="App">
            <RouterProvider router={router} />
            <Footer style={{ textAlign: 'center' }}>
                东华大学 ©2022 Created by 专业实习小组
            </Footer>
        </div>
    )
}

export default App
