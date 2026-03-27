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
      style={{
        background: '#a4091b',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        gap: '16px'
      }}
    >
      {/* Toggle Sidebar Button */}
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggleCollapse}
        style={{
          fontSize: '18px',
          width: 64,
          height: 64,
          color: '#fff'
        }}
      />

      {/* Page Title */}
      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', flex: 1 }}>
        {title}
      </div>

      {/* User Info & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span style={{ color: '#fff' }}>Welcome, {username || 'User'}</span>
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