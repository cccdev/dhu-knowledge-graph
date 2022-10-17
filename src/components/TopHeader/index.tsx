/**
 * @author 舟烬
 * @description 导航栏
 */
import {
    DownOutlined,
    LoginOutlined,
    LogoutOutlined,
    UserOutlined,
} from '@ant-design/icons'
import { Avatar, Dropdown, Menu, MenuProps } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import React from 'react'
import './index.less'

export class TopHeaderProps {}
const items: MenuProps['items'] = [
    {
        label: '登录',
        key: 'login',
        icon: <LoginOutlined />,
    },
    {
        label: '注册',
        key: 'register',
        icon: <LogoutOutlined />,
    },
]

const TopHeader: React.FC<TopHeaderProps> = (props) => {
    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.antgroup.com"
                        >
                            超级管理员
                        </a>
                    ),
                },
                {
                    key: '2',
                    label: (
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.aliyun.com"
                        >
                            退出
                        </a>
                    ),
                    danger: true,
                },
            ]}
        />
    )
    return (
        <Header className="top-header">
            <div className="logo" />
            {/* <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                // items={items}
            /> */}
            <div className="welcome">
                <span>欢迎admin回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />}>
                        <DownOutlined />
                    </Avatar>
                </Dropdown>
            </div>
        </Header>
    )
}

TopHeader.defaultProps = new TopHeaderProps()
export default TopHeader
