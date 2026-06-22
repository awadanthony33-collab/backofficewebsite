import React, { useState } from 'react';
import {
  Card,
  Button,
  Typography,
  Space,
  Alert,
  Popconfirm,
  message
} from 'antd';

import {
  DatabaseOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';

const { Title } = Typography;

// IMPORTANT: set this in .env
const BASE_URL = process.env.REACT_APP_API_URL_MIGRATION;

const MigrationPage = () => {
  const [loadingStep1, setLoadingStep1] = useState(false);
  const [loadingStep2, setLoadingStep2] = useState(false);

  const [step1Status, setStep1Status] = useState(null);
  const [step2Status, setStep2Status] = useState(null);

  const [step1Error, setStep1Error] = useState('');
  const [step2Error, setStep2Error] = useState('');

  const [logs, setLogs] = useState([]);

  const addLog = (text, type = 'info') => {
    setLogs(prev => [
      ...prev,
      {
        text,
        type,
        time: new Date().toLocaleTimeString()
      }
    ]);
  };

  // =========================
  // STEP 1 - CREATE TABLES
  // =========================
  const handleMigrate = async () => {
    setLoadingStep1(true);
    setStep1Status(null);
    setStep1Error('');
    addLog('Connexion au serveur...', 'info');

    try {
      const response = await fetch(
        `${BASE_URL}/createtables`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      // 🚨 REAL ERROR HANDLING
      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Erreur serveur');
      }

      setStep1Status('success');
      addLog('Tables créées avec succès ✓', 'success');
      message.success('Tables créées avec succès!');

    } catch (error) {
      setStep1Status('error');
      setStep1Error(error.message);
      addLog(`ERREUR: ${error.message}`, 'error');
      message.error(error.message);
    } finally {
      setLoadingStep1(false);
    }
  };

  // =========================
  // STEP 2 - COPY DATA
  // =========================
  const handleCopyData = async () => {
    setLoadingStep2(true);
    setStep2Status(null);
    setStep2Error('');
    addLog('Copie des données...', 'info');

    try {
      const response = await fetch(
        `${BASE_URL}/insertdata`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      // 🚨 REAL ERROR HANDLING
      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Erreur serveur');
      }

      setStep2Status('success');

      if (data.tables) {
        data.tables.forEach(t => {
          addLog(
            `[${t.name}]: ${t.rows} lignes copiées ✓`,
            'success'
          );
        });
      }

      addLog('Migration terminée ✓', 'success');
      message.success('Données copiées avec succès!');

    } catch (error) {
      setStep2Status('error');
      setStep2Error(error.message);
      addLog(`ERREUR: ${error.message}`, 'error');
      message.error(error.message);
    } finally {
      setLoadingStep2(false);
    }
  };

  // =========================
  // UI COLORS
  // =========================
  const logColors = {
    info: '#abb2bf',
    success: '#4ec94e',
    error: '#f47067',
    warning: '#e5c07b'
  };

  return (
    <Card
      style={{
        width: '80%',
        maxWidth: 800,
        margin: '50px auto',
        padding: 30
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>

        <Title level={3}>
          <DatabaseOutlined style={{ marginRight: 10 }} />
          Migration de la base de données
        </Title>

        <Alert
          message="Attention"
          description="Étape 1 crée les tables. Étape 2 copie les données."
          type="warning"
          showIcon
          icon={<WarningOutlined />}
        />

        {/* ================= BUTTONS ================= */}
        <Space size="middle">

          {/* STEP 1 */}
          <Popconfirm
            title="Créer les tables ?"
            onConfirm={handleMigrate}
            okText="Oui"
            cancelText="Non"
          >
            <Button
              type="primary"
              size="large"
              icon={<DatabaseOutlined />}
              loading={loadingStep1}
              danger={step1Status === 'error'}
              style={{ minWidth: 220 }}
            >
              {loadingStep1
                ? 'Création...'
                : 'Étape 1 - Créer tables'}
            </Button>
          </Popconfirm>

          {/* STEP 2 */}
          <Popconfirm
            title="Copier les données ?"
            onConfirm={handleCopyData}
            okText="Oui"
            cancelText="Non"
            disabled={step1Status !== 'success'}
          >
            <Button
              size="large"
              icon={<CopyOutlined />}
              loading={loadingStep2}
              disabled={step1Status !== 'success'}
              danger={step2Status === 'error'}
              style={{ minWidth: 220 }}
            >
              {loadingStep2
                ? 'Copie...'
                : 'Étape 2 - Copier données'}
            </Button>
          </Popconfirm>

        </Space>

        {/* ================= STATUS ================= */}
        {step1Status === 'success' && (
          <Alert
            type="success"
            message="Tables créées ✓"
            showIcon
            icon={<CheckCircleOutlined />}
          />
        )}

        {step1Status === 'error' && (
          <Alert
            type="error"
            message="Erreur étape 1"
            description={step1Error}
          />
        )}

        {step2Status === 'success' && (
          <Alert
            type="success"
            message="Migration terminée ✓"
            showIcon
            icon={<CheckCircleOutlined />}
          />
        )}

        {step2Status === 'error' && (
          <Alert
            type="error"
            message="Erreur étape 2"
            description={step2Error}
          />
        )}

        {/* ================= LOGS ================= */}
        {logs.length > 0 && (
          <div
            style={{
              background: '#1e1e1e',
              padding: 12,
              borderRadius: 8,
              fontFamily: 'monospace',
              maxHeight: 250,
              overflowY: 'auto'
            }}
          >
            {logs.map((log, i) => (
              <div
                key={i}
                style={{
                  color: logColors[log.type],
                  marginBottom: 4
                }}
              >
                <span style={{ color: '#666', marginRight: 8 }}>
                  [{log.time}]
                </span>
                {log.text}
              </div>
            ))}
          </div>
        )}

        {logs.length > 0 && (
          <Button size="small" onClick={() => setLogs([])}>
            Clear logs
          </Button>
        )}

      </Space>
    </Card>
  );
};

export default MigrationPage;