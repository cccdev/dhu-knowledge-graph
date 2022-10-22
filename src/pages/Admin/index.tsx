import TopHeader from '@/components/TopHeader'
import { request } from '@/utils/request'
import { Layout, message, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import './index.less'
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAtom } from 'jotai'
import { userDataAtom } from '@/App'
import { useNavigate } from 'react-router-dom'

interface DataType {
  key: string;
  userName: string;
  mobile: number;
  admin: boolean;
}
interface UserType {
  id: string;
  userName: string;
  admin: number;
}

export default function ErrorPage() {
  const [userList, setUserList] = useState([]);
  const [userData] = useAtom(userDataAtom);
  const [tempUser, setTempUser] = useState({
    userName: '',
    id: '',
    admin: 0
  })
  const navigate = useNavigate();

  const setAdmin = (user: UserType) => {
    request({
      url: '/home/addAdmin',
      method: 'post',
      data: {
        mobile: user.id
      },
      params: {
        mobile: user.id
      }
    }).then(res => {
      if (res.code === 0) {
        message.success(res.msg)
        getAllUser();
      } else {
        message.error(res.msg)
      }
    })
  }
  const deleteUser = (user: UserType) => {
    request({
      url: '/user/deleteUser',
      method: 'post',
      data: {
        mobile: user.id
      },
      params: {
        mobile: user.id
      }
    }).then(res => {
      if (res.code === 0) {
        message.success(res.msg)
        user.admin = 1;
        getAllUser()
      } else {
        message.error(res.msg)
      }
    })
  }
  const getAllUser = () => {
    request({
      url: '/user/getAllUser',
    }).then(res => {
      if (res.code === 0) {
        // console.log(res)
        setUserList(res.data)
      } else {
        message.error(res.msg)
      }
    })
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      render: text => <a>{text}</a>,
    },
    {
      title: '手机号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '身份',
      key: 'admin',
      dataIndex: 'admin',
      render: (_, { admin }) => (
        <Tag color={admin ? 'geekblue' : 'green'}>
          {admin ? '管理员' : '用户'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'delete',
      render: (user) => (
        <Space size="middle">
          {
            !user.admin && (<a style={{ cursor: 'pointer' }} onClick={(e) => {
              setTempUser(user);
              showModal();
            }}>设为管理</a>)
          }
          <a style={{ cursor: 'pointer' }} onClick={(e) => {
            setTempUser(user);
            showDeleteModal();
          }}>删除</a>
        </Space>
      ),
    }
  ];
  // modal相关
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setAdmin(tempUser);
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
      navigate('/login');
      return;
    }
    getAllUser()
  }, [])
  return (
    <Layout className="layout">
      <TopHeader />
      <Table style={{ padding: '10px' }} columns={columns} dataSource={userList} />
      <Modal
        title={'删除用户'}
        open={isDeleteModalOpen}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
      >
        <p>{'确定删除' + tempUser.userName + '？'}</p>
      </Modal>
      <Modal
        title={'添加'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>{'确定将' + tempUser.userName + '设置为管理员？'}</p>
      </Modal>
    </Layout>

  )
}
