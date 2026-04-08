import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import { Button, Input, message, Tabs, Spin } from 'antd';
// @ts-ignore
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
// @ts-ignore
import { getById, update } from '../api/api';
// @ts-ignore
import { useNavigate, useParams } from 'react-router-dom';
// @ts-ignore
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
// @ts-ignore
import mammoth from 'mammoth';

// ── Quill toolbar config ──────────────────────────────────────────────
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [{ font: [] }, { size: [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['clean'],
  ],
};

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
      navigate('/mainpage/news');
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

  // ── Editor section (reused for FR and EN) ─────────────────────────
  const EditorSection = ({ lang, comment, setComment, content, setContent, fileRef }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Title / Comment */}
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

      {/* Content */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label style={{ fontWeight: 600 }}>Contenu ({lang})</label>

          {/* Word import button */}
          <>
            <input
              type="file"
              accept=".docx"
              ref={fileRef}
              style={{ display: 'none' }}
              onChange={e => {
                handleWordImport(e.target.files?.[0], setContent);
                e.target.value = ''; // reset so same file can be re-selected
              }}
            />
            <Button
              icon={<UploadOutlined />}
              onClick={() => fileRef.current?.click()}
            >
              Importer depuis Word (.docx)
            </Button>
          </>
        </div>

        {/* Quill rich text editor */}
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          style={{ height: 350, marginBottom: 50 }}
        />
      </div>
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
            onClick={() => navigate('/mainpage/news')}
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

      {/* Tabs FR / EN */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key:   'fr',
            label: '🇫🇷 Français',
            children: (
              <EditorSection
                lang="FR"
                comment={commentFr}  setComment={setCommentFr}
                content={contentFr}  setContent={setContentFr}
                fileRef={fileFrRef}
              />
            ),
          },
          {
            key:   'en',
            label: '🇬🇧 English',
            children: (
              <EditorSection
                lang="EN"
                comment={commentEn}  setComment={setCommentEn}
                content={contentEn}  setContent={setContentEn}
                fileRef={fileEnRef}
              />
            ),
          },
        ]}
      />

    </div>
  );

};

export default AlertesEdit;