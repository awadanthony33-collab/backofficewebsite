import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import { Button, Input, message, Spin } from 'antd';
// @ts-ignore
import {  SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
// @ts-ignore
import { getById, update } from '../api/api';
// @ts-ignore
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill-new/dist/quill.snow.css';
// @ts-ignore
import mammoth from 'mammoth';


const EditorSection = ({ lang, comment, setComment, content, setContent, fileRef, handleWordImport }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

    <div>
      <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>
        Titre / Commentaire ({lang})
      </label>
      <Input
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder={`Titre ${lang}`}
      />
    </div>

    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <label style={{ fontWeight: 600 }}>Contenu ({lang})</label>

        <input
          type="file"
          accept=".docx"
          ref={fileRef}
          style={{ display: 'none' }}
          onChange={e => {
            handleWordImport(e.target.files?.[0], setContent);
            e.target.value = '';
          }}
        />

        <Button onClick={() => fileRef.current?.click()}>
          Importer depuis Word (.docx)
        </Button>
      </div>
    </div>

  </div>
);
const AlertesEdit = () => {
    const { id }    = useParams();
  const navigate  = useNavigate();

  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [commentFr,  setCommentFr]  = useState('');
  const [commentEn,  setCommentEn]  = useState('');
  const [contentFr,  setContentFr]  = useState('');
  const [contentEn,  setContentEn]  = useState('');
  const [activeTab,  setActiveTab]  = useState('fr');
  const [record,     setRecord]     = useState(null);

  const fileFrRef = useRef(null);
  const fileEnRef = useRef(null);

  // ── Fetch existing news ───────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getById('NewsPointers', id);
        setRecord(data);
        setCommentFr(data.newsCommentFrench  ?? '');
        setCommentEn(data.newsCommentEnglish ?? '');
        setContentFr(data.newsContentFrench  ?? '');
        setContentEn(data.newsContentEnglish ?? '');
      } catch {
        message.error('Impossible de charger le news.');
        navigate('/mainpage/news');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  // ── Word import ───────────────────────────────────────────────────
  const handleWordImport = async (file, setContent) => {
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result      = await mammoth.convertToHtml({ arrayBuffer });
      setContent(result.value);
      message.success('Document importé avec succès.');
    } catch {
      message.error("Impossible de lire le fichier Word.");
    }
  };

  // ── Save ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!commentFr || !commentEn) {
      message.warning('Les commentaires FR et EN sont obligatoires.');
      return;
    }
    setSaving(true);
    try {
      await update('NewsPointers', id, {
        ...record,
        newsCommentFrench:  commentFr,
        newsCommentEnglish: commentEn,
        newsContentFrench:  contentFr,
        newsContentEnglish: contentEn,
      });
      message.success('News mis à jour.');
      navigate('/mainpage/alertes');
    } catch {
      message.error('Impossible de sauvegarder.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Spin size="large" />
    </div>
  );


  // ── Render ────────────────────────────────────────────────────────
  return (
    <div style={{ padding: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/mainpage/alertes')}
          />
          <h2 style={{ margin: 0 }}>Modifier le news #{id}</h2>
        </div>

        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={saving}
          onClick={handleSave}
        >
          Sauvegarder
        </Button>

      </div>

<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
  
  <div>
    <h3>🇫🇷 Français</h3>
    <EditorSection
      lang="FR"
      comment={commentFr}
      setComment={setCommentFr}
      content={contentFr}
      setContent={setContentFr}
      fileRef={fileFrRef}
      handleWordImport={handleWordImport}
    />
  </div>

  <div>
    <h3>🇬🇧 English</h3>
    <EditorSection
      lang="EN"
      comment={commentEn}
      setComment={setCommentEn}
      content={contentEn}
      setContent={setContentEn}
      fileRef={fileEnRef}
      handleWordImport={handleWordImport}
    />
  </div>

</div>

    </div>
  );

};

export default AlertesEdit;