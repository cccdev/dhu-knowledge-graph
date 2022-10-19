import TopHeader from '@/components/TopHeader'
import { PointDetail } from '@/types'
import { request } from '@/utils/request'
import { Layout, message, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './index.less'

const Detail: React.FC = (props) => {
    const [params] = useSearchParams()
    const [pointId] = useState(params.getAll('id')[0])
    const [data, setData] = useState<PointDetail | null>(null)
    const initData = () => {
        request<PointDetail | null>({
            url: '/home/detail',
            params: {
                pointId,
            },
        }).then((res) => {
            if (res.code === 0) {
                message.success(res.msg)
                // console.log(res.data)
                setData(res.data)
            } else {
                // message.error(res.msg);
            }
        })
    }
    useEffect(() => {
        initData()
    }, [])
    return (
        <>
            <Layout className="layout">
                <TopHeader />
                {data ? (
                    <div id="detail">
                        <h1>{data.pointName}</h1>
                        {data.tag
                            .split('#')
                            .filter((e) => e !== '')
                            .map((e, index) => (
                                <Tag key={index} color="#f50">
                                    {e}
                                </Tag>
                            ))}
                        <h2>{data?.content}</h2>
                        <p>难度：{data?.degree}</p>
                        <embed src={data?.addressId} />
                    </div>
                ) : (
                    <div className="no-detail">
                        <h1>该结点没有任何信息</h1>
                    </div>
                )}
            </Layout>
        </>
    )
}

export default Detail
