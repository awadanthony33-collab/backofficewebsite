import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import { Button, Input, message, Spin, Tag } from 'antd';
// @ts-ignore
import { SaveOutlined, ArrowLeftOutlined, FolderOpenOutlined } from '@ant-design/icons';
// @ts-ignore
import { getById, update } from '../api/api';
// @ts-ignore
import { useNavigate, useParams } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────────────────────
   EditorSection
───────────────────────────────────────────────────────────────────────────── */
const EditorSection = ({ lang, comment, setComment, content, setContent, folderRef, handleFolderImport }) => {

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
  <body>${content || '<em style="color:#999">Importez un dossier Word (HTM + images).</em>'}</body>
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

          {/* ✅ Folder picker — selects the whole Word export folder */}
          <input
            type="file"
            ref={folderRef}
            style={{ display: 'none' }}
            multiple
            // @ts-ignore
            webkitdirectory=""
            onChange={e => {
              handleFolderImport(e.target.files, setContent);
              e.target.value = '';
            }}
          />

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {content && (
              <Button danger size="small" onClick={() => setContent('')}>
                Effacer
              </Button>
            )}
            <Button
              icon={<FolderOpenOutlined />}
              onClick={() => folderRef.current?.click()}
            >
              📁 Importer dossier Word
            </Button>
          </div>
        </div>

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

  const folderFrRef = useRef(null);
  const folderEnRef = useRef(null);

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

  /* ── Folder import — reads HTM + converts all images to base64 ───── */
  const handleFolderImport = async (files, setContent) => {
    if (!files || files.length === 0) return;

    const allFiles = Array.from(files);

    // 1️⃣ Find the .htm / .html file
    const htmFile = allFiles.find(f =>
      f.name.toLowerCase().endsWith('.htm') ||
      f.name.toLowerCase().endsWith('.html')
    );

    if (!htmFile) {
      message.error('Aucun fichier .htm trouvé dans le dossier.');
      return;
    }

    // 2️⃣ Build image map: filename → File
    const imageMap = {};
    allFiles
      .filter(f => f.type.startsWith('image/'))
      .forEach(f => {
        imageMap[f.name.toLowerCase()] = f;
      });

    // 3️⃣ Read the HTM file
    const buffer = await htmFile.arrayBuffer();

    const peek = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(buffer, 0, 2048));
    const charsetMatch = peek.match(/charset=["']?\s*([^"'\s;>]+)/i);
    const declared = charsetMatch ? charsetMatch[1].toLowerCase().trim() : 'utf-8';
    const knownAliases = { 'iso-8859-1': 'windows-1252', 'latin-1': 'windows-1252', 'win-1252': 'windows-1252' };
    const encoding = knownAliases[declared] ?? declared;

    let raw;
    try {
      raw = new TextDecoder(encoding, { fatal: true }).decode(buffer);
    } catch {
      raw = new TextDecoder('windows-1252', { fatal: false }).decode(buffer);
    }

    // 4️⃣ Parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(raw, 'text/html');

    // Move <style> from <head> into <body> before removing head
    doc.querySelectorAll('head style').forEach(styleEl => {
      doc.body.insertBefore(styleEl.cloneNode(true), doc.body.firstChild);
    });
    doc.querySelectorAll('script, meta, link, noscript, head').forEach(el => el.remove());

    const body = doc.body;
    if (!body) { message.error('Aucun contenu trouvé.'); return; }

    // 5️⃣ Find all local images and convert to base64
    const imgEls = [...body.querySelectorAll('img')].filter(img => {
      const src = img.getAttribute('src') || '';
      return !src.startsWith('data:') && !src.startsWith('http');
    });

    if (imgEls.length > 0) {
      message.loading({ content: `Intégration de ${imgEls.length} image(s)…`, key: 'img' });

      await Promise.all(imgEls.map(img => new Promise(resolve => {
        const src      = img.getAttribute('src') || '';
        // Extract filename only e.g. "Doc1_files/image001.png" → "image001.png"
        const fileName = src.split('/').pop().split('\\').pop().toLowerCase();
        const file     = imageMap[fileName];

        if (!file) {
          message.warning(`Image introuvable: ${fileName}`);
          img.remove();
          resolve();
          return;
        }

        const reader = new FileReader();
        reader.onload = ev => {

          img.setAttribute('src', ev.target.result);
          resolve();
        };
        reader.onerror = () => { img.remove(); resolve(); };
        reader.readAsDataURL(file);
      })));

      message.success({ content: `${imgEls.length} image(s) intégrées.`, key: 'img' });
    }

    // 6️⃣ Clean whitespace-only text nodes
    body.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) node.remove();
    });

    const clean = body.innerHTML.trim();
    if (!clean) { message.warning('Le fichier HTML semble vide.'); return; }

    setContent(clean);
    message.success(`Importé avec succès (encodage: ${encoding}, ${imgEls.length} image(s) intégrées).`);
  };

  /* ── Save ────────────────────────────────────────────────────────── */
  const handleSave = async () => {
    if (!commentFr || !commentEn) {
      message.warning('Les titres FR et EN sont obligatoires.');
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
            folderRef={folderFrRef}
            handleFolderImport={handleFolderImport}
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
            folderRef={folderEnRef}
            handleFolderImport={handleFolderImport}
          />
        </div>

      </div>
    </div>
  );
};

export default AlertesEdit;