import React, { useState, useEffect } from 'react';
// @ts-ignore
import { Table, Tag, Button, Input, Space, message, Switch, Tabs } from 'antd';
// @ts-ignore
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import { getAll, remove, update } from '../api/api';
const { Column } = Table;


const DoctorsPage = () => {
  const [doctors,    setDoctors]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [search,     setSearch]     = useState('');
  const [togglingId, setTogglingId] = useState(null);
  const [activeTab,  setActiveTab]  = useState('active');
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await getAll('PhysiciansCVs');
      setDoctors(data);
    } catch (error) {
      message.error('Impossible de charger les médecins.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleDelete = async (id) => {
    try {
      await remove('PhysiciansCVs', id);
      message.success('Médecin supprimé.');
      fetchDoctors();
    } catch (error) {
      message.error('Impossible de supprimer.');
    }
  };

  const handleToggleFlag = async (record) => {
    const newFlag = record.flag === '1' ? '0' : '1';
    setTogglingId(record.id);
    try {
      await update('PhysiciansCVs', record.id, { ...record, iD: record.id, flag: newFlag });
      message.success(newFlag === '1' ? 'Médecin activé.' : 'Médecin désactivé.');
      setDoctors(prev =>
        prev.map(d => d.id === record.id ? { ...d, flag: newFlag } : d)
      );
    } catch (error) {
      message.error('Impossible de modifier le statut.');
    } finally {
      setTogglingId(null);
    }
  };

  // ── Split by flag, then apply search ──────────────────────────
  const applySearch = (list) =>
    list.filter(d =>
      `${d.name} ${d.lastName}`.toLowerCase().includes(search.toLowerCase())
    );

  const activeDoctors   = applySearch(doctors.filter(d => d.flag === '1'));
  const inactiveDoctors = applySearch(doctors.filter(d => d.flag !== '1'));

  // ── Shared table component ─────────────────────────────────────
  const DoctorsTable = ({ data }) => (
    <Table
      dataSource={data}
      rowKey="id"
      loading={loading}
      size="small"
      pagination={{ pageSize: 10 }}
    >

      <Column
        title="Nom"
        key="fullname"
        render={(_, record) => `${record.title || ''} ${record.lastName} ${record.sName} ${record.name} `}
      />


      <Column
        title="Position"
        dataIndex="position"
        key="position"
        render={(val) => val ?? '—'}
      />

      <Column
        title="Statut"
        dataIndex="flag"
        key="flag"
        render={(flag, record) => (
          <Space>
            <Switch
              checked={flag === '1'}
              loading={togglingId === record.id}
              onChange={() => handleToggleFlag(record)}
              size="small"
            />
            <Tag 
              color={flag === '1' ? 'green' : 'red'}>
              {flag === '1' ? 'ACTIF' : 'INACTIF'}
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
              onClick={() => navigate(`/mainpage/doctors/edit/${record.id}`)}
            >
              Modifier
            </Button>
            <Button
              size="small"
              type="link"
              danger
              onClick={() => handleDelete(record.id)}
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
        <Input className="search-input"
          placeholder="Rechercher un médecin..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/mainpage/doctors/new')}
          >
            Ajouter un médecin
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchDoctors}>
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
            label:    `Actifs (${activeDoctors.length})`,
            children: <DoctorsTable data={activeDoctors} />,
          },
          {
            key:      'inactive',
            label:    `Inactifs (${inactiveDoctors.length})`,
            children: <DoctorsTable data={inactiveDoctors} />,
          },
        ]}
      />
    </div>
  );
};

export default DoctorsPage;