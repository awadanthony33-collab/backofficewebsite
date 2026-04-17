import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import { Button, Input, message, Spin, Tabs, Tag } from 'antd';
// @ts-ignore
import { SaveOutlined, ArrowLeftOutlined, EyeOutlined, EditOutlined, FileAddOutlined } from '@ant-design/icons';
// @ts-ignore
import { getById, update } from '../api/api';
// @ts-ignore
import { useNavigate, useParams } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────────────────────
   EditorSection – handles title input + HTML file import + raw/preview tabs
───────────────────────────────────────────────────────────────────────────── */
const EditorSection = ({ lang, comment, setComment, content, setContent, fileRef, handleHtmlImport }) => {
  const [tab, setTab] = useState('edit');

  // Wrap content in a full doc for the preview iframe so styles apply
  const previewDoc = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body { margin: 0; padding: 12px; font-family: Georgia, serif; font-size: 14px; line-height: 1.8; color: #1a1a1a; }
      img { max-width: 100%; }
    </style>
  </head>
  <body>${content || '<em style="color:#999">Aucun contenu à afficher.</em>'}</body>
</html>`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Title */}
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

          {/* Hidden file input */}
          <input
            type="file"
            accept=".html,.htm"
            ref={fileRef}
            style={{ display: 'none' }}
            onChange={e => {
              handleHtmlImport(e.target.files?.[0], setContent);
              e.target.value = '';
            }}
          />

          <Button
            icon={<FileAddOutlined />}
            onClick={() => fileRef.current?.click()}
          >
            Importer depuis HTML (.html)
          </Button>
        </div>

        {/* Edit / Preview tabs */}
        <Tabs
          size="small"
          activeKey={tab}
          onChange={setTab}
          items={[
            {
              key: 'edit',
              label: <span><EditOutlined /> Éditer (HTML)</span>,
              children: (
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Collez ou saisissez du HTML ici…"
                  rows={12}
                  style={{
                    width: '100%',
                    fontFamily: 'monospace',
                    fontSize: 13,
                    border: '1px solid #d9d9d9',
                    borderRadius: 6,
                    padding: 10,
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    lineHeight: 1.6,
                  }}
                />
              ),
            },
            {
              key: 'preview',
              label: <span><EyeOutlined /> Aperçu</span>,
              children: (
                // Use an iframe so <style> blocks inside the stored HTML apply correctly
                <iframe
                  srcDoc={previewDoc}
                  title={`preview-${lang}`}
                  style={{
                    width: '100%',
                    minHeight: 300,
                    border: '1px solid #d9d9d9',
                    borderRadius: 6,
                    background: '#fafafa',
                    display: 'block',
                  }}
                  sandbox="allow-same-origin"
                />
              ),
            },
          ]}
        />

        {/* Character count badge */}
        {content && (
          <div style={{ marginTop: 4, textAlign: 'right' }}>
            <Tag color="blue">{content.length} caractères</Tag>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   AlertesEdit
───────────────────────────────────────────────────────────────────────────── */
const AlertesEdit = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [commentFr, setCommentFr] = useState('');
  const [commentEn, setCommentEn] = useState('');
  const [contentFr, setContentFr] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [record,    setRecord]    = useState(null);

  const fileFrRef = useRef(null);
  const fileEnRef = useRef(null);

  /* ── Fetch existing news ─────────────────────────────────────────── */
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const data = await getById('NewsPointers', id);
        setRecord(data);
        setCommentFr(data.newsCommentFrench  ?? '');
        setCommentEn(data.newsCommentEnglish ?? '');
        setContentFr(data.newsContentFrench  ?? '');
        setContentEn(data.newsContentEnglish ?? '');
      } catch {
        message.error('Impossible de charger le news.');
        navigate('/mainpage/alertes');
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id, navigate]);

  /* ── HTML import ─────────────────────────────────────────────────── */
  const handleHtmlImport = (file, setContent) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const buffer = e.target?.result;
      if (!(buffer instanceof ArrayBuffer)) return;

      // 1️⃣ Peek at the first 2 KB as UTF-8 to find the charset declaration
      const peek = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(buffer, 0, 2048));
      const charsetMatch = peek.match(/charset=["']?\s*([^"'\s;>]+)/i);
      const declared = charsetMatch ? charsetMatch[1].toLowerCase().trim() : 'utf-8';

      const knownAliases = { 'iso-8859-1': 'windows-1252', 'latin-1': 'windows-1252', 'win-1252': 'windows-1252' };
      const encoding = knownAliases[declared] ?? declared;

      // 2️⃣ Decode the whole file with the correct encoding
      let raw;
      try {
        raw = new TextDecoder(encoding, { fatal: true }).decode(buffer);
      } catch {
        raw = new TextDecoder('windows-1252', { fatal: false }).decode(buffer);
      }

      // 3️⃣ Parse
      const parser = new DOMParser();
      const doc = parser.parseFromString(raw, 'text/html');

      // ✅ Move <style> blocks from <head> into <body> BEFORE removing head,
      //    so they are preserved in body.innerHTML and applied when rendered.
      doc.querySelectorAll('head style').forEach(styleEl => {
        doc.body.insertBefore(styleEl.cloneNode(true), doc.body.firstChild);
      });

      // Remove noise: scripts, head, meta, link, noscript (but NOT style – already moved)
      doc.querySelectorAll('script, meta, link, noscript, head').forEach(el => el.remove());

      const body = doc.body;
      if (!body) { message.error("Aucun contenu trouvé dans le fichier HTML."); return; }

      body.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) node.remove();
      });

      const clean = body.innerHTML.trim();
      if (!clean) { message.warning("Le fichier HTML semble vide après nettoyage."); return; }

      setContent(clean);
      message.success(`Fichier HTML importé (encodage: ${encoding}).`);
    };
    reader.onerror = () => message.error("Impossible de lire le fichier HTML.");
    reader.readAsArrayBuffer(file);
  };

  /* ── Save ────────────────────────────────────────────────────────── */
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

  /* ── Loading state ───────────────────────────────────────────────── */
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Spin size="large" />
    </div>
  );

  /* ── Render ──────────────────────────────────────────────────────── */
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

      {/* Two-column editors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 8, padding: 20 }}>
          <h3 style={{ marginTop: 0 }}>🇫🇷 Français</h3>
          <EditorSection
            lang="FR"
            comment={commentFr}
            setComment={setCommentFr}
            content={contentFr}
            setContent={setContentFr}
            fileRef={fileFrRef}
            handleHtmlImport={handleHtmlImport}
          />
        </div>

        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 8, padding: 20 }}>
          <h3 style={{ marginTop: 0 }}>🇬🇧 English</h3>
          <EditorSection
            lang="EN"
            comment={commentEn}
            setComment={setCommentEn}
            content={contentEn}
            setContent={setContentEn}
            fileRef={fileEnRef}
            handleHtmlImport={handleHtmlImport}
          />
        </div>

      </div>
    </div>
  );
};

export default AlertesEdit;