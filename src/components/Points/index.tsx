/**
 * @author 高远
 * @description 知识卡片
 */
import { GraphPoint } from '@/types'
import {
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined,
} from '@ant-design/icons'
import { Avatar, Card } from 'antd'
import Meta from 'antd/lib/card/Meta'
import React from 'react'

export interface PointProps {
    data: GraphPoint[]
    getNextPointList: (pointId: string) => void
}

const Point: React.FC<PointProps> = (props) => {
    const { data, getNextPointList } = props
    return (
        <div
            className="points-card"
            style={{ display: 'flex', flexWrap: 'wrap' }}
        >
            {data.map((e) => (
                <Card
                    key={e.pointId}
                    style={{ width: 300, marginLeft: '15px' }}
                    cover={
                        <img
                            alt="example"
                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        />
                    }
                    actions={[
                        <SettingOutlined key="setting" />,
                        <EditOutlined key="edit" />,
                        <EllipsisOutlined key="ellipsis" />,
                    ]}
                >
                    <Meta
                        // onClick={() => getNextPointList(e.pointId)}
                        avatar={
                            <Avatar src="https://joeschmoe.io/api/v1/random" />
                        }
                        title={e.pointName}
                        style={{ cursor: 'pointer' }}
                        description="This is the description"
                    />
                </Card>
            ))}
        </div>
    )
}

export default Point
