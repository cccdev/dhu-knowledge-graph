import MidContent from '@/components/MidContent'
import TopHeader from '@/components/TopHeader'
import { Layout } from 'antd'
import React from 'react'
import './index.less'
const { Footer } = Layout

const Home: React.FC = () => {
    return (
        <>
            <Layout className="layout">
                <TopHeader />
                <MidContent />
                <Footer style={{ textAlign: 'center' }}>
                    东华大学 ©2022 Created by 专业实习小组
                </Footer>
            </Layout>
        </>
    )
}

export default Home
