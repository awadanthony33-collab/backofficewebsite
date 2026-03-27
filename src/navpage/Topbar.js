import React from 'react';
// @ts-ignore
import { Layout, Button } from 'antd';
// @ts-ignore
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
// @ts-ignore
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const TopHeader = ({ title, collapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const username = sessionStorage.getItem('username');

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <Header
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggleCollapse}
      />

      <div >
        {title}
      </div>

      <div>
        <span>Welcome, {username || 'User'}</span>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </Header>
  );
};

export default TopHeader;