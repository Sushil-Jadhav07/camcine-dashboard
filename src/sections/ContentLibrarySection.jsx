import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Film, Music, Tv, Play, Eye, Star, Grid, List, X, ArrowRight, RefreshCw, AlertCircle, Archive, CheckCircle, Clock } from 'lucide-react';
import { UserRole } from '../constants/sections';
import { PAGE_STYLES } from '../lib/pageStyles.js';
import { contentService } from '../services/content.js';

const typeIcon  = { movie:<Film size={13}/>, show:<Tv size={13}/>, song:<Music size={13}/>, short_film:<Film size={13}/>, news:<Film size={13}/> };
const typeColors = { movie:'b-accent', show:'b-blue', song:'b-green', short_film:'b-yellow', news:'b-purple' };
const statusColors = { published:'b-green', draft:'b-yellow', archived:'b-gray' };

function fmtDuration(secs) {
  if (!secs) return '—';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function ContentLibrarySection({ onNavigate, userRole, onSelectContent }) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page:1, limit:20, total:0, total_pages:1 });
  const [q, setQ] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('published');
  const [sort, setSort] = useState('newest');
  const [view, setView] = useState('grid');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const params = { page, limit: 20, sort };
      if (q) params.search = q;
      if (typeFilter) params.type = typeFilter;
      // Don't filter by status so all content shows (API default shows published)
      const r = await contentService.getContent(params);
      if (r.success) {
        setItems(r.data.content || []);
        setPagination(r.data.pagination || { page:1, total:0, total_pages:1 });
      }
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, [page, q, typeFilter, sort]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  // Debounce search
  const [searchTimeout, setSearchTimeout] = useState(null);
  const handleSearch = (val) => {
    setQ(val);
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => setPage(1), 500));
  };

  const canAdd = userRole === UserRole.ADMIN || userRole === UserRole.MANAGER;
  const canManage = userRole === UserRole.ADMIN;

  const handleArchive = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Archive this content?')) return;
    try {
      const r = await contentService.archiveContent(id);
      if (r.success) fetchContent();
    } catch(e) { alert(e.message); }
  };

  const handlePublish = async (e, id, currentStatus) => {
    e.stopPropagation();
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const r = await contentService.updateStatus(id, newStatus);
      if (r.success) fetchContent();
    } catch(e) { alert(e.message); }
  };

  const openDetail = (id) => {
    if (onSelectContent) onSelectContent(id);
    if (onNavigate) onNavigate('content-detail');
  };

  return (
    <div className={`page ${visible ? 'visible' : ''}`}>
      <div className="page-inner">
        <div className="ph">
          <div className="ph-left">
            <h1>Content Library</h1>
            <p>{pagination.total} titles</p>
          </div>
          <div className="ph-right">
            <button className="btn btn-secondary btn-sm" onClick={fetchContent} disabled={loading}>
              <RefreshCw size={13} className={loading ? 'spin-icon' : ''}/>Refresh
            </button>
            <button className={`btn btn-secondary btn-sm ${view==='grid'?'btn-active':''}`} onClick={() => setView('grid')}><Grid size={14}/></button>
            <button className={`btn btn-secondary btn-sm ${view==='list'?'btn-active':''}`} onClick={() => setView('list')}><List size={14}/></button>
            {canAdd && (
              <button className="btn btn-primary" onClick={() => onNavigate && onNavigate('add-title-type')}>
                <Plus size={14}/>Add Title
              </button>
            )}
          </div>
        </div>

        <div className="fbar">
          <div className="fsearch" style={{flex:1}}>
            <Search size={15} style={{color:'rgba(255,255,255,.30)',flexShrink:0}}/>
            <input placeholder="Search titles, descriptions..." value={q} onChange={e => handleSearch(e.target.value)}/>
            {q && <button onClick={() => { setQ(''); setPage(1); }} style={{background:'none',border:'none',color:'rgba(255,255,255,.30)',cursor:'pointer',padding:0}}><X size={14}/></button>}
          </div>
          <select className="fselect" value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}>
            <option value="">All Types</option>
            <option value="movie">Movie</option>
            <option value="show">TV Show</option>
            <option value="song">Song</option>
            <option value="short_film">Short Film</option>
            <option value="news">News</option>
          </select>
          <select className="fselect" value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">A–Z</option>
            <option value="price_low">Price ↑</option>
            <option value="price_high">Price ↓</option>
          </select>
        </div>

        {error && (
          <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 16px',background:'rgba(239,68,68,.07)',border:'1px solid rgba(239,68,68,.15)',borderRadius:12,color:'#fca5a5',fontSize:13,marginBottom:16}}>
            <AlertCircle size={16}/>{error}
            <button onClick={fetchContent} style={{marginLeft:'auto',background:'rgba(239,68,68,.12)',border:'none',color:'#fca5a5',padding:'4px 10px',borderRadius:7,cursor:'pointer',fontSize:12}}>Retry</button>
          </div>
        )}

        {loading && items.length === 0 ? (
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'60px 0',gap:12,color:'rgba(255,255,255,.30)',fontSize:14}}>
            <span className="ar-spin" style={{width:20,height:20,borderRadius:'50%',border:'2px solid rgba(255,255,255,.10)',borderTopColor:'rgba(255,255,255,.40)',animation:'spin .65s linear infinite',display:'inline-block'}}/>
            Loading content…
          </div>
        ) : view === 'grid' ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:16}}>
            {items.map(c => (
              <div key={c.id} className="cl-card" onClick={() => openDetail(c.id)}>
                <div className="cl-thumb">
                  {c.poster_url
                    ? <img src={c.poster_url} alt={c.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    : <div className="cl-thumb-bg">{c.title?.[0] || '?'}</div>
                  }
                  <div className="cl-thumb-overlay">
                    <div className="cl-play"><Play size={22}/></div>
                    <span className={`badge ${statusColors[c.status] || 'b-gray'}`} style={{position:'absolute',top:10,right:10,fontSize:10}}>{c.status}</span>
                  </div>
                </div>
                <div className="cl-info">
                  <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8,marginBottom:6}}>
                    <div className="cl-title">{c.title}</div>
                    <span className={`badge ${typeColors[c.type]||'b-gray'}`} style={{fontSize:10,flexShrink:0}}>{c.type}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                    {c.genre?.length > 0 && <span style={{fontSize:11,color:'rgba(255,255,255,.38)'}}>{Array.isArray(c.genre)?c.genre[0]:c.genre}</span>}
                    {c.language && <span style={{fontSize:11,color:'rgba(255,255,255,.38)'}}>{c.language}</span>}
                    {c.rating && <span style={{fontSize:11,color:'rgba(255,255,255,.38)'}}>{c.rating}</span>}
                    {c.duration_seconds && <span style={{fontSize:11,color:'rgba(255,255,255,.38)'}}>{fmtDuration(c.duration_seconds)}</span>}
                    {c.is_free ? <span style={{fontSize:10,color:'#4ade80',fontWeight:600}}>FREE</span> : c.price_tvod > 0 ? <span style={{fontSize:10,color:'#fbbf24',fontWeight:600}}>₹{c.price_tvod}</span> : null}
                  </div>
                  {canManage && (
                    <div style={{display:'flex',gap:6,marginTop:10}}>
                      <button className="cl-act-btn" onClick={e => handlePublish(e, c.id, c.status)} title={c.status === 'published' ? 'Set Draft' : 'Publish'}>
                        {c.status === 'published' ? <Clock size={12}/> : <CheckCircle size={12}/>}
                        {c.status === 'published' ? 'Draft' : 'Publish'}
                      </button>
                      <button className="cl-act-btn cl-act-danger" onClick={e => handleArchive(e, c.id)} title="Archive">
                        <Archive size={12}/>Archive
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Title</th><th>Type</th><th>Language</th><th>Duration</th><th>Rating</th><th>Price</th><th>Status</th>{canManage && <th>Actions</th>}</tr></thead>
              <tbody>
                {items.map(c => (
                  <tr key={c.id} style={{cursor:'pointer'}} onClick={() => openDetail(c.id)}>
                    <td style={{fontWeight:600,maxWidth:220}}>{c.title}</td>
                    <td><span className={`badge ${typeColors[c.type]||'b-gray'}`} style={{fontSize:11,display:'flex',alignItems:'center',gap:4,width:'fit-content'}}>{typeIcon[c.type]}{c.type}</span></td>
                    <td style={{color:'rgba(255,255,255,.50)',fontSize:13}}>{c.language || '—'}</td>
                    <td style={{color:'rgba(255,255,255,.50)',fontSize:13}}>{fmtDuration(c.duration_seconds)}</td>
                    <td style={{color:'rgba(255,255,255,.50)',fontSize:13}}>{c.rating || '—'}</td>
                    <td style={{fontSize:13}}>{c.is_free ? <span style={{color:'#4ade80',fontWeight:600}}>Free</span> : c.price_tvod > 0 ? `₹${c.price_tvod}` : '—'}</td>
                    <td><span className={`badge ${statusColors[c.status]||'b-gray'}`}>{c.status}</span></td>
                    {canManage && (
                      <td onClick={e => e.stopPropagation()} style={{display:'flex',gap:6}}>
                        <button className="cl-act-btn" onClick={e => handlePublish(e, c.id, c.status)}>
                          {c.status === 'published' ? <Clock size={11}/> : <CheckCircle size={11}/>}
                          {c.status === 'published' ? 'Draft' : 'Publish'}
                        </button>
                        <button className="cl-act-btn cl-act-danger" onClick={e => handleArchive(e, c.id)}><Archive size={11}/></button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginTop:24}}>
            <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.max(1,p-1))} disabled={page === 1}>← Prev</button>
            <span style={{fontSize:13,color:'rgba(255,255,255,.40)'}}>Page {page} of {pagination.total_pages}</span>
            <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.min(pagination.total_pages,p+1))} disabled={page === pagination.total_pages}>Next →</button>
          </div>
        )}

        {!loading && items.length === 0 && !error && (
          <div className="empty"><Film size={36}/><p>No content found. Try adjusting filters.</p></div>
        )}
      </div>

      <style>{`
        ${PAGE_STYLES}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spin-icon{animation:spin .8s linear infinite}
        .btn-active{background:rgba(204,26,26,.18)!important;border-color:rgba(204,26,26,.35)!important;color:#ff8080!important}
        .cl-card{border-radius:16px;overflow:hidden;background:#141414;border:1px solid rgba(255,255,255,.07);cursor:pointer;transition:border-color .18s,box-shadow .18s,transform .18s}
        .cl-card:hover{border-color:rgba(204,26,26,.25);box-shadow:0 6px 24px rgba(0,0,0,.35);transform:translateY(-3px)}
        .cl-thumb{aspect-ratio:16/9;position:relative;background:#1a1a1a;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .cl-thumb-bg{font-size:48px;font-weight:900;color:rgba(204,26,26,.12);font-family:'Sora',sans-serif;user-select:none}
        .cl-thumb-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.40);opacity:0;transition:opacity .18s}
        .cl-card:hover .cl-thumb-overlay{opacity:1}
        .cl-play{width:50px;height:50px;border-radius:50%;background:rgba(204,26,26,.80);display:flex;align-items:center;justify-content:center;color:#fff}
        .cl-info{padding:14px 16px 16px}
        .cl-title{font-size:13.5px;font-weight:700;color:#f5f5f5;line-height:1.35}
        .cl-act-btn{display:flex;align-items:center;gap:4px;padding:4px 9px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);border-radius:7px;color:rgba(255,255,255,.50);font-size:11px;font-family:inherit;cursor:pointer;transition:all .15s}
        .cl-act-btn:hover{background:rgba(255,255,255,.10);color:#f0f0f0}
        .cl-act-danger:hover{background:rgba(239,68,68,.12);border-color:rgba(239,68,68,.20);color:#fca5a5}
      `}</style>
    </div>
  );
}
