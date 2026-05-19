import { useEffect, useState } from 'react';
import { AlertCircle, Clock, Edit2, Eye, Music, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { PAGE_STYLES } from '../lib/pageStyles.js';
import { contentService } from '../services/content.js';
import { CustomSelect } from '../components/CustomSelect.jsx';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog.jsx';

const genres = ['Music', 'Pop', 'Hip-Hop', 'R&B', 'Electronic', 'Rock', 'Indie', 'Classical', 'Jazz'];
const emptyForm = { title: '', artist: '', album: '', genre: 'Music', duration: '' };

function parseDuration(value) {
  if (!value) return undefined;
  if (/^\d+$/.test(value)) return Number(value);
  const parts = value.split(':').map(Number);
  if (parts.some(Number.isNaN)) return undefined;
  return parts.length === 2 ? (parts[0] * 60) + parts[1] : (parts[0] * 3600) + (parts[1] * 60) + parts[2];
}

function durationLabel(seconds) {
  if (!seconds) return 'N/A';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function SongsSection({ onNavigate, onSelectContent }) {
  const [songs, setSongs] = useState([]);
  const [pagination, setPagination] = useState({ total: 0 });
  const [q, setQ] = useState('');
  const [visible, setVisible] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
  useEffect(() => { fetchSongs(); }, [q]);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await contentService.getContent({ type: 'song', search: q, limit: 50, sort: 'newest' });
      const data = res.data || {};
      const list = data.content || data.items || data || [];
      setSongs(Array.isArray(list) ? list : []);
      setPagination(data.pagination || { total: Array.isArray(list) ? list.length : 0 });
    } catch (e) {
      setError(e.message || 'Failed to fetch songs');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowAdd(true); };
  const openEdit = song => {
    setEditing(song);
    setForm({
      title: song.title || '',
      artist: song.director || '',
      album: song.album || '',
      genre: Array.isArray(song.genre) ? song.genre[0] || 'Music' : song.genre || 'Music',
      duration: song.duration_seconds ? durationLabel(song.duration_seconds) : '',
    });
    setShowAdd(true);
  };

  const openDetail = id => {
    if (onSelectContent) onSelectContent(id);
    if (onNavigate) onNavigate('content-detail');
  };
  const close = () => { setShowAdd(false); setEditing(null); setForm(emptyForm); };
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async e => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const payload = {
        title: form.title.trim(),
        type: 'song',
        description: [form.artist, form.album].filter(Boolean).join(' - '),
        language: 'Hindi',
        genre: [form.genre],
        director: form.artist.trim() || undefined,
        release_year: new Date().getFullYear(),
        rating: 'U',
        is_free: true,
        price_tvod: 0,
        duration_seconds: parseDuration(form.duration),
      };
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
      if (editing) await contentService.updateContent(editing.id || editing._id, payload);
      else await contentService.createContent(payload);
      close();
      fetchSongs();
    } catch (e2) {
      setError(e2.message || 'Failed to save song');
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await contentService.archiveContent(deleteTarget.id);
      setDeleteTarget(null);
      fetchSongs();
    } catch (e) {
      setError(e.message || 'Failed to archive song');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className={`page ${visible ? 'visible' : ''}`}>
      <div className="page-inner">
        <div className="ph">
          <div className="ph-left"><h1>Songs</h1><p>{pagination.total || songs.length} tracks from backend</p></div>
          <div className="ph-right">
            <button className="btn btn-secondary btn-sm" onClick={fetchSongs} disabled={loading}><RefreshCw size={13} className={loading ? 'spin-icon' : ''}/>Refresh</button>
            <button className="btn btn-primary" onClick={openAdd}><Plus size={14}/>Add Song</button>
          </div>
        </div>

        <div className="fbar">
          <div className="fsearch" style={{flex:1}}>
            <Search size={15} style={{color:'rgba(255,255,255,.30)',flexShrink:0}}/>
            <input placeholder="Search songs..." value={q} onChange={e => setQ(e.target.value)}/>
            {q && <button onClick={() => setQ('')} style={{background:'none',border:'none',color:'rgba(255,255,255,.30)',cursor:'pointer',padding:0}}><X size={14}/></button>}
          </div>
        </div>

        {error && <div className="api-error"><AlertCircle size={15}/>{error}</div>}

        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Song</th><th>Artist</th><th>Genre</th><th>Duration</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6}><div className="loader"><span className="spin"/>Loading songs...</div></td></tr>
              ) : songs.length ? songs.map(song => (
                <tr key={song.id || song._id}>
                  <td><div style={{fontWeight:700,fontSize:13}}>{song.title}</div><div style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>{song.description}</div></td>
                  <td style={{fontSize:13,color:'rgba(255,255,255,.55)'}}>{song.director || 'N/A'}</td>
                  <td><span className="badge b-gray">{Array.isArray(song.genre) ? song.genre[0] : song.genre || 'Music'}</span></td>
                  <td style={{fontSize:12,color:'rgba(255,255,255,.45)',display:'flex',alignItems:'center',gap:4}}><Clock size={11}/>{durationLabel(song.duration_seconds)}</td>
                  <td><span className={`badge ${song.status === 'published' ? 'b-green' : 'b-yellow'}`}>{song.status || 'draft'}</span></td>
                  <td><div style={{display:'flex',gap:6,justifyContent:'flex-end'}}>
                    <button className="btn btn-ghost btn-icon btn-sm" title="View Details" onClick={() => openDetail(song.id || song._id)}><Eye size={13}/></button>
                    <button className="btn btn-ghost btn-icon btn-sm" title="Edit Metadata" onClick={() => openEdit(song)}><Edit2 size={13}/></button>
                    <button className="btn btn-danger btn-icon btn-sm" title="Archive" onClick={() => setDeleteTarget({ id: song.id || song._id, title: song.title || 'this song' })}><Trash2 size={13}/></button>
                  </div></td>
                </tr>
              )) : (
                <tr><td colSpan={6}><div className="empty"><Music size={32}/><p>No songs found</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && close()}>
          <div className="modal-box">
            <div className="modal-hdr"><h3>{editing ? 'Edit Song' : 'Add Song'}</h3><button className="modal-close" onClick={close}><X size={15}/></button></div>
            <form onSubmit={submit}>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div className="fg"><label className="lbl">Title *</label><input className="inp" value={form.title} onChange={e => setF('title', e.target.value)} required/></div>
                <div className="form-grid-2">
                  <div className="fg"><label className="lbl">Artist</label><input className="inp" value={form.artist} onChange={e => setF('artist', e.target.value)}/></div>
                  <div className="fg"><label className="lbl">Album</label><input className="inp" value={form.album} onChange={e => setF('album', e.target.value)}/></div>
                </div>
                <div className="form-grid-2">
                  <div className="fg"><label className="lbl">Genre</label><CustomSelect className="inp" value={form.genre} onChange={value => setF('genre', value)} options={genres} /></div>
                  <div className="fg"><label className="lbl">Duration</label><input className="inp" value={form.duration} onChange={e => setF('duration', e.target.value)} placeholder="3:45 or seconds"/></div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Song'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        title="Archive song?"
        message={`"${deleteTarget?.title || 'This song'}" will be moved to archived content.`}
        confirmLabel="Archive"
        loading={deleteLoading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={del}
      />

      <style>{`${PAGE_STYLES}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spin-icon{animation:spin .75s linear infinite}
        .spin{width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.12);border-top-color:rgba(255,255,255,.55);display:inline-block;animation:spin .75s linear infinite}
        .loader{display:flex;align-items:center;justify-content:center;gap:10px;padding:30px;color:rgba(255,255,255,.35)}
        .api-error{display:flex;align-items:center;gap:8px;padding:11px 14px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.18);border-radius:10px;font-size:13px;color:#fca5a5;margin-bottom:12px}
      `}</style>
    </div>
  );
}
