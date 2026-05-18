import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Eye, User, Film, Calendar, Search, X, ChevronRight } from 'lucide-react';
import { PAGE_STYLES } from '../lib/pageStyles.js';
import { CustomSelect } from '../components/CustomSelect.jsx';

const mockQueue = [
  { id:1, name:'Aryan Kapoor',    role:'Lead Actor',  movie:'The Midnight Archive',  status:'pending',  submitted:'2024-03-14', auditionDate:'2024-03-20', age:28, experience:'5 years', headshot:'https://ui-avatars.com/api/?name=Aryan+Kapoor&background=cc1a1a&color=fff' },
  { id:2, name:'Priya Sharma',    role:'Supporting',  movie:'Cyber Chronicles S2',   status:'approved', submitted:'2024-03-13', auditionDate:'2024-03-18', age:25, experience:'3 years', headshot:'https://ui-avatars.com/api/?name=Priya+Sharma&background=3b82f6&color=fff' },
  { id:3, name:'Rahul Menon',     role:'Villain',     movie:'Urban Legends',         status:'rejected', submitted:'2024-03-12', auditionDate:'—',          age:35, experience:'10 years',headshot:'https://ui-avatars.com/api/?name=Rahul+Menon&background=6b7280&color=fff' },
  { id:4, name:'Zara Ahmed',      role:'Lead Actress',movie:'Stars Align',           status:'pending',  submitted:'2024-03-11', auditionDate:'2024-03-22', age:23, experience:'2 years', headshot:'https://ui-avatars.com/api/?name=Zara+Ahmed&background=cc1a1a&color=fff' },
  { id:5, name:'Dev Malhotra',    role:'Director',    movie:'Neon Skyline',          status:'approved', submitted:'2024-03-10', auditionDate:'2024-03-16', age:42, experience:'15 years',headshot:'https://ui-avatars.com/api/?name=Dev+Malhotra&background=22c55e&color=fff' },
];

const statusCfg = { pending:{ badge:'b-yellow', label:'Pending', icon:<Clock size={12}/> }, approved:{ badge:'b-green', label:'Approved', icon:<CheckCircle size={12}/> }, rejected:{ badge:'b-red', label:'Rejected', icon:<XCircle size={12}/> } };

