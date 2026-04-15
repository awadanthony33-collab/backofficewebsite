// @ts-ignore
import React, { useState } from 'react';
// @ts-ignore
import { Layout, Menu } from 'antd';
// @ts-ignore
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// @ts-ignore
import {
  FileTextOutlined,
  MedicineBoxOutlined,
  BellOutlined,
  LogoutOutlined, 
  LockOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ClockCircleOutlined ,
// @ts-ignore
} from '@ant-design/icons';
import { Avatar, Dropdown } from '../../node_modules/antd/es/index';

const ROUTES  =
{
    'rapport' : '/mainpage/rapport',
    'doctors' : '/mainpage/doctors',
    'alertes': '/mainpage/alertes',
    'changepassword' : '/mainpage/changepassword',
    'Duree_de_conservation' : '/mainpage/Dureedeconservation'
};

const Navpage = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate  = useNavigate();
    const location  = useLocation();

    const activeKey = Object.entries(ROUTES ).find(
    ([, path]) => location.pathname.startsWith(path)
  )?.[0] || 'rapport'
const username = sessionStorage.getItem('username') || 'Admin';

const handleLogout = () => {
  sessionStorage.clear();
  navigate('/login');
};

const userMenu = {
  items: [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Déconnexion',
      danger: true,
      onClick: handleLogout,
    },
  ],
};
    const { Sider, Header, Content } = Layout;
    const menuItems = [
        { key: 'rapport',         icon: <FileTextOutlined />,    label: 'Rapports'           },
        { key: 'doctors',         icon: <MedicineBoxOutlined />, label: 'Médecins'           },
        { key: 'alertes',         icon: <BellOutlined />,        label: 'Alertes nouvelles'  },
        { type: 'divider' },
        { key: 'changepassword', icon: <LockOutlined />,        label: 'Mot de passe'       },
        { key: 'Duree_de_conservation', icon: <ClockCircleOutlined  />,        label: 'Durée de conservation'       },
      ];
return (
    <Layout className="nav-layout">
        <Sider collapsed={collapsed} width={240} collapsedWidth={72} className="nav-sider">
            <div className="nav-brand">
            </div>
            {/* Menu */}
            <Menu
                mode="inline"
                selectedKeys={[activeKey]}
                items={menuItems}
                onClick={({ key }) => { if (ROUTES[key]) navigate(ROUTES[key]); }}
                className="nav-menu"
                theme="dark"
            />

            <div className="nav-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                {!collapsed && <span className="nav-collapse-label">Réduire</span>}
            </div>

        </Sider>

        <Layout className={`nav-main ${collapsed ? 'collapsed' : ''}`}>
        <Header className="nav-header">
          <div className="nav-header-left">
            <img src="/logo.png" alt="Logo" className="nav-logo" />
            <span className="nav-header-title">Institut National de Pathologie</span>
          </div>
          <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
            <div className="nav-user-chip">
              <Avatar icon={<UserOutlined />} className="nav-avatar" />
              <span className="nav-username">{username}</span>
            </div>
          </Dropdown>
        </Header>
        <Content className="nav-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
);
}
export default Navpage;
