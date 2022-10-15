/**
 * @author 陆劲涛
 * @description 状态管理 zustand样例代码
 * 详细参考：
 * https://blog.openreplay.com/zustand-simple-modern-state-management-for-react
 */
import { Button } from 'antd'
import { UserContext } from 'context'
import React from 'react'
import create from 'zustand'
import { Child } from './child'

// 定义state类型
interface ZustandState {
    votes: number
    voting: string
}

const voting = 'https://api.github.com/search/users?q=john&per_page=5'

// 定义store
const useStore = create((set) => ({
    // 初始化状态
    votes: 0,
    voting: voting,

    // 更新状态
    addVotes: () => set((state: ZustandState) => ({ votes: state.votes + 1 })),
    subtractVotes: () =>
        set((state: ZustandState) => ({ votes: state.votes - 1 })),

    Votes: {},
    // 远程异步状态
    fetch: async (voting: string) => {
        const response = await fetch(voting)
        const json = await response.json()
        set({ Votes: json.items })
    },
}))

export class ZustandExampleProps {}

const ZustandExample: React.FC<ZustandExampleProps> = (props) => {
    const getVotes = useStore((state) => state.votes)
    const addVotes = useStore((state) => state.addVotes)
    const subtractVotes = useStore((state) => state.subtractVotes)
    const votes = useStore((state) => state.Votes)
    const fetch = useStore((state) => state.fetch)
    return (
        <UserContext.Provider
            value={{
                userData: {},
                setUserData: null,
            }}
        >
            <h1>共有{getVotes}人投票</h1>
            <Button onClick={addVotes}>增加票数</Button>
            <Button onClick={subtractVotes}>减少票数</Button>
            <h1>总票数为：{votes.length}张 </h1>
            <Button
                onClick={() => {
                    fetch(voting)
                }}
            >
                获取票数
            </Button>
            <Child />
        </UserContext.Provider>
    )
}

ZustandExample.defaultProps = new ZustandExampleProps()
export default ZustandExample
