import { useEffect, useState } from 'react';
import { ArrowLeft, Film, Music, Tv, ArrowRight } from 'lucide-react';
import { PAGE_STYLES } from '../lib/pageStyles.js';

// Podcast removed. Types map to API: movie, show, song
const types = [
  { id:'movie',  name:'Film',        icon:Film,  desc:'Feature films, documentaries, and movies',   color:'#cc1a1a', apiType:'movie'  },
  { id:'series', name:'TV Series',   icon:Tv,    desc:'Television series and episodic content',      color:'#3b82f6', apiType:'show'   },
  { id:'music',  name:'Music Video', icon:Music, desc:'Music videos, concerts, and performances',   color:'#22c55e', apiType:'song'   },
];

export function AddTitleTypeSection({ onNavigate, onSelectType }) {
  const [selected, setSelected] = useState('');
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const handleSelect = (type) => {
    setSelected(type.id);
    if (onSelectType) onSelectType(type.id);
    setTimeout(() => { if (onNavigate) onNavigate('add-title'); }, 280);
  };

  return (
    <div className={`page ${visible ? 'visible' : ''}`}>
      <div className="page-inner" style={{ maxWidth: 900 }}>
        <div className="ph">
          <div className="ph-left">
            <h1>Choose Content Type</h1>
            <p>Select the type of content you want to add to the library</p>
          </div>
          <div className="ph-right">
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate && onNavigate('content')}>
              <ArrowLeft size={14}/>Back
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }}>
          {types.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                className={`att-card ${selected === t.id ? 'selected' : ''}`}
                style={{ '--c': t.color }}
                onClick={() => handleSelect(t)}
              >
                <div className="att-icon" style={{ background: `${t.color}18`, border: `1px solid ${t.color}28`, color: t.color }}>
                  <Icon size={28}/>
                </div>
                <div className="att-info">
                  <div className="att-name">{t.name}</div>
                  <div className="att-desc">{t.desc}</div>
                </div>
                <ArrowRight size={16} className="att-arrow"/>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        ${PAGE_STYLES}
        .att-card { display:flex; align-items:center; gap:18px; padding:22px 24px; background:#141414; border:1px solid rgba(255,255,255,.07); border-radius:18px; cursor:pointer; transition:all .18s ease; font-family:inherit; text-align:left; }
        .att-card:hover { background:#1a1a1a; border-color:var(--c,rgba(255,255,255,.20)); box-shadow:0 6px 22px rgba(0,0,0,.30); transform:translateY(-2px); }
        .att-card.selected { border-color:var(--c); background:color-mix(in srgb,var(--c) 8%,#141414); }
        .att-icon { width:60px; height:60px; border-radius:16px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .att-info { flex:1; }
        .att-name { font-size:17px; font-weight:800; color:#f5f5f5; margin-bottom:4px; letter-spacing:-.01em; }
        .att-desc { font-size:13px; color:rgba(255,255,255,.40); line-height:1.5; }
        .att-arrow { color:rgba(255,255,255,.20); flex-shrink:0; transition:color .15s, transform .15s; }
        .att-card:hover .att-arrow { color:rgba(255,255,255,.60); transform:translateX(3px); }
        @media(max-width:700px){ div[style*="repeat(2"] { grid-template-columns:1fr!important; } }
      `}</style>
    </div>
  );
}
