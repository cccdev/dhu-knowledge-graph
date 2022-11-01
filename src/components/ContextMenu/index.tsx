import { userDataAtom } from '@/App'
import { message } from 'antd'
import { useAtom } from 'jotai'
import React from 'react'
import { contextMenuStyleAtom } from '../Graph'
import './index.less'

export interface ContextMenuProps {
    showModal: () => void
    showDeleteModal: () => void
    showDetail: () => void
}

const ContextMenu: React.FC<ContextMenuProps> = (props) => {
    const { showModal, showDeleteModal, showDetail } = props
    const [userData] = useAtom(userDataAtom)
    const [style] = useAtom(contextMenuStyleAtom)
    const needAdmin = () => {
        message.warning('权限不足，若已申请权限，请重新登陆')
    }
    return (
        <div style={style} id="context-menu">
            <ul>
                <li onClick={userData.admin ? showModal : needAdmin}>增加节点</li>
                <li onClick={userData.admin ? showDeleteModal : needAdmin}>删除节点</li>
                <li onClick={showDetail}>查看详情</li>
            </ul>
        </div>
    )
}
export default ContextMenu
