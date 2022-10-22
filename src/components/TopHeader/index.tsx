/**
 * @author 舟烬
 * @description 导航栏
 */
import { userDataAtom } from '@/App'
import {
    DownOutlined,
    LoginOutlined,
    LogoutOutlined,
    UserOutlined,
} from '@ant-design/icons'
import { Avatar, Dropdown, Menu, MenuProps } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import { useAtom } from 'jotai'
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import DarkToggle from '../DarkToggle'
import './index.less'

export class TopHeaderProps { }
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
    const [userData, setUserData] = useAtom(userDataAtom)
    const navigate = useNavigate();
    const logOut = () => {
        setUserData({
            idLoggedIn: false,
            mobile: ''
        })
        localStorage.setItem('userData', JSON.stringify({
            idLoggedIn: false,
            mobile: ''
        }))
        navigate('/login')
    }
    const controlMenu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                isActive ? 'current' : ''
                            }
                        >
                            管理员
                        </NavLink>
                    ),
                },
                !userData.isLoggedIn
                    ? {
                        key: '2',
                        label: (
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    isActive ? 'current' : ''
                                }
                            >
                                登录
                            </NavLink>
                        ),
                    }
                    : {
                        key: '4',
                        label: (
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={logOut}
                            >
                                退出
                            </a>
                        ),
                        danger: true,
                        theme: 'light',
                    },
            ]}
        />
    )

    return (
        <Header className="top-header">
            <DarkToggle />
            <div className="welcome">
                <span style={{ marginRight: '15px' }}>
                    {
                        userData?.isLoggedIn
                            ? '欢迎回来，' + userData.userName
                            : '请先登录'
                    }
                </span>
                <Dropdown overlay={controlMenu}>
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
