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
    const [style] = useAtom(contextMenuStyleAtom)
    return (
        <div style={style} id="context-menu">
            <ul>
                <li onClick={showModal}>增加节点</li>
                <li onClick={showDeleteModal}>删除节点</li>
                <li onClick={showDetail}>查看详情</li>
            </ul>
        </div>
    )
}
export default ContextMenu
