import React from "react"
import './index.less'
export interface ContextMenuProps {
  style: { top: string, left: string, visibility: string }
  // showModal
}

const ContextMenu: React.FC<ContextMenuProps> = (props) => {
  const { style, showModal, showDeleteModal, showDetail } = props;
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
