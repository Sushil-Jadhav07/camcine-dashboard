import { useEffect, useState } from 'react';
import { AlertCircle, Calendar, Edit2, Eye, Newspaper, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { PAGE_STYLES } from '../lib/pageStyles.js';
import { contentService } from '../services/content.js';

const categories = ['All', 'Platform', 'Feature', 'Business', 'Tech', 'Editorial'];
const catBadge = { Platform:'b-accent', Feature:'b-blue', Business:'b-yellow', Tech:'b-purple', Editorial:'b-green' };
const emptyForm = { title: '', category: 'Platform', excerpt: '', content: '' };

const getCategory = item => Array.isArray(item.genre) ? item.genre[0] : item.genre || 'Platform';
const itemId = item => item.id || item._id;

export function NewsManagerSection() {
  const [news, setNews] = useState([]);
  const [pagination, setPagination] = useState({ total: 0 });
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
  useEffect(() => { fetchNews(); }, [q, cat]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { type: 'news', search: q, limit: 50, sort: 'newest' };
      if (cat !== 'All') params.genre = cat;
      const res = await contentService.getContent(params);
      const data = res.data || {};
      const list = data.content || data.items || data || [];
      setNews(Array.isArray(list) ? list : []);
      setPagination(data.pagination || { total: Array.isArray(list) ? list.length : 0 });
    } catch (e) {
      setError(e.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = item => {
    setEditing(item);
    setForm({
      title: item.title || '',
      category: getCategory(item),
      excerpt: item.description || '',
      content: item.content || '',
    });
    setShowModal(true);
  };
  const close = () => { setShowModal(false); setEditing(null); setForm(emptyForm); };

  const payloadFromForm = () => ({
    title: form.title.trim(),
    type: 'news',
    description: form.excerpt.trim() || form.content.trim(),
    language: 'Hindi',
    genre: [form.category],
    release_year: new Date().getFullYear(),
    rating: 'U',
    is_free: true,
    price_tvod: 0,
  });

  const submit = async e => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      if (editing) await contentService.updateContent(itemId(editing), payloadFromForm());
      else await contentService.createContent(payloadFromForm());
      close();
      fetchNews();
    } catch (e2) {
      setError(e2.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const archive = async id => {
    if (!confirm('Archive this article?')) return;
    try {
      await contentService.archiveContent(id);
      fetchNews();
    } catch (e) {
      setError(e.message || 'Failed to archive article');
    }
  };

  const toggleStatus = async item => {
    try {
      await contentService.updateStatus(itemId(item), item.status === 'published' ? 'draft' : 'published');
      fetchNews();
    } catch (e) {
      setError(e.message || 'Failed to update article status');
    }
  };

  return (
    <div className={`page ${visible ? 'visible' : ''}`}>
      <div className="page-inner">
        <div className="ph">
          <div className="ph-left"><h1>News Manager</h1><p>{pagination.total || news.length} articles from backend</p></div>
          <div className="ph-right">
            <button className="btn btn-secondary btn-sm" onClick={fetchNews} disabled={loading}><RefreshCw size={13} className={loading ? 'spin-icon' : ''}/>Refresh</button>
            <button className="btn btn-primary" onClick={openAdd}><Plus size={14}/>Write Article</button>
          </div>
        </div>

        <div className="tabs">
          {categories.map(c => <button key={c} className={`tab ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
        </div>

        <div className="fbar">
          <div className="fsearch" style={{flex:1}}><Search size={15} style={{color:'rgba(255,255,255,.30)',flexShrink:0}}/><input placeholder="Search articles..." value={q} onChange={e => setQ(e.target.value)}/></div>
        </div>

        {error && <div className="api-error"><AlertCircle size={15}/>{error}</div>}

        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {loading ? (
            <div className="loader"><span className="spin"/>Loading articles...</div>
          ) : news.length ? news.map(item => {
            const category = getCategory(item);
            return (
              <div key={itemId(item)} className="news-card">
                <div className="news-card-body">
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8,flexWrap:'wrap'}}>
                    <span className={`badge ${catBadge[category] || 'b-gray'}`} style={{fontSize:10}}>{category}</span>
                    <span className={`badge ${item.status === 'published' ? 'b-green' : 'b-yellow'}`} style={{fontSize:10}}>{item.status || 'draft'}</span>
                    <span style={{fontSize:11,color:'rgba(255,255,255,.30)',display:'flex',alignItems:'center',gap:4}}><Calendar size={10}/>{item.release_year || item.created_at || 'N/A'}</span>
                  </div>
                  <div style={{fontSize:15,fontWeight:700,color:'#f5f5f5',marginBottom:5,lineHeight:1.35}}>{item.title}</div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,.45)',lineHeight:1.6}}>{item.description || 'No excerpt added.'}</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:6,flexShrink:0}}>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(item)} title="Edit"><Edit2 size={13}/></button>
                  <button className="btn btn-ghost btn-icon btn-sm" title="Toggle status" onClick={() => toggleStatus(item)}><Eye size={13}/></button>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={() => archive(itemId(item))} title="Archive"><Trash2 size={13}/></button>
                </div>
              </div>
            );
          }) : <div className="empty"><Newspaper size={32}/><p>No articles found</p></div>}
        </div>
      </div>

      {showModal && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && close()}>
          <div className="modal-box" style={{maxWidth:640}}>
            <div className="modal-hdr"><h3>{editing ? 'Edit Article' : 'Write Article'}</h3><button className="modal-close" onClick={close}><X size={15}/></button></div>
            <form onSubmit={submit}>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div className="fg"><label className="lbl">Title *</label><input className="inp" value={form.title} onChange={e => setF('title', e.target.value)} required placeholder="Article headline"/></div>
                <div className="fg"><label className="lbl">Category</label><select className="inp fselect" value={form.category} onChange={e => setF('category', e.target.value)}>{categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}</select></div>
                <div className="fg"><label className="lbl">Excerpt</label><textarea className="inp" rows={2} value={form.excerpt} onChange={e => setF('excerpt', e.target.value)} placeholder="Short summary..." style={{resize:'vertical'}}/></div>
                <div className="fg"><label className="lbl">Content</label><textarea className="inp" rows={6} value={form.content} onChange={e => setF('content', e.target.value)} placeholder="Full article content..." style={{resize:'vertical'}}/></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save Changes' : 'Publish Draft'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`${PAGE_STYLES}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spin-icon{animation:spin .75s linear infinite}
        .spin{width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.12);border-top-color:rgba(255,255,255,.55);display:inline-block;animation:spin .75s linear infinite}
        .loader{display:flex;align-items:center;justify-content:center;gap:10px;padding:30px;color:rgba(255,255,255,.35)}
        .api-error{display:flex;align-items:center;gap:8px;padding:11px 14px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.18);border-radius:10px;font-size:13px;color:#fca5a5;margin-bottom:12px}
        .news-card{display:flex;align-items:flex-start;gap:16px;padding:18px 20px;background:#141414;border:1px solid rgba(255,255,255,.07);border-radius:16px;transition:border-color .15s,background .15s}
        .news-card:hover{background:#1a1a1a;border-color:rgba(255,255,255,.12)}
        .news-card-body{flex:1;min-width:0}
      `}</style>
    </div>
  );
}
