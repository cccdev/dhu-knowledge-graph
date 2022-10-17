import { request } from '@/utils/request'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { message, Card, Avatar } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './index.less'
const { Meta } = Card;

const Points: React.FC = (props) => {

  const { data, getNextPointList } = props;
  return (
    <div id="points-card">
      {
        data.map(e => (
          <Card
            key={e.pointId}
            style={{ width: 300 }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              onClick={() => getNextPointList(e.pointId)}
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={e.pointName}
              style={{ cursor: "pointer" }}
              description="This is the description"
            />
          </Card>
        ))
      }
    </div>
  )
}

export default Points
