import React, { useState } from 'react';
// @ts-ignore
import { Form, Input, Button, Card, message } from 'antd';
// @ts-ignore
import { LockOutlined, SaveOutlined } from '@ant-design/icons';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:54608/api';

const ChangePasswordPage = () => {
  const [form]          = Form.useForm();
  const [saving, setSaving] = useState(false);

  const username = sessionStorage.getItem('username') || '';

  // ── Submit ─────────────────────────────────────────────────────
  const handleFinish = async (values) => {
    setSaving(true);
    try {
      const response = await fetch(`${BASE_URL}/LogUsers/changepassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          users:           username,
          currentPassword: values.currentPassword,
          newPassword:     values.newPassword,
        }),
      });

      if (response.ok) {
        message.success('Mot de passe modifié avec succès!');
        form.resetFields();
      } else if (response.status === 401) {
        message.error('Mot de passe actuel incorrect.');
      } else {
        message.error('Impossible de modifier le mot de passe.');
      }
    } catch (error) {
      message.error('Erreur réseau. Vérifiez votre connexion.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto' }}>
      <Card title={<span><LockOutlined style={{ marginRight: 8 }} />Changer le mot de passe</span>}>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
        >

          {/* Current password */}
          <Form.Item
            name="currentPassword"
            label="Mot de passe actuel"
            rules={[{ required: true, message: 'Veuillez saisir votre mot de passe actuel.' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mot de passe actuel"
              disabled={saving}
            />
          </Form.Item>

          {/* New password */}
          <Form.Item
            name="newPassword"
            label="Nouveau mot de passe"
            rules={[
              { required: true, message: 'Veuillez saisir un nouveau mot de passe.' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nouveau mot de passe"
              disabled={saving}
            />
          </Form.Item>

  
          <Form.Item
            name="confirmPassword"
            label="Confirmer le nouveau mot de passe"
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirmer le nouveau mot de passe"
              disabled={saving}
            />
          </Form.Item>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
            <Button onClick={() => form.resetFields()} disabled={saving}>
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
      </Card>
    </div>
  );
};

export default ChangePasswordPage;