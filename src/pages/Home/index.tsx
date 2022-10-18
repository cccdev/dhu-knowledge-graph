import Graph from '@/components/Graph'
import MidContent from '@/components/MidContent'
import TopHeader from '@/components/TopHeader'
import { Layout } from 'antd'
import React from 'react'
import './index.less'

const Home: React.FC = () => {
    return (
        <>
            <Layout className="layout">
                <TopHeader />
                {/* <MidContent /> */}
                <Graph></Graph>
            </Layout>
        </>
    )
}

export default Home
