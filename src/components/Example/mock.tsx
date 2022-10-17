/**
 * @author 舟烬
 * @description
 */
import { CustomResponse } from '@/types'
import { request } from '@/utils/request'
import { Button } from 'antd'
import React, { useState } from 'react'

export class MockProps {}

const Mock: React.FC<MockProps> = (props) => {
    const [data, setData] = useState<CustomResponse>()

    const getHome = () => {
        request<CustomResponse>({
            url: '/home/toHome',
            method: 'get',
        }).then((res) => {
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
