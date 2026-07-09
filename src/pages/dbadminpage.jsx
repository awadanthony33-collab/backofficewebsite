import { useState, useEffect } from 'react';
import { Select, Table, Button, Modal, Form, Input, message, Popconfirm, Space, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';

function DbAdminPage() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [form] = Form.useForm();

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/DbAdmin/tables`)
      .then((res) => res.json())
      .then((data) => setTables(data))
      .catch(() => message.error('Impossible de charger la liste des tables'));
  }, [apiUrl]);

  const fetchRows = async (table) => {
    if (!table) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/DbAdmin/${table}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRows(data);
    } catch {
      message.error('Erreur lors du chargement des données');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (value) => {
    setSelectedTable(value);
    fetchRows(value);
  };

  // Derive columns dynamically from the first row's keys
  const columns = rows.length
    ? Object.keys(rows[0]).map((key) => ({
        title: key,
        dataIndex: key,
        ellipsis: true,
      })).concat([
        {
          title: 'Actions',
          fixed: 'right',
          width: 160,
          render: (_, record) => (
            <Space>
              <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
                Modifier
              </Button>
              <Popconfirm
                title="Supprimer cette ligne ?"
                description="Cette action est irréversible."
                onConfirm={() => handleDelete(record)}
                okText="Supprimer"
                okButtonProps={{ danger: true }}
                cancelText="Annuler"
              >
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          ),
        },
      ])
    : [];

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
  };

  const openCreate = () => {
    setEditing({});
    form.resetFields();
  };

  const getPrimaryKeyValue = (record) => {
    // assumes first field returned is the primary key — adjust if needed per table
    const firstKey = Object.keys(record)[0];
    return record[firstKey];
  };

  const handleDelete = async (record) => {
    const keyValue = getPrimaryKeyValue(record);
    try {
      const res = await fetch(`${apiUrl}/DbAdmin/${selectedTable}/${keyValue}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      message.success('Ligne supprimée');
      fetchRows(selectedTable);
    } catch {
      message.error('Erreur lors de la suppression');
    }
  };

const handleSave = async (values) => {
  const isNew = !editing || Object.keys(editing).length === 0;
  const url = isNew
    ? `${apiUrl}/DbAdmin/${selectedTable}`
    : `${apiUrl}/DbAdmin/${selectedTable}/${getPrimaryKeyValue(editing)}`;

  try {
    const res = await fetch(url, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error();
    message.success('Enregistré avec succès');
    setEditing(null);
    fetchRows(selectedTable);
  } catch {
    message.error("Erreur lors de l'enregistrement");
  }
};

  return (
    <div style={{ padding: 24 }}>
      <Alert
        type="warning"
        showIcon
        message="Zone d'administration avancée"
        description="Cette page modifie directement la base de données. À utiliser avec précaution."
        style={{ marginBottom: 16 }}
      />

      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Choisir une table"
          style={{ width: 240 }}
          options={tables.map((t) => ({ label: t, value: t }))}
          onChange={handleTableChange}
          value={selectedTable}
        />
        <Button icon={<ReloadOutlined />} onClick={() => fetchRows(selectedTable)} disabled={!selectedTable}>
          Actualiser
        </Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} disabled={!selectedTable}>
          Ajouter
        </Button>
      </Space>

      {selectedTable && (
        <Table
          dataSource={rows}
          columns={columns}
          rowKey={(record) => getPrimaryKeyValue(record)}
          loading={loading}
          scroll={{ x: true }}
          pagination={{ pageSize: 20 }}
        />
      )}

      <Modal
        title={editing && Object.keys(editing).length ? 'Modifier la ligne' : 'Ajouter une ligne'}
        open={!!editing}
        onCancel={() => setEditing(null)}
        onOk={() => form.submit()}
        okText="Enregistrer"
        cancelText="Annuler"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          {rows.length > 0 &&
            Object.keys(rows[0]).map((key) => (
              <Form.Item key={key} name={key} label={key}>
                <Input />
              </Form.Item>
            ))}
        </Form>
      </Modal>
    </div>
  );
}

export default DbAdminPage;