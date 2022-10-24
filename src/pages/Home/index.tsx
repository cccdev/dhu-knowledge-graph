import { userDataAtom } from '@/App'
import Graph from '@/components/Graph'
import MidContent from '@/components/MidContent'
import TopHeader from '@/components/TopHeader'
import { Layout } from 'antd'
import { useAtom } from 'jotai'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.less'

const Home: React.FC = () => {
    const [userData] = useAtom(userDataAtom)
    const navigate = useNavigate()
    useEffect(() => {
        if (!userData.isLoggedIn) {
            navigate('/login')
            return
        }
    }, [])
    return (
        <>
            <Layout className="layout">
                <TopHeader />
                {/* <MidContent /> */}
                {userData.isLoggedIn && <Graph></Graph>}
            </Layout>
        </>
    )
}

export default Home
