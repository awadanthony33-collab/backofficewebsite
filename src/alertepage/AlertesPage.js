import React, { useState, useEffect } from 'react';
// @ts-ignore
import { Table, Button, Space, message, Tabs } from 'antd';
// @ts-ignore
import { ReloadOutlined, PlusOutlined } from '@ant-design/icons';
// @ts-ignore
import { getAll, remove, update } from '../api/api';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import { Switch, Tag } from '../../node_modules/antd/es/index';
// @ts-ignore

const { Column } = Table;

const AlertesPage = () => {
  const [news,        setnews]        = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [activeTab,   setActiveTab]   = useState('active');
  const [togglingId,  setTogglingId]  = useState(null);
  const navigate = useNavigate();


  // ── Fetch ────────────────────────────────────────────────────────────
  const fetchnews = async () => {
    setLoading(true);
    try {
      const data = await getAll('NewsPointers');
      setnews(data);
    } catch {
      message.error('Impossible de charger les news.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchnews(); }, []);

  // ── Delete ───────────────────────────────────────────────────────────
  const handleDelete = async (newsId) => {
    try {
      await remove('NewsPointers', newsId);
      message.success('News supprimé.');
      fetchnews();
    } catch {
      message.error('Impossible de supprimer.');
    }
  };

  // ── Toggle active ────────────────────────────────────────────────────
  const handleToggleFlag = async (record) => {
    const newActive = record.newsActive === '1' ? '0' : '1';
    setTogglingId(record.newsId);
    try {
      await update('NewsPointers', record.newsId, { ...record, newsActive: newActive });
      message.success(newActive === '1' ? 'News activé.' : 'News désactivé.');
      setnews(prev =>
        prev.map(d => d.newsId === record.newsId ? { ...d, newsActive: newActive } : d)
      );
    } catch {
      message.error('Impossible de modifier le statut.');
    } finally {
      setTogglingId(null);
    }
  };

  

  // ── Filters ──────────────────────────────────────────────────────────
  const activenews   = news.filter(n => String(n.newsActive) === '1');
  const inactivenews = news.filter(n => String(n.newsActive) !== '1');

  // ── Table ────────────────────────────────────────────────────────────
  const NewsTable = ({ data }) => (
    <Table
      dataSource={data}
      rowKey="newsId"
      loading={loading}
      size="small"
      pagination={{ pageSize: 10 }}
    >
      <Column title="ID"               dataIndex="newsId"             key="newsId" />
      <Column title="Commentaire (FR)" dataIndex="newsCommentFrench"  key="newsCommentFrench" />
      <Column title="Commentaire (EN)" dataIndex="newsCommentEnglish" key="newsCommentEnglish" />

      <Column
        title="Statut"
        dataIndex="newsActive"
        key="newsActive"
        render={(newsActive, record) => (
          <Space>
            <Switch
              checked={newsActive === '1'}
              loading={togglingId === record.newsId}
              onChange={() => handleToggleFlag(record)}
              size="small"
            />
            <Tag color={newsActive === '1' ? 'green' : 'red'}>
              {newsActive === '1' ? 'ACTIF' : 'INACTIF'}
            </Tag>
          </Space>
        )}
      />

      <Column
        title="Actions"
        key="actions"
        render={(_, record) => (
          <Space>
            <Button
              size="small"
              type="link"
              onClick={() => navigate(`/mainpage/alertes/edit/${record.newsId}`)}
            >
              Modifier
            </Button>
            <Button
              size="small"
              type="link"
              danger
              onClick={() => handleDelete(record.newsId)}
            >
              Supprimer
            </Button>
          </Space>
        )}
      />
    </Table>
  );

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div>
      {/* Single hidden file input shared across all rows */}


      <div className="toolbar">
        <div />
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/mainpage/alertes/new')}
          >
            Ajouter un news
          </Button>
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