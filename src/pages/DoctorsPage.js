import React, { useState, useEffect } from 'react';
// @ts-ignore
import { Table, Tag, Button, Input, Space, message } from 'antd';
// @ts-ignore
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import { getAll, remove } from '../api/api';
const { Column } = Table;


const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search,  setSearch]  = useState('');
  const navigate = useNavigate();
  // ── Fetch all doctors ──────────────────────────────────────────
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

  // ── Load on page open ──────────────────────────────────────────
  useEffect(() => {
    fetchDoctors();
  }, []);

  // ── Delete a doctor ────────────────────────────────────────────
const handleDelete = async (id) => {
  try {
    await remove('PhysiciansCVs', id);
    message.success('Médecin supprimé.');
    fetchDoctors();
  } catch (error) {
    message.error('Impossible de supprimer.');
  }
};

  // ── Filter by search ───────────────────────────────────────────
  const filtered = doctors.filter(d =>
    `${d.name} ${d.lastName}`.toLowerCase().includes(search.toLowerCase())
  );
    return (
    <div>
      {/* ── Toolbar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Input
          placeholder="Rechercher un médecin..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 260 }}
        />
        <Button icon={<ReloadOutlined />} onClick={fetchDoctors}>
          Actualiser
        </Button>
      </div>

      {/* ── Table ── */}
      <Table
        dataSource={filtered}
        rowKey="id"
        loading={loading}
        size="small"
        pagination={{ pageSize: 10 }}
      >
        
        <Column
          title="Nom"
          key="fullname"
          render={(_, record) => `${record.title || ''} ${record.lastName} ${record.name}`}
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
          render={(flag) => (
            <Tag color={flag === '1' ? 'green' : 'red'}>
              {flag === '1' ? 'ACTIF' : 'INACTIF'}
            </Tag>
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
    </div>
  );
};
export default DoctorsPage;


