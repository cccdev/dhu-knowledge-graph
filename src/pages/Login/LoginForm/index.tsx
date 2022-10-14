import { LockOutlined, MobileOutlined, SafetyOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './index.less'
import request from '@/utils/request'

const LoginForm: React.FC = () => {
    const [codeImg, setCodeImg] = useState('')
    const navigate = useNavigate()

    let initCodeFlag = false
    useEffect(() => {
        if (!initCodeFlag) initCodeImg()
        initCodeFlag = true
    }, [])

    const initCodeImg = () => {
        request
            .get('/user/verifyCode', {
                responseType: 'arraybuffer',
            })
            .then((res) => {
                setCodeImg(
                    'data:image/png;base64,' +
                        btoa(String.fromCharCode(...new Uint8Array(res)))
                )
            })
    }

    const onFinish = (values: any) => {
        request
            .post('/user/proLogin', values, {
                params: values,
            })
            .then((res) => {
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
        <Form
            name="normal_login"
            className="login-form"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
        >
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
                    prefix={<MobileOutlined className="site-form-item-icon" />}
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
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="密码"
                />
            </Form.Item>
            <div id="vefifyCode">
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
                    className={({ isActive }) => (isActive ? 'current' : '')}
                >
                    立即注册
                </NavLink>
            </Form.Item>
        </Form>
    )
}

export default LoginForm
