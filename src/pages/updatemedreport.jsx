import { Card, Statistic, Row, Col, List, Tag, message } from 'antd';
import { useState, useEffect, useCallback ,useRef } from 'react';

function ProcessingSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  const today = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const hasRun = useRef(false);
  const runProcessing = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/Reports/process-upload-folder`);
      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();
      setSummary(data);
      message.success('Traitement terminé');
    } catch (err) {
      message.error('Erreur lors du traitement');
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);


  const totalCreated = summary?.results?.reduce((sum, r) => sum + (r.createdcount || 0), 0) || 0;
  const totalUpdated = summary?.results?.reduce((sum, r) => sum + (r.updatedcount || 0), 0) || 0;
  const totalEmailed = summary?.results?.reduce((sum, r) => sum + (r.emailsent?.length || 0), 0) || 0;

useEffect(() => {
  if (hasRun.current) return;

  hasRun.current = true;
  runProcessing();
}, [runProcessing]);
  
  return (
    <Card
      title={`Traitement des rapports médicaux — date: ${today}`}
      loading={loading}
      style={{ marginBottom: 24 }}
    >
      {summary && (
        <>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Statistic title="Fichier(s) trouvé(s)" value={summary.filesFound} />
            </Col>
            <Col span={6}>
              <Statistic title="Fichier(s) créé(s)" value={totalCreated} />
            </Col>
            <Col span={6}>
              <Statistic title="Fichier(s) mis à jour" value={totalUpdated} />
            </Col>
            <Col span={6}>
              <Statistic title="Email(s) envoyé(s)" value={totalEmailed} />
            </Col>
          </Row>

          <List
            header={<b>Détails par fichier</b>}
            dataSource={summary.results}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <>
                      {item.fileName?.split('\\').pop()}{' '}
                      <Tag color={item.success ? 'green' : 'red'}>
                        {item.success ? 'Succès' : 'Échec'}
                      </Tag>
                      {item.pdfmatched && <Tag color="blue">PDF associé</Tag>}
                    </>
                  }
                  description={
                    item.success
                      ? `${item.reportcount} rapport(s), ${item.doctorcount} médecin(s), ${item.hospitalcount} hôpital(aux) — Emails: ${item.emailsent?.join(', ') || 'aucun'}`
                      : item.errorMessage
                  }
                />
              </List.Item>
            )}
          />

          {summary.archive && (
            <div style={{ marginTop: 16, padding: 12, background: '#fafafa', borderRadius: 4 }}>
              <b>Archive:</b>{' '}
              {summary.archive.deletedCount >= 0
                ? `${summary.archive.deletedCount} fichier(s) supprimé(s) après ${summary.archive.nbDays} jours (avant le ${new Date(summary.archive.cutoffDate).toLocaleDateString('fr-FR')})`
                : "Erreur lors de l'archivage"}
            </div>
          )}
        </>
      )}
    </Card>
  );
}

export default ProcessingSummary;