import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Edit2,
  Eye,
  FileText,
  Image,
  Newspaper,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import { PAGE_STYLES } from '../lib/pageStyles.js';
import { contentService } from '../services/content.js';
import { newsService } from '../services/news.js';
import { CustomSelect } from '../components/CustomSelect.jsx';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog.jsx';

const categories = ['All', 'Announcement', 'Drama', 'Romance', 'Platform', 'Feature', 'Business', 'Tech', 'Editorial'];
const catBadge = {
  Announcement: 'b-accent',
  Drama: 'b-purple',
  Romance: 'b-red',
  Platform: 'b-accent',
  Feature: 'b-blue',
  Business: 'b-yellow',
  Tech: 'b-purple',
  Editorial: 'b-green',
};

const emptyForm = {
  title: '',
  category: 'Announcement',
  excerpt: '',
  content: '',
  thumbnail_url: '',
  status: 'draft',
};

const itemId = item => item.id || item._id || item.slug;
const getCategory = item => item.category || (Array.isArray(item.genre) ? item.genre[0] : item.genre) || 'Announcement';
const getExcerpt = item => item.excerpt || item.description || item.body?.slice?.(0, 180) || 'No excerpt added.';
const getStatus = item => item.status || (item.is_published ? 'published' : 'draft');
const getDate = item => item.published_at || item.created_at || item.updated_at || item.release_year;
const getThumb = item => item.thumbnail_url || item.poster_url || item.thumbnail || item.poster || '';

const normalizeArticle = item => ({
  ...item,
  id: itemId(item),
  category: getCategory(item),
  excerpt: getExcerpt(item),
  status: getStatus(item),
  date: getDate(item),
  thumbnail_url: getThumb(item),
});

