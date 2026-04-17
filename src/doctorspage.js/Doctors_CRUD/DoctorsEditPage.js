import React, { useState, useEffect } from 'react';
// @ts-ignore
import { Form, Input, Button, Card, message, Spin ,Row, Col} from 'antd';
// @ts-ignore
import { useNavigate, useParams } from 'react-router-dom';
// @ts-ignore
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getById, update } from '../../api/api';
const { TextArea } = Input;


const DoctorEditPage = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [form]       = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);

  // ── Load doctor data when page opens ──────────────────────────
useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const data = await getById('PhysiciansCVs', id);
        console.log('DATA FROM API:', data);
        form.setFieldsValue({
          title:     data.title,
          lastName:  data.lastName,
          name:      data.name,
          sName:     data.sName,
          DOB:       data.DOB,
          spesF:     data.spesF,
          spesE:     data.spesE,
          diplF:     data.diplF,
          dipE:      data.dipE,
          servF:     data.servF,
          servE:     data.servE,
          actF:      data.actF,
          actE:      data.actE,
          otherF:    data.otherF,
          otherE:    data.otherE,
          flag:      data.flag,
          position:  data.position,
        });
      } catch (error) {
        message.error('Impossible de charger ce médecin.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [form, id]);


const handleSave = async (values) => {
  setSaving(true);
  try {
    const payload = { iD: parseInt(id), ...values };
    await update('PhysiciansCVs', id, payload);
    message.success('Médecin modifié avec succès!');
    navigate('/mainpage/doctors');
  } catch (error) {
    message.error('Impossible de modifier.');
  } finally {
    setSaving(false);   
  }
};

if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
<div style={{ maxWidth: 1600, width: '100%', margin: '0 auto' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/mainpage/doctors')}
        >
          Retour
        </Button>
        <h2 style={{ margin: 0 }}>Modifier le médecin</h2>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSave}>

<Card title="Informations personnelles" style={{ marginBottom: 24 }}>
  <Row gutter={16} align="middel" >
    <Col flex="80px">
      <Form.Item name="title" label="Titre">
        <Input placeholder="Dr. / Prof." />
      </Form.Item>
    </Col>

    <Col flex="200px">
      <Form.Item name="lastName" label="Nom" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    </Col>

    <Col flex="200px">
      <Form.Item name="name" label="Prénom" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    </Col>

    <Col flex="200px">
      <Form.Item name="sName" label="Nom épouse">
        <Input />
      </Form.Item>
    </Col>

    <Col flex="150px">
      <Form.Item name="DOB" label="Date de naissance">
        <Input/>
        {/* <DatePicker needConfirm /> */}
      </Form.Item>
    </Col>

    <Col flex="100px">
      <Form.Item name="position" label="Position">
        <Input type="number" />
      </Form.Item>
    </Col>

    <Col flex="100px">
      <Form.Item name="flag" label="Statut">
        <select
          style={{
            width: '100%',
            padding: '6px 8px',
            borderRadius: 6,
            border: '1px solid #d9d9d9',
            fontSize: 14,
          }}
        >
          <option value="1">Actif</option>
          <option value="0">Inactif</option>
        </select>
      </Form.Item>
    </Col>
  </Row>
</Card>

        {/* ── Specialty ── */}
        <Card title="Spécialité" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
            <Form.Item name="spesF" label="Spécialité (Français)">
             <TextArea rows={4} />
            </Form.Item>
            </Col>
            <Col span={12}>
          <Form.Item name="spesE" label="Spécialité (English)">
           <TextArea rows={4}/>
          </Form.Item>      
          </Col>
          </Row>

        </Card>

        {/* ── Diplomas ── */}
        <Card title="Diplômes" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                <Form.Item name="diplF" label="Diplômes (Français)">
                  <TextArea rows={7} />
                </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item name="dipE" label="Diplomas (English)">
                  <TextArea rows={7} />
                </Form.Item>
                </Col>
              </Row>
        </Card>

        {/* ── Services ── */}
        <Card title="Services" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
          <Col span={12}>
          <Form.Item name="servF" label="Services (Français)">
            <TextArea rows={9} />
          </Form.Item> 
          </Col>
          <Col span={12}>
          <Form.Item name="servE" label="Services (English)">
            <TextArea rows={9 } />
          </Form.Item>
          </Col>
          </Row>
        </Card>

        {/* ── Activities ── */}
        <Card title="Activités" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
         <Form.Item name="actF" label="Activités (Français)">
            <TextArea rows={3} />
         </Form.Item>
            </Col>
            <Col span={12}>
          <Form.Item name="actE" label="Activities (English)">
            <TextArea rows={3} />
          </Form.Item>
            </Col>
          </Row>

        </Card>

        {/* ── Other ── */}
        <Card title="Autres informations" style={{ marginBottom: 24 }}>

          <Row gutter={16}>
              <Col span={12}>
            <Form.Item name="otherF" label="Autres (Français)">
              <TextArea rows={4} />
            </Form.Item>
              </Col>
              <Col span={12}>
          <Form.Item name="otherE" label="Other (English)">
            <TextArea rows={4} />
          </Form.Item>
              </Col>
          </Row>
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

export default DoctorEditPage;