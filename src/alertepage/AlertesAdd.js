import React, { useState,  useRef } from 'react';
// @ts-ignore
import { Button, Input, message ,Select} from 'antd';
// @ts-ignore
import {  SaveOutlined,  } from '@ant-design/icons';
// @ts-ignore
import {  create } from '../api/api';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
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
const AlertesAdd = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(true);
  const [commentFr, setCommentFr] = useState('');
  const [commentEn, setCommentEn] = useState('');
  const [contentFr, setContentFr] = useState('');
  const [contentEn, setContentEn] = useState('');

  const fileFrRef = useRef(null);
  const fileEnRef = useRef(null);

  const handleWordImport = async (file, setContent) => {
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setContent(result.value);
      message.success('Document importé avec succès.');
    } catch {
      message.error("Impossible de lire le fichier Word.");
    }
  };

  const handleSave = async () => {
    if (!commentFr || !commentEn) {
      message.warning('Les commentaires FR et EN sont obligatoires.');
      return;
    }

    setSaving(true);

    try {
await create('NewsPointers', {
  newsCommentFrench:  commentFr,
  newsCommentEnglish: commentEn,
  newsContentFrench:  contentFr,
  newsContentEnglish: contentEn,
  newsActive: status ? '1' : '0',
});
      message.success('News créée avec succès.');
      navigate('/mainpage/alertes');

    } catch {
      message.error("Impossible d'ajouter une news.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2>Créer une news</h2>

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
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600 }}>Statut</label>
          <div>
        <Select
          value={status}
          onChange={setStatus}
          options={[
            { value: true, label: 'Actif' },
            { value: false, label: 'Inactif' },
          ]}
        />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AlertesAdd;