const slugify = value => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export function NewsManagerSection() {
  const [news, setNews] = useState([]);
  const [pagination, setPagination] = useState({ total: 0 });
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [status, setStatus] = useState('All');
  const [selectedId, setSelectedId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
  useEffect(() => { fetchNews(); }, [q, cat]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      try {
        const params = { page: 1, limit: 50 };
        if (cat !== 'All') params.category = cat.toLowerCase();
        const response = await newsService.getAll(params);
        const data = response.data || {};
        const rows = data.articles || data.items || [];
        setNews(rows.map(normalizeArticle));
        setPagination(data.pagination || { total: rows.length });
        if (!selectedId && rows[0]) setSelectedId(itemId(rows[0]));
        return;
      } catch {
        const params = { type: 'news', search: q, limit: 50, sort: 'newest' };
        if (cat !== 'All') params.genre = cat;
        const response = await contentService.getContent(params);
        const data = response.data || {};
        const rows = data.content || data.items || [];
        setNews((Array.isArray(rows) ? rows : []).map(normalizeArticle));
        setPagination(data.pagination || { total: Array.isArray(rows) ? rows.length : 0 });
        if (!selectedId && rows[0]) setSelectedId(itemId(rows[0]));
      }
    } catch (e) {
      setError(e.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => news.filter(item => {
    const matchesQuery = !q || `${item.title} ${item.excerpt} ${item.category}`.toLowerCase().includes(q.toLowerCase());
    const matchesStatus = status === 'All' || item.status === status.toLowerCase();
    return matchesQuery && matchesStatus;
  }), [news, q, status]);

  const selected = filtered.find(item => item.id === selectedId) || filtered[0] || null;

  const stats = useMemo(() => ({
    total: pagination.total || news.length,
    published: news.filter(item => item.status === 'published').length,
    draft: news.filter(item => item.status !== 'published').length,
    withMedia: news.filter(item => item.thumbnail_url).length,
  }), [news, pagination.total]);

  const setF = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = item => {
    setEditing(item);
    setForm({
      title: item.title || '',
      category: item.category || 'Announcement',
      excerpt: item.excerpt || '',
      content: item.body || item.content || '',
      thumbnail_url: item.thumbnail_url || '',
      status: item.status || 'draft',
    });
    setShowModal(true);
  };

  const close = () => {
    setShowModal(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const newsPayload = () => ({
    title: form.title.trim(),
    slug: editing?.slug || slugify(form.title),
    body: form.content.trim() || form.excerpt.trim(),
    excerpt: form.excerpt.trim(),
    category: form.category.toLowerCase(),
    thumbnail_url: form.thumbnail_url.trim() || null,
    tags: [form.category],
    is_published: form.status === 'published',
  });

  const legacyPayload = () => ({
    title: form.title.trim(),
    type: 'news',
    description: form.excerpt.trim() || form.content.trim(),
    language: 'Hindi',
    genre: [form.category],
    release_year: new Date().getFullYear(),
    rating: 'U',
    thumbnail_url: form.thumbnail_url.trim() || undefined,
    is_free: true,
    price_tvod: 0,
  });

  const submit = async event => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      try {
        if (editing) await newsService.update(itemId(editing), newsPayload());
        else await newsService.create(newsPayload());
      } catch {
        if (editing) await contentService.updateContent(itemId(editing), legacyPayload());
        else await contentService.createContent(legacyPayload());
      }
      close();
      fetchNews();
    } catch (e) {
      setError(e.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const archive = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      try {
        await newsService.remove(deleteTarget.id);
      } catch {
        await contentService.archiveContent(deleteTarget.id);
      }
      setDeleteTarget(null);
      fetchNews();
    } catch (e) {
      setError(e.message || 'Failed to archive article');
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleStatus = async item => {
    try {
      try {
        await newsService.publish(itemId(item));
      } catch {
        await contentService.updateStatus(itemId(item), item.status === 'published' ? 'draft' : 'published');
      }
      fetchNews();
    } catch (e) {
      setError(e.message || 'Failed to update article status');
    }
  };

  return (
    <div className={`page news-manager-page ${visible ? 'visible' : ''}`}>
      <div className="page-inner news-shell">
        <div className="news-hero">
          <div>
            <div className="news-eyebrow"><Newspaper size={14}/> Editorial Desk</div>
            <h1>News Manager</h1>
            <p>Plan, review, publish, and archive Camcine articles from one focused workspace.</p>
          </div>
          <div className="news-hero-actions">
            <button className="btn btn-secondary btn-sm" onClick={fetchNews} disabled={loading}>
              <RefreshCw size={13} className={loading ? 'spin-icon' : ''}/>Refresh
            </button>
            <button className="btn btn-primary" onClick={openAdd}><Plus size={14}/>Write Article</button>
          </div>
        </div>

        <div className="news-stats">
          {[
            ['Total Articles', stats.total, FileText],
            ['Published', stats.published, CheckCircle2],
            ['Drafts', stats.draft, Edit2],
            ['With Media', stats.withMedia, Image],
          ].map(([label, value, Icon]) => (
            <div className="news-stat" key={label}>
              <div className="news-stat-icon"><Icon size={18}/></div>
              <div>
                <span>{label}</span>
                <strong>{Number(value || 0).toLocaleString()}</strong>
              </div>
            </div>
          ))}
        </div>

        <div className="news-toolbar">
          <div className="fsearch news-search">
            <Search size={15}/>
            <input placeholder="Search headline, category, excerpt..." value={q} onChange={e => setQ(e.target.value)}/>
          </div>
          <CustomSelect value={cat} onChange={setCat} options={categories} />
          <CustomSelect value={status} onChange={setStatus} options={['All', 'Published', 'Draft']} />
        </div>

        {error && <div className="api-error"><AlertCircle size={15}/>{error}</div>}

        <div className="news-workspace">
          <section className="news-list-panel">
            <div className="news-panel-head">
              <div>
                <h2>Article Queue</h2>
                <p>{filtered.length} visible articles</p>
              </div>
              <span className="badge b-gray">Newest first</span>
            </div>

            {loading ? (
              <div className="loader"><span className="spin"/>Loading articles...</div>
            ) : filtered.length ? (
              <div className="news-table">
                <div className="news-table-head">
                  <span>Story</span>
                  <span>Category</span>
                  <span>Status</span>
                  <span>Date</span>
                  <span>Actions</span>
                </div>
                {filtered.map(item => (
                  <button
                    type="button"
                    key={item.id}
                    className={`news-row ${selected?.id === item.id ? 'active' : ''}`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <span className="news-story-cell">
                      <span className="news-thumb">
                        {item.thumbnail_url ? <img src={item.thumbnail_url} alt="" /> : <Newspaper size={17}/>}
                      </span>
                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.excerpt}</small>
                      </span>
                    </span>
                    <span><span className={`badge ${catBadge[item.category] || 'b-gray'}`}>{item.category}</span></span>
                    <span><span className={`badge ${item.status === 'published' ? 'b-green' : 'b-yellow'}`}>{item.status}</span></span>
                    <span className="news-date"><Calendar size={12}/>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</span>
                    <span className="news-actions" onClick={event => event.stopPropagation()}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(item)} title="Edit"><Edit2 size={13}/></button>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => toggleStatus(item)} title="Publish or unpublish"><Eye size={13}/></button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => setDeleteTarget({ id: item.id, title: item.title || 'this article' })} title="Archive"><Trash2 size={13}/></button>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty"><Newspaper size={34}/><p>No articles match these filters</p></div>
            )}
          </section>

          <aside className="news-preview-panel">
            {selected ? (
              <>
                <div className="preview-media">
                  {selected.thumbnail_url ? <img src={selected.thumbnail_url} alt="" /> : <Newspaper size={44}/>}
                  <div className="preview-media-overlay">
                    <span className={`badge ${selected.status === 'published' ? 'b-green' : 'b-yellow'}`}>{selected.status}</span>
                  </div>
                </div>
                <div className="preview-body">
                  <div className="preview-meta">
                    <span className={`badge ${catBadge[selected.category] || 'b-gray'}`}>{selected.category}</span>
                    <span>{selected.date ? new Date(selected.date).toLocaleDateString() : 'Unscheduled'}</span>
                  </div>
                  <h2>{selected.title}</h2>
                  <p>{selected.excerpt}</p>
                  <div className="preview-actions">
                    <button className="btn btn-primary" onClick={() => openEdit(selected)}><Edit2 size={14}/>Edit Story</button>
                    <button className="btn btn-secondary" onClick={() => toggleStatus(selected)}><Send size={14}/>{selected.status === 'published' ? 'Unpublish' : 'Publish'}</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty"><Newspaper size={34}/><p>Select an article to preview it</p></div>
            )}
          </aside>
        </div>
      </div>

      {showModal && (
        <div className="modal-bg" onClick={event => event.target === event.currentTarget && close()}>
          <div className="modal-box news-modal">
            <div className="modal-hdr">
              <h3>{editing ? 'Edit Article' : 'Write Article'}</h3>
              <button className="modal-close" onClick={close}><X size={15}/></button>
            </div>
            <form onSubmit={submit}>
              <div className="form-grid-2">
                <div className="fg">
                  <label className="lbl">Title *</label>
                  <input className="inp" value={form.title} onChange={e => setF('title', e.target.value)} required placeholder="Article headline"/>
                </div>
                <div className="fg">
                  <label className="lbl">Category</label>
                  <CustomSelect className="inp" value={form.category} onChange={value => setF('category', value)} options={categories.filter(item => item !== 'All')} />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="fg">
                  <label className="lbl">Status</label>
                  <CustomSelect className="inp" value={form.status} onChange={value => setF('status', value)} options={[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }]} />
                </div>
                <div className="fg">
                  <label className="lbl">Thumbnail URL</label>
                  <input className="inp" value={form.thumbnail_url} onChange={e => setF('thumbnail_url', e.target.value)} placeholder="https://..."/>
                </div>
              </div>
              <div className="fg">
                <label className="lbl">Excerpt</label>
                <textarea className="inp" rows={3} value={form.excerpt} onChange={e => setF('excerpt', e.target.value)} placeholder="Short editorial summary..." />
              </div>
              <div className="fg">
                <label className="lbl">Article Body</label>
                <textarea className="inp" rows={8} value={form.content} onChange={e => setF('content', e.target.value)} placeholder="Full article content..." />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Article'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        title="Archive article?"
        message={`"${deleteTarget?.title || 'This article'}" will be removed from the news manager.`}
        confirmLabel="Archive"
        loading={deleteLoading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={archive}
      />

      <style>{`${PAGE_STYLES}
        .news-manager-page { padding-top:28px; }
        .news-shell { max-width:1520px; gap:18px; }
        .news-hero {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:20px;
          min-height:148px;
          padding:28px 32px;
          border-radius:8px;
          border:1px solid rgba(255,255,255,.08);
          background:
            linear-gradient(90deg, rgba(204,26,26,.18), rgba(204,26,26,0) 45%),
            #141414;
          box-shadow:0 18px 42px rgba(0,0,0,.22);
        }
        .news-eyebrow {
          display:inline-flex;
          align-items:center;
          gap:8px;
          margin-bottom:10px;
          color:#ff8a8a;
          font-size:11px;
          font-weight:800;
          letter-spacing:.12em;
          text-transform:uppercase;
        }
        .news-hero h1 { margin:0; color:#fff; font-size:34px; font-weight:900; letter-spacing:-.03em; }
        .news-hero p { max-width:640px; margin:7px 0 0; color:rgba(255,255,255,.48); font-size:14px; line-height:1.6; }
        .news-hero-actions { display:flex; align-items:center; gap:10px; flex-shrink:0; }
        .news-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
        .news-stat {
          display:flex;
          align-items:center;
          gap:13px;
          min-height:82px;
          padding:16px;
          border-radius:8px;
          border:1px solid rgba(255,255,255,.07);
          background:#141414;
        }
        .news-stat-icon { width:42px; height:42px; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#ff6b6b; background:rgba(204,26,26,.12); border:1px solid rgba(204,26,26,.22); }
        .news-stat span { display:block; color:rgba(255,255,255,.38); font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:.1em; margin-bottom:5px; }
        .news-stat strong { display:block; color:#fff; font-size:24px; line-height:1; }
        .news-toolbar { display:flex; align-items:center; gap:10px; padding:14px; border-radius:8px; border:1px solid rgba(255,255,255,.07); background:#141414; }
        .news-search { flex:1; min-height:42px; }
        .api-error{display:flex;align-items:center;gap:8px;padding:11px 14px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.18);border-radius:8px;font-size:13px;color:#fca5a5}
        .loader{display:flex;align-items:center;justify-content:center;gap:10px;padding:42px;color:rgba(255,255,255,.35)}
        .news-workspace { display:grid; grid-template-columns:minmax(0,1fr) 390px; gap:18px; align-items:start; }
        .news-list-panel, .news-preview-panel { border:1px solid rgba(255,255,255,.07); border-radius:8px; background:#141414; overflow:hidden; }
        .news-panel-head { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:18px 20px; border-bottom:1px solid rgba(255,255,255,.07); }
        .news-panel-head h2 { margin:0; color:#fff; font-size:16px; font-weight:800; }
        .news-panel-head p { margin:3px 0 0; color:rgba(255,255,255,.35); font-size:12px; }
        .news-table { display:flex; flex-direction:column; }
        .news-table-head, .news-row {
          display:grid;
          grid-template-columns:minmax(0,1fr) 150px 130px 130px 120px;
          align-items:center;
          gap:18px;
        }
        .news-table-head { padding:11px 20px; background:#111; border-bottom:1px solid rgba(255,255,255,.06); color:rgba(255,255,255,.30); font-size:10px; font-weight:900; letter-spacing:.1em; text-transform:uppercase; }
        .news-row {
          width:100%;
          padding:14px 20px;
          border:0;
          border-bottom:1px solid rgba(255,255,255,.06);
          background:transparent;
          color:inherit;
          text-align:left;
          cursor:pointer;
          font-family:inherit;
          transition:background .15s, box-shadow .15s;
        }
        .news-row:last-child { border-bottom:0; }
        .news-row:hover, .news-row.active { background:rgba(255,255,255,.035); box-shadow:inset 3px 0 0 rgba(204,26,26,.85); }
        .news-row > span { min-width:0; }
        .news-story-cell { display:flex; align-items:center; gap:12px; min-width:0; overflow:hidden; }
        .news-thumb { width:58px; height:42px; flex-shrink:0; border-radius:6px; overflow:hidden; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,.05); color:rgba(255,255,255,.28); border:1px solid rgba(255,255,255,.07); }
        .news-thumb img { width:100%; height:100%; object-fit:cover; }
        .news-story-cell > span:last-child { min-width:0; overflow:hidden; }
        .news-story-cell strong { display:block; color:#fff; font-size:13.5px; line-height:1.35; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .news-story-cell small { display:block; max-width:100%; color:rgba(255,255,255,.42); font-size:12px; line-height:1.35; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .news-date { display:flex; align-items:center; gap:6px; color:rgba(255,255,255,.42); font-size:12px; }
        .news-actions { display:flex; justify-content:flex-end; gap:6px; }
        .news-preview-panel { position:sticky; top:24px; min-height:520px; }
        .preview-media { position:relative; height:220px; display:flex; align-items:center; justify-content:center; background:#101010; color:rgba(255,255,255,.20); overflow:hidden; }
        .preview-media img { width:100%; height:100%; object-fit:cover; }
        .preview-media::after { content:''; position:absolute; inset:0; background:linear-gradient(180deg, transparent 20%, rgba(0,0,0,.72)); }
        .preview-media-overlay { position:absolute; left:16px; bottom:14px; z-index:1; }
        .preview-body { padding:20px; }
        .preview-meta { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:14px; color:rgba(255,255,255,.35); font-size:12px; }
        .preview-body h2 { color:#fff; font-size:22px; line-height:1.15; letter-spacing:-.02em; margin:0 0 12px; }
        .preview-body p { color:rgba(255,255,255,.50); font-size:13.5px; line-height:1.65; margin:0; }
        .preview-actions { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:22px; }
        .news-modal { max-width:760px; }
        .news-modal form { display:flex; flex-direction:column; gap:16px; }
        .news-modal textarea { resize:vertical; }
        @media(max-width:1200px){
          .news-workspace{grid-template-columns:1fr}
          .news-preview-panel{position:static}
          .news-table-head{display:none}
          .news-row{grid-template-columns:1fr; gap:10px}
          .news-actions{justify-content:flex-start}
        }
        @media(max-width:900px){
          .news-hero{align-items:stretch; flex-direction:column}
          .news-hero-actions{justify-content:flex-start}
          .news-stats{grid-template-columns:repeat(2,1fr)}
          .news-toolbar{align-items:stretch; flex-direction:column}
          .news-search{width:100%}
        }
        @media(max-width:560px){
          .news-stats{grid-template-columns:1fr}
          .news-hero h1{font-size:28px}
          .preview-actions{grid-template-columns:1fr}
        }
      `}</style>
    </div>
  );
}
