import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

function EmailsAdminPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [form] = Form.useForm();

  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/Emails`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEmails(data);
    } catch {
      message.error('Erreur lors du chargement des contacts');
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const openCreate = () => {
    setEditing({});
    form.resetFields();
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/Emails/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      message.success('Contact supprimé');
      fetchEmails();
    } catch {
      message.error('Erreur lors de la suppression');
    }
  };

  const handleSave = async (values) => {
    const isNew = !editing?.id;
    const url = isNew ? `${apiUrl}/Emails` : `${apiUrl}/Emails/${editing.id}`;

    try {
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();

      message.success(isNew ? 'Contact ajouté' : 'Contact mis à jour');
      setEditing(null);
      fetchEmails();
    } catch {
      message.error("Erreur lors de l'enregistrement");
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Nom', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'emailAddress' },
    {
      title: 'Actions',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            Modifier
          </Button>
          <Popconfirm
            title="Supprimer ce contact ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Supprimer"
            okButtonProps={{ danger: true }}
            cancelText="Annuler"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>Gestion des emails de contact</h2>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchEmails}>
            Actualiser
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Ajouter
          </Button>
        </Space>
      </Space>

      <Table
        dataSource={emails}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 20 }}
      />

      <Modal
        title={editing?.id ? 'Modifier le contact' : 'Ajouter un contact'}
        open={!!editing}
        onCancel={() => setEditing(null)}
        onOk={() => form.submit()}
        okText="Enregistrer"
        cancelText="Annuler"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="name"
            label="Nom"
            rules={[{ required: true, message: 'Le nom est requis' }]}
          >
            <Input placeholder="Ex: INP Secrétariat" />
          </Form.Item>
          <Form.Item
            name="emailAddress"
            label="Adresse email"
            rules={[
              { required: true, message: "L'email est requis" },
              { type: 'email', message: 'Adresse email invalide' },
            ]}
          >
            <Input placeholder="contact@inp-sal.com" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default EmailsAdminPage;