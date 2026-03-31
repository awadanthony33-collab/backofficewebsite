import React, { useState } from 'react';
// @ts-ignore
import { Form, Input, Button, Card, Space, message, Select } from 'antd';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { create } from '../api/api';
const { TextArea } = Input;


const DoctorAddPage = () => {
  const navigate       = useNavigate();
  const [form]         = Form.useForm();
  const [saving, setSaving] = useState(false);
//save new doctors
  const handleSave = async (values) => {
    setSaving(true);
    try {
      await create('PhysiciansCVs', values);
      message.success('Médecin ajouté avec succès!');
      navigate('/mainpage/doctors');
    } catch (error) {
      message.error('Impossible d\'ajouter le médecin.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/mainpage/doctors')}
        >
          Retour
        </Button>
        <h2 style={{ margin: 0 }}>Ajouter un médecin</h2>
      </div>

   <Form form={form} layout="vertical" onFinish={handleSave} initialValues={{ flag: '1' }}>

        {/* ── Personal Info ── */}
        <Card title="Informations personnelles" style={{ marginBottom: 16 }}>
          <Space style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="title" label="Titre" style={{ flex: 1 }}>
              <Input placeholder="Dr. / Prof." />
            </Form.Item>
            <Form.Item name="lastName" label="Nom" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input />
            </Form.Item>
            <Form.Item name="name" label="Prénom" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input />
            </Form.Item>
            <Form.Item name="sName" label="Deuxième prénom" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="dOB" label="Date de naissance" style={{ flex: 1 }}>
              <Input placeholder="ex: 1975-06-15" />
            </Form.Item>
            <Form.Item name="position" label="Position" style={{ flex: 1 }}>
              <Input type="number" />
            </Form.Item>

          <Form.Item name="flag" label="Statut" style={{ flex: 1 }}>
            <Select>
              <Select.Option value="1">Actif</Select.Option>
              <Select.Option value="0">Inactif</Select.Option>
            </Select>
          </Form.Item>
          </Space>
        </Card>

        {/* ── Specialty ── */}
        <Card title="Spécialité" style={{ marginBottom: 16 }}>
          <Form.Item name="spesF" label="Spécialité (Français)">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="spesE" label="Spécialité (English)">
            <TextArea rows={3} />
          </Form.Item>
        </Card>

        {/* ── Diplomas ── */}
        <Card title="Diplômes" style={{ marginBottom: 16 }}>
          <Form.Item name="diplF" label="Diplômes (Français)">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="dipE" label="Diplomas (English)">
            <TextArea rows={4} />
          </Form.Item>
        </Card>

        {/* ── Services ── */}
        <Card title="Services" style={{ marginBottom: 16 }}>
          <Form.Item name="servF" label="Services (Français)">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="servE" label="Services (English)">
            <TextArea rows={4} />
          </Form.Item>
        </Card>

        {/* ── Activities ── */}
        <Card title="Activités" style={{ marginBottom: 16 }}>
          <Form.Item name="actF" label="Activités (Français)">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="actE" label="Activities (English)">
            <TextArea rows={4} />
          </Form.Item>
        </Card>

        {/* ── Other ── */}
        <Card title="Autres informations" style={{ marginBottom: 24 }}>
          <Form.Item name="otherF" label="Autres (Français)">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="otherE" label="Other (English)">
            <TextArea rows={4} />
          </Form.Item>
        </Card>

        {/* ── Submit ── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button onClick={() => navigate('/mainpage/doctors')}>
            Annuler
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={saving}
          >
            Enregistrer
          </Button>
        </div>

      </Form>
    </div>
  );
};

export default DoctorAddPage;