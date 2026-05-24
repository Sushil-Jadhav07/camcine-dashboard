import { useEffect, useState } from 'react';
import { Star, Search, Plus, Trash2 } from 'lucide-react';
import { PAGE_STYLES } from '../lib/pageStyles.js';
import { contentService } from '../services/content.js';

const sections = ['trending', 'new_releases', 'featured', 'free', 'editors_pick'];

export function FeaturedContentSection() {
  const [active, setActive] = useState(sections[0]);
  const [content, setContent] = useState([]);
  const [pinned, setPinned] = useState({});
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
  useEffect(() => {
    contentService.getContent({ search: query, limit: 12 }).then(response => setContent(response.data?.content || [])).catch(console.error);
  }, [query]);

  const add = (item) => setPinned(prev => ({ ...prev, [active]: [...(prev[active] || []), item] }));
  const remove = (id) => setPinned(prev => ({ ...prev, [active]: (prev[active] || []).filter(item => item.id !== id) }));

  return (
    <div className={`page ${visible ? 'visible' : ''}`}>
      <div className="page-inner">
        <div className="ph"><div className="ph-left"><h1>Featured Content</h1><p>Configure homepage recommendation shelves</p></div></div>
        <div className="tabs">{sections.map(section => <button key={section} className={`tab ${active === section ? 'active' : ''}`} onClick={() => setActive(section)}>{section.replaceAll('_', ' ')}</button>)}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 18 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>Pinned in {active.replaceAll('_', ' ')}</div>
            {(pinned[active] || []).length === 0 ? <div className="empty"><Star size={36}/><p>No pinned content yet</p></div> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pinned[active].map((item, index) => <div key={`${item.id}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, background: 'rgba(255,255,255,.04)' }}>
                  <span style={{ width: 24, color: 'rgba(255,255,255,.35)' }}>{index + 1}</span>
                  <img src={item.thumbnail_url || item.poster_url} alt="" style={{ width: 42, height: 56, objectFit: 'cover', borderRadius: 6 }}/>
                  <div style={{ flex: 1 }}>{item.title}</div>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(item.id)}><Trash2 size={13}/></button>
                </div>)}
              </div>
            )}
          </div>
          <div className="card">
            <div className="fsearch" style={{ marginBottom: 14 }}><Search size={15}/><input placeholder="Search content..." value={query} onChange={e => setQuery(e.target.value)} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {content.map(item => <button key={item.id} className="btn btn-secondary" onClick={() => add(item)} style={{ justifyContent: 'space-between' }}><span>{item.title}</span><Plus size={14}/></button>)}
            </div>
          </div>
        </div>
      </div>
      <style>{PAGE_STYLES}</style>
    </div>
  );
}
