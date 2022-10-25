import 'antd/dist/antd.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.less'
import zhCN from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ConfigProvider locale={zhCN}>
            <App></App>
        </ConfigProvider>
    </React.StrictMode>
)
