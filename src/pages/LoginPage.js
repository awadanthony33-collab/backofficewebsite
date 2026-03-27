import React, { useState } from 'react';
// @ts-ignore
import { Form, Input, Button, Checkbox } from 'antd';
// @ts-ignore
import { UserOutlined, LockOutlined } from '@ant-design/icons';


const LoginPage = () => {
  const [loading,setloading] = useState(false);
  const onFinish = async (values) =>{
    const payload = {
      users: values.username,
      password : values.password
    };
    setloading(true);
    try {
      const responce  = await fetch('http://localhost:54608/api/LogUsers/login', {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify(payload)
      });

      if(responce.ok)
      {
        const data =await responce.json();
        console.log('LOGIN SUCCESS',data);
      }
      else
      {
        console.log('LOGIN FAILED');
      }
    }
      catch(error)
      {
        console.error("ERROR",error);
      }
  }

  return (
    <div className="login-container">
      <Form
        name="login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <h2 className="login-title">backoffice Login</h2>

        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" className="login-input" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            className="login-input"
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox className="login-remember">Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-submit" loading={loading}>
            
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;