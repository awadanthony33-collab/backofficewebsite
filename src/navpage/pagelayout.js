import React, { useState } from 'react';
// @ts-ignore
import { Layout } from 'antd';
import Sidebar from './Sliderbar';
import TopHeader from './Topbar';



const { Content } = Layout;

const PageLayout = ({ title, children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />

      <Layout>
        <TopHeader 
          title={title} 
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
        />
        <Content>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default PageLayout;