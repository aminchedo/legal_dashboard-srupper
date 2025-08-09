import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (values: any) => {
        setLoading(true);
        try {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const response = await fetch(`${apiBase}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            if (response.ok && (data.token || data.accessToken)) {
                const token = data.accessToken || data.token;
                localStorage.setItem('accessToken', token);
                message.success('Login successful!');
                navigate('/dashboard');
            } else {
                message.error(data.message || 'Login failed.');
            }
        } catch (error) {
            message.error('An error occurred during login.');
        }
        setLoading(false);
    };

    const handleRegister = async (values: any) => {
        setLoading(true);
        try {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const response = await fetch(`${apiBase}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            if (response.ok) {
                message.success('Registration successful! Please log in.');
            } else {
                message.error(data.message || 'Registration failed.');
            }
        } catch (error) {
            message.error('An error occurred during registration.');
        }
        setLoading(false);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 400 }}>
                <Tabs defaultActiveKey="1" centered>
                    <TabPane tab="Login" key="1">
                        <Form name="login" onFinish={handleLogin}>
                            <Form.Item name="email" rules={[{ required: true, message: 'Please input your Email!' }]}>
                                <Input prefix={<UserOutlined />} placeholder="Email" />
                            </Form.Item>
                            <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
                                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                                    Log in
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                    <TabPane tab="Register" key="2">
                        <Form name="register" onFinish={handleRegister}>
                            <Form.Item name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
                                <Input prefix={<UserOutlined />} placeholder="Username" />
                            </Form.Item>
                            <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid Email!' }]}>
                                <Input prefix={<MailOutlined />} placeholder="Email" />
                            </Form.Item>
                            <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
                                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                                    Register
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default LoginPage;

