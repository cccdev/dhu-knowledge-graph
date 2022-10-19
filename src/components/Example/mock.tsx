/**
 * @author 舟烬
 * @description
 */
import { IResponse } from '@/types'
import { request } from '@/utils/request'
import { Button } from 'antd'
import React, { useState } from 'react'

export class MockProps {}

const Mock: React.FC<MockProps> = (props) => {
    const [data, setData] = useState<IResponse>()

    const getHome = () => {
        request<IResponse>({
            url: '/home/toHome',
            method: 'get',
        }).then((res) => {
            console.log('🚀 ~ file: mock.tsx ~ line 20 ~ getHome ~ res', res)
            setData(res)
        })
    }

    return (
        <>
            <Button onClick={getHome}>测试</Button>
            <div>{JSON.stringify(data)}</div>
        </>
    )
}

Mock.defaultProps = new MockProps()
export default Mock
