/**
 * @author 高远
 * @description 知识卡片
 */
import { CustomResponse, GraphPoint } from '@/types'
import {
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Card, Input, message, Modal } from 'antd'
import Meta from 'antd/lib/card/Meta'
import React, { useState } from 'react'
import './index.less'
import { request } from '@/utils/request'
export interface PointProps {
    data: GraphPoint[]
    getNextPointList: (pointId: string, pointName: string) => void
    currentPoint: { pointId: string, pointName: string }
    jumpTo: (pointId: string) => void
}

const Point: React.FC<PointProps> = (props) => {
    const { data, getNextPointList, currentPoint, jumpTo } = props
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        addNode();
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    let pointName = '';
    const handleChange = (e) => {
        pointName = e.target.value;
    }

    const addNode = () => {
        request<CustomResponse>({
            url: '/home/addPoint',
            method: 'post',
            params: {
                pointName,
                pointId: currentPoint.pointId
            },
        }).then((res) => {
            if (res.code === 0) {
                message.success(res.msg)
                jumpTo(currentPoint.pointId);
                getNextPointList(currentPoint.pointId, currentPoint.pointName)
            } else {
                message.error(res.msg)
            }
        })
    }
    return (
        <div className="points-container">
            <div
                className="points-card"
                style={{ display: 'flex', flexWrap: 'wrap' }}
            >
                {data.map((e) => (
                    <Card
                        onClick={() => getNextPointList(e.pointId, e.pointName)}
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
            <div className="btn-container">
                <Button type="primary" id="addNode" onClick={showModal}>添加结点</Button>
            </div>
            <Modal title="添加知识点" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>知识点名称</p>
                <Input placeholder="请输入知识点名称" onChange={handleChange} />
            </Modal>
        </div>
    )
}

export default Point
