import { userDataAtom } from '@/App'
import sunrise from '@/assets/sunrise.png'
import { UserContext } from '@/context'
import { IResponse } from '@/types'
import { request } from '@/utils/request'
import { LockOutlined, MobileOutlined, SafetyOutlined } from '@ant-design/icons'
import { Button, Form, Input, message } from 'antd'
import { useAtom } from 'jotai'
import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './index.less'

const Login: React.FC = () => {
    const [codeImg, setCodeImg] = useState('')
    const navigate = useNavigate()
    const [userData, setUserData] = useAtom(userDataAtom)

    let initCodeFlag = false
    useEffect(() => {
        if (userData.isLoggedIn) {
            navigate('/')
            return
        }
        if (!initCodeFlag) initCodeImg()
        initCodeFlag = true
    }, [])

    const initCodeImg = () => {
        request<IResponse>({
            url: '/user/verifyCode',
            method: 'get',
            responseType: 'arraybuffer',
        }).then((res) => {
            setCodeImg(
                'data:image/png;base64,' +
                    btoa(
                        String.fromCharCode(
                            ...new Uint8Array(res as unknown as ArrayBufferLike)
                        )
                    )
            )
        })
    }

    const onFinish = (values: any) => {
        request<IResponse>({
            url: '/user/proLogin',
            method: 'post',
            data: values,
        }).then((res) => {
            if (res.code === 0) {
                message.success(res.msg)
                localStorage.setItem(
                    'userData',
                    JSON.stringify({
                        isLoggedIn: true,
                        mobile: values.mobile,
                        ...res.data,
                    })
                )
                setUserData({
                    ...userData,
                    isLoggedIn: true,
                    mobile: values.mobile,
                    ...res.data,
                })
                navigate('/')
            } else {
                initCodeImg()
                message.error(res.msg)
            }
        })
    }

    return (
        <div className="login">
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <h2 className="form-title">登录</h2>
                <Form.Item
                    name="mobile"
                    rules={[
                        {
                            required: true,
                            message: '请输入手机号！',
                        },
                        {
                            pattern: /^1[3456789]\d{9}$/,
                            message: '手机号格式错误！',
                        },
                    ]}
                >
                    <Input
                        prefix={
                            <MobileOutlined className="site-form-item-icon" />
                        }
                        placeholder="手机号"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码！',
                        },
                    ]}
                >
                    <Input
                        prefix={
                            <LockOutlined className="site-form-item-icon" />
                        }
                        type="password"
                        placeholder="密码"
                    />
                </Form.Item>
                <div id="verifyCode">
                    <Form.Item
                        name="vercode"
                        rules={[
                            {
                                required: true,
                                message: '请确认验证码！',
                            },
                        ]}
                    >
                        <Input
                            prefix={
                                <SafetyOutlined className="site-form-item-icon" />
                            }
                            placeholder="验证码"
                        />
                    </Form.Item>
                    <img
                        style={{
                            height: '32px',
                            cursor: 'pointer',
                        }}
                        onClick={initCodeImg}
                        src={codeImg}
                    />
                </div>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                    >
                        登录
                    </Button>
                    <div className="login-control">
                        <NavLink
                            to="/register"
                            className={({ isActive }) =>
                                isActive ? 'current' : ''
                            }
                        >
                            立即注册
                        </NavLink>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? 'current' : ''
                            }
                        >
                            返回主页
                        </NavLink>
                    </div>
                </Form.Item>
            </Form>
            <img src={sunrise} className="login-img" />
        </div>
    )
}

export default Login
