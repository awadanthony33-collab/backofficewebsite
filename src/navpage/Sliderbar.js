import React, { useState, useEffect } from 'react';
// @ts-ignore
import { Layout, Menu } from 'antd';
// @ts-ignore
import { DashboardOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
// @ts-ignore
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = ({ collapsed, onCollapsedChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState('1');

  // Update selected key based on current route
  useEffect(() => {
    const pathToKey = {
      '/page-a': '1',
      '/users': '2',
      '/customers': '3',
      '/settings': '4',
    };
    setSelectedKey(pathToKey[location.pathname] || '1');
  }, [location.pathname]);

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/page-a')
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: 'Users',
      onClick: () => navigate('/users')
    },
    {
      key: '3',
      icon: <UserOutlined />,
      label: 'Customers',
      onClick: () => navigate('/customers')
    },
    {
      key: '4',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings')
    },
  ];

  return (
    <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed}
      onCollapse={onCollapsedChange}
      style={{ background: '#1f1f1f' }}
      width={200}
      collapsedWidth={80}
    >
      <div style={{
        height: '64px',
        padding: '16px',
        color: '#fff',
        fontSize: '18px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderBottom: '1px solid #333'
      }}>
        {!collapsed && 'Backoffice'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        style={{ background: '#1f1f1f' }}
      />
    </Sider>
  );
};

export default Sidebar;