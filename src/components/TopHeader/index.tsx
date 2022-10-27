/**
 * @author 舟烬
 * @description 导航栏
 */
import { userDataAtom } from '@/App'
import homeIcon from '@/assets/favicon.svg'
import {
    LoginOutlined,
    LogoutOutlined,
    QuestionCircleOutlined,
    UserOutlined,
} from '@ant-design/icons'
import { Avatar, Dropdown, Input, Menu, MenuProps, Modal, Tag } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import { useAtom } from 'jotai'
import React, { useRef } from 'react'
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
    const navigate = useNavigate()
    const logOut = () => {
        setUserData({
            idLoggedIn: false,
            mobile: '',
        })
        localStorage.setItem(
            'userData',
            JSON.stringify({
                idLoggedIn: false,
                mobile: '',
            })
        )
        navigate('/login')
    }
    const menuItems = [
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
    ]
    if (userData.admin) {
        menuItems.unshift({
            key: '1',
            label: (
                <NavLink
                    to="/admin"
                    className={({ isActive }) => (isActive ? 'current' : '')}
                >
                    管理员
                </NavLink>
            ),
        })
    }
    const controlMenu = <Menu items={menuItems} />
    const info = () => {
        Modal.info({
            title: '说明',
            content: (
                <div style={{ marginLeft: '-30px', marginTop: '20px' }}>
                    <Tag color="#108ee9">简介</Tag>
                    <p style={{ marginTop: '10px' }} className="indent">
                        该知识图谱系统由东华大学19级计科专业实习团队研发，如您遇到任何问题，可以在
                        <a href="http://dhu.asea.fun">交流论坛</a>中进行讨论。
                    </p>
                    <p className="indent">
                        注意，该系统和论坛的账号是各自独立的。
                    </p>
                    <Tag color="#f50">使用说明</Tag>
                    <ol style={{ marginTop: '10px', marginLeft: '-10px' }}>
                        <li>
                            在任意结点点击右键，可以添加、删除结点以及查看详情。
                        </li>
                        <li>
                            增删节点需要管理员权限，可以在
                            <a href="http://dhu.asea.fun">交流论坛</a>提出申请。
                        </li>
                        <li>
                            添加节点时，可以一次性添加多个结点，用空格分开。
                        </li>
                        <li>上传文件时注意文件类型，大小不能超过50M。</li>
                        <li>点击右下角可以切换知识图谱形态。</li>
                        <li>点击左上角可以切换主题模式。</li>
                    </ol>
                </div>
            ),
        })
    }

    const inputRef = useRef()
    const toSearch = () => {
        const input = inputRef.current.input
        window.open('/search?keyword=' + input.value)
    }
    return (
        <Header className="top-header">
            <div className="left">
                <img className='mobile-hidden'
                    src={homeIcon}
                    alt="首页icon"
                    style={{
                        width: '2.5em',
                        height: '2.5em',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        navigate('/')
                    }}
                />
                <DarkToggle />
                <QuestionCircleOutlined onClick={info} />
            </div>
            <div className="right">
                <Input
                    ref={inputRef}
                    placeholder="根据节点名称搜索"
                    maxLength={20}
                    onPressEnter={toSearch}
                />
                <div className="welcome">
                    <span className='mobile-hidden' style={{ marginRight: '15px' }}>
                        {userData?.isLoggedIn
                            ? '欢迎回来，' + userData.userName
                            : '请先登录'}
                    </span>
                    <Dropdown overlay={controlMenu}>
                        <Avatar
                            size="large"
                            style={{
                                backgroundColor: 'orange',
                                verticalAlign: 'middle',
                            }}
                            icon={userData.isLoggedIn ? '' : <UserOutlined />}
                        >
                            {userData.isLoggedIn &&
                                userData.userName.substring(0, 1).toUpperCase()}
                        </Avatar>
                    </Dropdown>
                </div>
            </div>
        </Header>
    )
}

TopHeader.defaultProps = new TopHeaderProps()
export default TopHeader
