import { useState, useEffect } from 'react';
import { Bell, Film, Users, DollarSign, AlertCircle, Check, Trash2, CheckCheck, X, Filter } from 'lucide-react';
import { PAGE_STYLES } from '../lib/pageStyles.js';

const mockNotifs = [
  { id:1, type:'content',      title:'New movie uploaded',      body:'The Midnight Archive is now live in the content library.',  time:'2m ago',  read:false },
  { id:2, type:'subscription', title:'New Premium subscriber',  body:'john@email.com has subscribed to the Premium plan ($19.99/mo).', time:'15m ago', read:false },
  { id:3, type:'payment',      title:'Payment received',        body:'$19.99 from emma@email.com — Standard plan renewal.',       time:'32m ago', read:false },
  { id:4, type:'user',         title:'New user registered',     body:'michael@email.com joined as a standard user.',              time:'1h ago',  read:true },
  { id:5, type:'system',       title:'System update completed', body:'Platform updated to v2.1.0. All services running normally.', time:'2h ago', read:true },
  { id:6, type:'alert',        title:'Failed payment detected', body:'james@email.com — Premium plan renewal failed.',            time:'3h ago',  read:true },
  { id:7, type:'content',      title:'Content reported',        body:'Comedy Special — reported by 2 users for review.',          time:'4h ago',  read:true },
  { id:8, type:'payment',      title:'Refund processed',        body:'$14.99 refunded to sarah@email.com.',                       time:'5h ago',  read:true },
];

const typeIcon = { content:<Film size={15}/>, subscription:<Users size={15}/>, payment:<DollarSign size={15}/>, user:<Users size={15}/>, system:<Bell size={15}/>, alert:<AlertCircle size={15}/> };
const typeColor = { content:'rgba(204,26,26,.12)', subscription:'rgba(59,130,246,.10)', payment:'rgba(34,197,94,.10)', user:'rgba(139,92,246,.10)', system:'rgba(255,255,255,.06)', alert:'rgba(239,68,68,.10)' };
const typeIconColor = { content:'#ff6b6b', subscription:'#60a5fa', payment:'#4ade80', user:'#a78bfa', system:'rgba(255,255,255,.40)', alert:'#f87171' };

export function NotificationsSection({ onNavigate }) {
  const [notifs, setNotifs] = useState(mockNotifs);
  const [filter, setFilter] = useState('all');
  const [visible, setVisible] = useState(false);
  useEffect(()=>{ setTimeout(()=>setVisible(true),80); },[]);

  const filtered = filter==='all' ? notifs : filter==='unread' ? notifs.filter(n=>!n.read) : notifs.filter(n=>n.read);
  const unread = notifs.filter(n=>!n.read).length;

  const markRead = (id) => setNotifs(p=>p.map(n=>n.id===id?{...n,read:true}:n));
  const deleteN = (id) => setNotifs(p=>p.filter(n=>n.id!==id));
  const markAll = () => setNotifs(p=>p.map(n=>({...n,read:true})));
  const clearAll = () => setNotifs([]);

  return (
    <div className={`page ${visible?'visible':''}`}>
      <div className="page-inner">
        <div className="ph">
          <div className="ph-left">
            <h1 style={{display:'flex',alignItems:'center',gap:10}}>Notifications {unread>0&&<span className="badge b-accent">{unread} new</span>}</h1>
            <p>Platform alerts and activity updates</p>
          </div>
          <div className="ph-right">
            <button className="btn btn-secondary btn-sm" onClick={markAll}><CheckCheck size={13}/>Mark all read</button>
            <button className="btn btn-danger btn-sm" onClick={clearAll}><Trash2 size={13}/>Clear all</button>
          </div>
        </div>

        <div className="tabs">
          {[['all','All'],['unread','Unread'],['read','Read']].map(([v,l])=>(
            <button key={v} className={`tab ${filter===v?'active':''}`} onClick={()=>setFilter(v)}>{l}</button>
          ))}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          {filtered.length===0 ? (
            <div className="empty"><Bell size={36}/><p>No notifications</p></div>
          ) : filtered.map(n=>(
            <div key={n.id} className={`notif-row ${n.read?'read':''}`}>
              <div className="notif-icon" style={{background:typeColor[n.type],color:typeIconColor[n.type]}}>{typeIcon[n.type]}</div>
              <div className="notif-body">
                <div className="notif-title">{n.title}{!n.read&&<span className="notif-dot"/>}</div>
                <div className="notif-text">{n.body}</div>
                <div className="notif-time">{n.time}</div>
              </div>
              <div className="notif-actions">
                {!n.read && <button className="btn btn-ghost btn-icon btn-sm" title="Mark read" onClick={()=>markRead(n.id)}><Check size={13}/></button>}
                <button className="btn btn-ghost btn-icon btn-sm" title="Delete" onClick={()=>deleteN(n.id)}><X size={13}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        ${PAGE_STYLES}
        .notif-row { display:flex; align-items:center; gap:14px; padding:14px 18px; border-radius:14px; background:#141414; border:1px solid rgba(255,255,255,.07); transition:border-color .15s, background .15s; }
        .notif-row:not(.read) { border-left:3px solid #cc1a1a; }
        .notif-row.read { opacity:.65; }
        .notif-row:hover { background:#1a1a1a; border-color:rgba(255,255,255,.12); }
        .notif-icon { width:38px; height:38px; border-radius:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .notif-body { flex:1; min-width:0; }
        .notif-title { font-size:13.5px; font-weight:700; color:#f5f5f5; display:flex; align-items:center; gap:8px; margin-bottom:3px; }
        .notif-dot { width:7px; height:7px; border-radius:50%; background:#cc1a1a; flex-shrink:0; }
        .notif-text { font-size:12.5px; color:rgba(255,255,255,.45); margin-bottom:4px; }
        .notif-time { font-size:11px; color:rgba(255,255,255,.25); }
        .notif-actions { display:flex; gap:4px; flex-shrink:0; }
      `}</style>
    </div>
  );
}
