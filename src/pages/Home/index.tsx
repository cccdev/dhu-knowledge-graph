import Mock from '@/components/Example/mock'
import Points from '@/components/Points'
import { request } from '@/utils/request'
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import './index.less'

export default function ErrorPage() {
    const [pointData, setPointData] = useState([])
    const initPoints = () => {
        request({
            url: '/home/toHome'
        }).then(res => {
            if (res.code === 0) {
                setPointData(res.data)
            } else {
                message.error(res.msg)
            }
        })
    }
    // 同点击Points组件里的卡片，调用父组件的方法，更新data
    const getNextPointList = (pointId: string) => {
        request({
            url: '/home/nextPointList',
            data: { pointId },
            method: 'post'
        }).then(res => {
            if (res.code === 0) {
                setPointData(res.data)
            } else {
                message.error(res.msg)
            }
        })
    }
    useEffect(() => {
        initPoints()
    }, [])
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
            <Points data={pointData} getNextPointList={getNextPointList} />
            <Mock />
        </div>
    )
}
