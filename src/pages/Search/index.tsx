import { userDataAtom } from '@/App'
import SearchGraph from '@/components/SearchGraph'
import TopHeader from '@/components/TopHeader'
import { Layout } from 'antd'
import { useAtom } from 'jotai'
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './index.less'

const Search: React.FC = () => {
    const [userData] = useAtom(userDataAtom)
    const navigate = useNavigate()
    const [params] = useSearchParams()

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
                {userData.isLoggedIn && (
                    <SearchGraph keyword={params.get('keyword') as string}></SearchGraph>
                )}
            </Layout>
        </>
    )
}

export default Search
