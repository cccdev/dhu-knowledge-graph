/**
 * @author 舟烬
 * @description
 */
const { Content } = Layout
import { GraphPoint } from '@/types'
import { request } from '@/utils/request'
import { Layout, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Point from '../Points'

export class MidContentProps {}

const MidContent: React.FC<MidContentProps> = (props) => {
    const [pointData, setPointData] = useState<GraphPoint[]>([])
    const initPoints = () => {
        request({
            url: '/home/toHome',
        }).then((res) => {
            if (res.code === 0) {
                setPointData(res.data as GraphPoint[])
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
            method: 'post',
        }).then((res) => {
            if (res.code === 0) {
                setPointData(res.data as GraphPoint[])
            } else {
                message.error(res.msg)
            }
        })
    }
    useEffect(() => {
        initPoints()
    }, [])
    return (
        <Content style={{ padding: '0 50px' }}>
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
            <div className="site-layout-content">
                <Point data={pointData} getNextPointList={getNextPointList} />
            </div>
        </Content>
    )
}

MidContent.defaultProps = new MidContentProps()
export default MidContent
