import { userDataAtom } from '@/App'
import TopHeader from '@/components/TopHeader'
import { request } from '@/utils/request'
import { Layout, message, Modal, Space, Switch, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.less'

interface Admin {
    key: string
    userName: string
    id: string
    admin: number
}
type User = Omit<Admin, 'key'>

export default function ErrorPage() {
    const [userList, setUserList] = useState<Admin[]>([])
    const [userData] = useAtom(userDataAtom)
    const [tempUser, setTempUser] = useState({
        userName: '',
        id: '',
        admin: 0,
    })
    const navigate = useNavigate()

    const setAdmin = (user: User) => {
        request({
            url: '/home/addAdmin',
            method: 'post',
            data: {
                mobile: user.id,
                admin: user.admin ? '0' : '1',
            },
        }).then((res) => {
            if (res.code === 0) {
                message.success(res.msg)
                getAllUser()
            } else {
                message.error(res.msg)
            }
        })
    }
    const deleteUser = (user: User) => {
        request({
            url: '/user/deleteUser',
            method: 'post',
            data: {
                mobile: user.id,
            },
            params: {
                mobile: user.id,
            },
        }).then((res) => {
            if (res.code === 0) {
                message.success(res.msg)
                getAllUser()
            } else {
                message.error(res.msg)
            }
        })
    }
    const getAllUser = () => {
        request<Admin[]>({
            url: '/user/getAllUser',
        }).then((res) => {
            if (res.code === 0) {
                res.data.forEach((e: any) => (e.key = e.id))
                setUserList(res.data)
            } else {
                message.error(res.msg)
            }
        })
    }

    const columns: ColumnsType<Admin> = [
        {
            title: '?????????',
            dataIndex: 'userName',
            key: 'userName',
            render: (text) => <a>{text}</a>,
            align: 'center',
        },
        {
            title: '?????????',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
        },
        {
            title: '??????',
            key: 'admin',
            dataIndex: 'admin',
            align: 'center',
            render: (_, { admin }) => (
                <Tag color={admin ? 'red' : 'green'}>
                    {admin ? '?????????' : '??????'}
                </Tag>
            ),
        },
        {
            title: '????????????',
            key: 'admin',
            dataIndex: 'admin',
            align: 'center',
            render: (_, user) => (
                <Switch
                    checked={user.admin === 1}
                    onChange={() => {
                        setTempUser(user)
                        showModal()
                    }}
                />
            ),
        },
        {
            title: '??????',
            key: 'delete',
            align: 'center',
            render: (_, user) => (
                <Space size="middle">
                    <a
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            setTempUser(user)
                            showDeleteModal()
                        }}
                    >
                        ??????
                    </a>
                </Space>
            ),
        },
    ]
    // modal??????
    const [isModalOpen, setIsModalOpen] = useState(false)
    const showModal = () => {
        setIsModalOpen(true)
    }
    const handleOk = () => {
        setAdmin(tempUser)
        setIsModalOpen(false)
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const showDeleteModal = () => {
        setIsDeleteModalOpen(true)
    }
    const handleDeleteOk = () => {
        deleteUser(tempUser)
        setIsDeleteModalOpen(false)
    }
    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false)
    }

    useEffect(() => {
        if (!userData.isLoggedIn) {
            navigate('/login')
            return
        }
        getAllUser()
    }, [])
    return (
        <Layout className="layout">
            <TopHeader />
            <Table
                style={{ padding: '10px' }}
                columns={columns}
                dataSource={userList}
            />
            <Modal
                title={'????????????'}
                open={isDeleteModalOpen}
                onOk={handleDeleteOk}
                onCancel={handleDeleteCancel}
            >
                <p>{'????????????' + tempUser.userName + '???'}</p>
            </Modal>
            <Modal
                title={'??????'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>
                    {!tempUser.admin
                        ? '?????????' + tempUser.userName + '?????????????????????'
                        : '????????????' + tempUser.userName + '??????????????????'}
                </p>
            </Modal>
        </Layout>
    )
}
