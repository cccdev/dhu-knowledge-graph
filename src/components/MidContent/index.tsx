/**
 * @author 舟烬
 * @description
 */
const { Content } = Layout
import { GraphPoint } from '@/types'
import { request } from '@/utils/request'
import { Breadcrumb, Layout, message } from 'antd'
import { atom, useAtom } from 'jotai'
import React, { useEffect } from 'react'
import Point from '../Points'
import './index.less'

export class MidContentProps {}

const pointDataAtom = atom<GraphPoint[]>([])
const routesAtom = atom([{ pointId: 'index', pointName: '首页' }])

const MidContent: React.FC<MidContentProps> = (props) => {
    const [pointData, setPointData] = useAtom(pointDataAtom)
    const [routes, setRoutes] = useAtom(routesAtom)

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
    const getDetail = (pointId: string) => {
        request({
            url: '/home/detail',
            method: 'post',
            data: { pointId },
        }).then((res) => {
            if (res.code === 0) {
                setPointData(res.data as GraphPoint[])
            } else {
                message.error(res.msg)
            }
        })
    }
    // 同点击Points组件里的卡片，调用父组件的方法，更新data
    const getNextPointList = (pointId: string, pointName: string) => {
        request({
            url: '/home/nextPointList',
            data: { pointId },
            method: 'post',
        }).then((res) => {
            if (res.code === 0) {
                setRoutes([...routes, { pointId, pointName }])
                setPointData(res.data as GraphPoint[])
            } else {
                message.error(res.msg)
            }
        })
    }
    const jumpTo = (pointId: string) => {
        let temp = ''
        while (routes.length && temp != pointId)
            temp = routes.pop()?.pointId as string
        if (temp === 'index')
            routes.push({ pointId: 'index', pointName: '首页' })
        setRoutes(routes)
    }
    useEffect(() => {
        initPoints()
    }, [])
    return (
        <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ marginBottom: '15px' }}>
                {routes.map((e) => (
                    <React.Fragment key={e.pointId}>
                        <Breadcrumb.Item
                            className="bread-crumb-item"
                            onClick={() => {
                                jumpTo(e.pointId)
                                e.pointId === 'index'
                                    ? initPoints()
                                    : getNextPointList(e.pointId, e.pointName)
                            }}
                        >
                            {e.pointName}
                        </Breadcrumb.Item>
                    </React.Fragment>
                ))}
            </Breadcrumb>
            <div className="site-layout-content">
                <Point
                    data={pointData}
                    getNextPointList={getNextPointList}
                    currentPoint={routes[routes.length - 1]}
                    jumpTo={jumpTo}
                />
            </div>
        </Content>
    )
}

MidContent.defaultProps = new MidContentProps()
export default MidContent