export function ActorQueueSection({ onNavigate }) {
  const [queue, setQueue] = useState(mockQueue);
  const [filtered, setFiltered] = useState(mockQueue);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);
  useEffect(()=>{ setTimeout(()=>setVisible(true),80); },[]);
  useEffect(()=>{
    let f = queue;
    if(q) f = f.filter(a=>`${a.name} ${a.role} ${a.movie}`.toLowerCase().includes(q.toLowerCase()));
    if(status!=='All') f = f.filter(a=>a.status===status.toLowerCase());
    setFiltered(f);
  },[q,status,queue]);

  const updateStatus=(id,s)=>{ setQueue(p=>p.map(a=>a.id===id?{...a,status:s}:a)); if(selected?.id===id) setSelected(p=>({...p,status:s})); };

  return (
    <div className={`page ${visible?'visible':''}`}>
      <div className="page-inner">
        <div className="ph">
          <div className="ph-left"><h1>Actor Queue</h1><p>{queue.filter(a=>a.status==='pending').length} applications pending review</p></div>
        </div>

        <div className="stats-row">
          {[
            {label:'Total',    value:queue.length, icon:User},
            {label:'Pending',  value:queue.filter(a=>a.status==='pending').length,  icon:Clock},
            {label:'Approved', value:queue.filter(a=>a.status==='approved').length, icon:CheckCircle},
            {label:'Rejected', value:queue.filter(a=>a.status==='rejected').length, icon:XCircle},
          ].map(({label,value,icon:Icon},i)=>(
            <div key={i} className="sc"><div className="sc-icon"><Icon size={20}/></div><div><div className="sc-label">{label}</div><div className="sc-value">{value}</div></div></div>
          ))}
        </div>

        <div className="fbar">
          <div className="fsearch" style={{flex:1}}><Search size={15} style={{color:'rgba(255,255,255,.30)',flexShrink:0}}/><input placeholder="Search actors, movies..." value={q} onChange={e=>setQ(e.target.value)}/></div>
          <CustomSelect value={status} onChange={setStatus} options={['All','Pending','Approved','Rejected']} />
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr',gap:10}}>
          {filtered.map(a=>{
            const cfg = statusCfg[a.status];
            return (
              <div key={a.id} className="aq-card" onClick={()=>setSelected(a)}>
                <img src={a.headshot} alt={a.name} className="aq-avatar"/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                    <span style={{fontSize:14,fontWeight:700,color:'#f5f5f5'}}>{a.name}</span>
                    <span className={`badge ${cfg.badge}`} style={{fontSize:10,display:'flex',alignItems:'center',gap:4}}>{cfg.icon}{cfg.label}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                    <span style={{fontSize:12,color:'rgba(255,255,255,.45)',display:'flex',alignItems:'center',gap:4}}><User size={11}/>{a.role}</span>
                    <span style={{fontSize:12,color:'rgba(255,255,255,.45)',display:'flex',alignItems:'center',gap:4}}><Film size={11}/>{a.movie}</span>
                    <span style={{fontSize:12,color:'rgba(255,255,255,.35)',display:'flex',alignItems:'center',gap:4}}><Calendar size={11}/>Submitted {a.submitted}</span>
                  </div>
                </div>
                {a.status==='pending'&&(
                  <div style={{display:'flex',gap:6,flexShrink:0}} onClick={e=>e.stopPropagation()}>
                    <button className="btn btn-primary btn-sm" onClick={()=>updateStatus(a.id,'approved')}>Approve</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>updateStatus(a.id,'rejected')}>Reject</button>
                  </div>
                )}
                <ChevronRight size={14} style={{color:'rgba(255,255,255,.20)',flexShrink:0}}/>
              </div>
            );
          })}
          {filtered.length===0&&<div className="empty"><User size={32}/><p>No applications found</p></div>}
        </div>
      </div>

      {selected&&(
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div className="modal-box">
            <div className="modal-hdr"><h3>Application Details</h3><button className="modal-close" onClick={()=>setSelected(null)}><X size={15}/></button></div>
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              <div style={{display:'flex',alignItems:'center',gap:16}}>
                <img src={selected.headshot} alt={selected.name} style={{width:64,height:64,borderRadius:16,border:'1px solid rgba(255,255,255,.10)'}}/>
                <div>
                  <div style={{fontSize:18,fontWeight:800,color:'#f5f5f5'}}>{selected.name}</div>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginTop:4}}>
                    <span className={`badge ${statusCfg[selected.status].badge}`}>{statusCfg[selected.status].label}</span>
                    <span style={{fontSize:12,color:'rgba(255,255,255,.35)'}}>{selected.experience}</span>
                  </div>
                </div>
              </div>
              {[['Role',selected.role],['Movie',selected.movie],['Age',selected.age],['Submitted',selected.submitted],['Audition Date',selected.auditionDate]].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,.06)'}}>
                  <span style={{fontSize:12,color:'rgba(255,255,255,.35)'}}>{k}</span>
                  <span style={{fontSize:13,color:'#f5f5f5',fontWeight:500}}>{v}</span>
                </div>
              ))}
              {selected.status==='pending'&&(
                <div style={{display:'flex',gap:10}}>
                  <button className="btn btn-primary" style={{flex:1}} onClick={()=>updateStatus(selected.id,'approved')}>Approve</button>
                  <button className="btn btn-danger" style={{flex:1}} onClick={()=>updateStatus(selected.id,'rejected')}>Reject</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`${PAGE_STYLES}
        .aq-card { display:flex; align-items:center; gap:14px; padding:16px 18px; background:#141414; border:1px solid rgba(255,255,255,.07); border-radius:14px; cursor:pointer; transition:border-color .15s, background .15s; }
        .aq-card:hover { background:#1a1a1a; border-color:rgba(255,255,255,.12); }
        .aq-avatar { width:44px; height:44px; border-radius:12px; object-fit:cover; border:1px solid rgba(255,255,255,.08); flex-shrink:0; }
      `}</style>
    </div>
  );
}
