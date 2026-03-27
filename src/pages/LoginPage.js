import React, { useState } from 'react';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { Form, Input, Button, Checkbox, message } from 'antd';
// @ts-ignore
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const payload = {
      users: values.username,
      password: values.password
    };

    setLoading(true);

    try {
      const response = await fetch('http://localhost:54608/api/LogUsers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('LOGIN SUCCESS', data);

        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('username', data.users);

        message.success(`Welcome, ${data.users}!`);
        
        setTimeout(() => {
          navigate('/mainpage');
        }, 500);

      } else if (response.status === 401) {
        message.error('Invalid username or password.');
      } else {
        message.error('Login failed. Please try again.');
      }
    } catch (error) {
      message.error('Network error. Please check your connection.');
      console.error('ERROR', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Form
        form={form}
        name="login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <h2 className="login-title">Backoffice Login</h2>

        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Username"
            className="login-input"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            className="login-input"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox className="login-remember">Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-submit"
            loading={loading}
            block
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;