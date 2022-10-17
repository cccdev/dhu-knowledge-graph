import sunrise from '@/assets/sunrise.png'
import { UserContext } from '@/context'
import { CustomResponse } from '@/types'
import { request } from '@/utils/request'
import { LockOutlined, MobileOutlined, SafetyOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, message } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './index.less'

const Login: React.FC = () => {
    const [codeImg, setCodeImg] = useState('')
    const navigate = useNavigate()
    const { userData } = useContext(UserContext)

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
        request<CustomResponse>({
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
        request<CustomResponse>({
            url: '/user/proLogin',
            method: 'post',
            params: values,
        }).then((res) => {
            if (res.code === 0) {
                message.success(res.msg)
                localStorage.setItem(
                    'userData',
                    JSON.stringify({
                        isLoggedIn: true,
                        userName: values.userName,
                    })
                )
                navigate('/')
            } else {
                initCodeImg()
                message.error(res.msg)
            }
        })
    }

    return (
        <div className="login">
            <img src={sunrise} className="login-img" />
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
                        style={{ height: '32px', cursor: 'pointer' }}
                        onClick={initCodeImg}
                        src={codeImg}
                    />
                </div>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>记住我</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="#">
                        忘记密码
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                    >
                        登录
                    </Button>
                    &nbsp;
                    <NavLink
                        to="/register"
                        className={({ isActive }) =>
                            isActive ? 'current' : ''
                        }
                    >
                        立即注册
                    </NavLink>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Login
