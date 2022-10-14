import React from 'react'
import { useRouteError, NavLink } from 'react-router-dom'
import './index.less'

export default function ErrorPage() {
    return (
        <div id="home">
            <h1>首页</h1>
            <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? 'current' : '')}
            >
                登录
            </NavLink>
            <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? 'current' : '')}
            >
                注册
            </NavLink>
        </div>
    )
}
