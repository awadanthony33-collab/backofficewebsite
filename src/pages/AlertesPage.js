import React, { useState, useEffect } from 'react';
// @ts-ignore
import { Table, Button, Space, message, Tabs } from 'antd';
// @ts-ignore
import {  ReloadOutlined } from '@ant-design/icons';
// @ts-ignore
import { getAll, remove } from '../api/api';
const { Column } = Table;


const AlertesPage = () => {
  const [news,    setnews]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [activeTab,  setActiveTab]  = useState('active');


  const fetchnews = async () => {
    setLoading(true);     
    try {
      const data = await getAll('NewsPointers');
      setnews(data);
    } catch (error) {
      message.error('Impossible de charger news.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchnews(); }, []);

  const handleDelete = async (NewsId) => {
    try {
      await remove('NewsPointers', NewsId);
      message.success('Médecin supprimé.');
      fetchnews();
    } catch (error) {
      message.error('Impossible de supprimer.');
    }
  };

const activenews = news.filter(n => String(n.NewsActive) === '1');
const inactivenews = news.filter(n => String(n.NewsActive) !== '1');

const NewsTable = ({ data }) => (
  <Table
    dataSource={data}
    rowKey="NewsId"
    loading={loading}
    size="small"
    pagination={{ pageSize: 10 }}
  >
    <Column title="ID" dataIndex="NewsId" key="NewsId" />

    <Column
      title="Commentaire (FR)"
      dataIndex="NewsCommentFrench"
      key="NewsCommentFrench"
    />

    <Column
      title="Commentaire (EN)"
      dataIndex="NewsCommentEnglish"
      key="NewsCommentEnglish"
    />

    <Column
      title="Actions"
      key="actions"
      render={(_, record) => (
        <Space>
          <Button
            size="small"
            type="link"
            danger
            onClick={() => handleDelete(record.NewsId)}
          >
            Supprimer
          </Button>
        </Space>
      )}
    />
  </Table>
);

  return (
    <div>
      <div className="toolbar">
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchnews}>
            Actualiser
          </Button>
        </Space>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key:      'active',
            label:    `Actifs (${activenews.length})`,
            children: <NewsTable data={activenews} />,
          },
          {
            key:      'inactive',
            label:    `Inactifs (${inactivenews.length})`,
            children: <NewsTable data={inactivenews} />,
          },
        ]}
      />
    </div>
  );
};

export default AlertesPage;