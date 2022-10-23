import TopHeader from '@/components/TopHeader'
import { request } from '@/utils/request'
import { Layout, message, Modal, Switch } from 'antd'
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
  id: string;
  admin: number;
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
    admin: 0,
  })
  const navigate = useNavigate();

  const setAdmin = (user: UserType) => {
    request({
      url: '/home/addAdmin',
      method: 'post',
      data: {
        mobile: user.id,
        admin: user.admin ? '0' : '1'
      },
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
        res.data.forEach(e => e.key = e.id);
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
      align: 'center'
    },
    {
      title: '手机号',
      dataIndex: 'id',
      key: 'id',
      align: 'center'
    },
    {
      title: '身份',
      key: 'admin',
      dataIndex: 'admin',
      align: 'center',
      render: (_, { admin }) => (
        <Tag color={admin ? 'red' : 'green'}>
          {admin ? '管理员' : '用户'}
        </Tag>
      ),
    },
    {
      title: '管理权限',
      key: 'admin',
      dataIndex: 'admin',
      align: 'center',
      render: (_, user) => (
        <Switch checked={user.admin === 1} onChange={() => {
          setTempUser(user);
          showModal();
        }} />
      )
    },
    {
      title: '操作',
      key: 'delete',
      align: 'center',
      render: (_, user) => (
        <Space size="middle">
          <a style={{ cursor: 'pointer' }} onClick={() => {
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
        <p>{
          !tempUser.admin
            ? '确定将' + tempUser.userName + '设置为管理员？'
            : '确定移除' + tempUser.userName + '管理员权限？'
        }</p>
      </Modal>
    </Layout>

  )
}
