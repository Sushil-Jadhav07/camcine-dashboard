import { useState, useEffect } from 'react';
import { Search, Plus, Users, CreditCard, Calendar, CheckCircle, XCircle, ChevronLeft, ChevronRight, DollarSign, Star, Zap, Crown, X, TrendingUp } from 'lucide-react';
import { PAGE_STYLES } from '../lib/pageStyles.js';

const subs = [
  { id:1, name:'John Smith',    email:'john@email.com',    plan:'Premium',  status:'active',    price:19.99, nextBilling:'2024-04-15', autoRenew:true },
  { id:2, name:'Emma Wilson',   email:'emma@email.com',    plan:'Standard', status:'active',    price:14.99, nextBilling:'2024-04-15', autoRenew:true },
  { id:3, name:'Michael Brown', email:'michael@email.com', plan:'Basic',    status:'active',    price:9.99,  nextBilling:'2024-04-15', autoRenew:false },
  { id:4, name:'Lisa Davis',    email:'lisa@email.com',    plan:'Premium',  status:'cancelled', price:19.99, nextBilling:'—',           autoRenew:false },
  { id:5, name:'James Taylor',  email:'james@email.com',   plan:'Standard', status:'active',    price:14.99, nextBilling:'2024-04-15', autoRenew:true },
  { id:6, name:'Sarah Chen',    email:'sarah@email.com',   plan:'Basic',    status:'active',    price:9.99,  nextBilling:'2024-04-15', autoRenew:true },
];

const plans = [
  { id:'basic',    name:'Basic',    price:9.99,  icon:Star,  color:'#3b82f6', features:['HD Streaming','1 Device','Basic Content'] },
  { id:'standard', name:'Standard', price:14.99, icon:Zap,   color:'#f59e0b', features:['4K Streaming','2 Devices','Premium Content','Offline Downloads'] },
  { id:'premium',  name:'Premium',  price:19.99, icon:Crown, color:'#cc1a1a', features:['4K Streaming','4 Devices','All Content','Offline Downloads','Early Access'] },
];

export function SubscriptionsSection() {
  const [filtered, setFiltered] = useState(subs);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [tab, setTab] = useState('subscribers');
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const PER = 6;

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
  useEffect(() => {
    let f = subs;
    if (q) f = f.filter(s => `${s.name} ${s.email}`.toLowerCase().includes(q.toLowerCase()));
    if (status !== 'All') f = f.filter(s => s.status === status.toLowerCase());
    setFiltered(f); setPage(1);
  }, [q, status]);

  const mrr = subs.filter(s=>s.status==='active').reduce((t,s)=>t+s.price,0);
  const paged = filtered.slice((page-1)*PER, page*PER);
  const totalPages = Math.ceil(filtered.length/PER);
  const initials = n => n.split(' ').map(w=>w[0]).join('').toUpperCase();

  return (
    <div className={`page ${visible?'visible':''}`}>
      <div className="page-inner">
        <div className="ph">
          <div className="ph-left"><h1>Subscriptions</h1><p>Manage plans and subscriber accounts</p></div>
          <div className="ph-right"><button className="btn btn-primary"><Plus size={14}/>New Plan</button></div>
        </div>

        <div className="stats-row">
          {[
            {label:'Monthly Revenue', value:`$${mrr.toFixed(2)}`, icon:DollarSign},
            {label:'Active Subs',     value:subs.filter(s=>s.status==='active').length, icon:CheckCircle},
            {label:'Cancelled',       value:subs.filter(s=>s.status==='cancelled').length, icon:XCircle},
            {label:'Auto-Renew',      value:subs.filter(s=>s.autoRenew).length, icon:TrendingUp},
          ].map(({label,value,icon:Icon},i)=>(
            <div key={i} className="sc"><div className="sc-icon"><Icon size={20}/></div><div><div className="sc-label">{label}</div><div className="sc-value">{value}</div></div></div>
          ))}
        </div>

        <div className="tabs">
          <button className={`tab ${tab==='subscribers'?'active':''}`} onClick={()=>setTab('subscribers')}>Subscribers</button>
          <button className={`tab ${tab==='plans'?'active':''}`} onClick={()=>setTab('plans')}>Plans</button>
        </div>

        {tab === 'subscribers' && <>
          <div className="fbar">
            <div className="fsearch" style={{flex:1}}>
              <Search size={15} style={{color:'rgba(255,255,255,.30)',flexShrink:0}}/>
              <input placeholder="Search subscribers..." value={q} onChange={e=>setQ(e.target.value)}/>
              {q && <button onClick={()=>setQ('')} style={{background:'none',border:'none',color:'rgba(255,255,255,.30)',cursor:'pointer',padding:0}}><X size={14}/></button>}
            </div>
            <select className="fselect" value={status} onChange={e=>setStatus(e.target.value)}>
              {['All','Active','Cancelled'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Subscriber</th><th>Plan</th><th>Status</th><th>Price/mo</th><th>Next Billing</th><th>Auto-Renew</th></tr></thead>
              <tbody>
                {paged.map(s=>(
                  <tr key={s.id}>
                    <td><div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div className="avatar">{initials(s.name)}</div>
                      <div><div style={{fontSize:13,fontWeight:600}}>{s.name}</div><div style={{fontSize:11,color:'rgba(255,255,255,.38)'}}>{s.email}</div></div>
                    </div></td>
                    <td><span className={`badge ${s.plan==='Premium'?'b-accent':s.plan==='Standard'?'b-yellow':'b-blue'}`}>{s.plan}</span></td>
                    <td><span className={`badge ${s.status==='active'?'b-green':'b-gray'}`}>{s.status}</span></td>
                    <td style={{fontWeight:700,color:'#f5f5f5'}}>${s.price}/mo</td>
                    <td style={{fontSize:12,color:'rgba(255,255,255,.45)',display:'flex',alignItems:'center',gap:5}}><Calendar size={12}/>{s.nextBilling}</td>
                    <td><span className={`badge ${s.autoRenew?'b-green':'b-gray'}`}>{s.autoRenew?'On':'Off'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && <div style={{display:'flex',justifyContent:'flex-end',gap:8}} className="pgn">
            <button className="btn btn-secondary btn-sm" disabled={page===1} onClick={()=>setPage(p=>p-1)}><ChevronLeft size={14}/></button>
            <button className="btn btn-secondary btn-sm" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}><ChevronRight size={14}/></button>
          </div>}
        </>}

        {tab === 'plans' && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18}}>
            {plans.map(p=>{
              const Icon = p.icon;
              const count = subs.filter(s=>s.plan===p.name&&s.status==='active').length;
              return (
                <div key={p.id} className="card" style={{border:`1px solid ${p.color}22`,position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${p.color},transparent)`}}/>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}>
                    <div style={{width:44,height:44,borderRadius:12,background:`${p.color}18`,border:`1px solid ${p.color}28`,color:p.color,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <Icon size={20}/>
                    </div>
                    <div>
                      <div style={{fontSize:16,fontWeight:800,color:'#f5f5f5'}}>{p.name}</div>
                      <div style={{fontSize:13,color:'rgba(255,255,255,.40)'}}>{count} active subscribers</div>
                    </div>
                  </div>
                  <div style={{fontSize:28,fontWeight:900,color:'#f5f5f5',marginBottom:4}}>${p.price}<span style={{fontSize:13,fontWeight:400,color:'rgba(255,255,255,.35)'}}>/mo</span></div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.30)',marginBottom:16}}>MRR: ${(p.price*count).toFixed(2)}</div>
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    {p.features.map(f=><div key={f} style={{display:'flex',alignItems:'center',gap:8,fontSize:12.5,color:'rgba(255,255,255,.60)'}}><CheckCircle size={13} style={{color:p.color,flexShrink:0}}/>{f}</div>)}
                  </div>
                  <button className="btn btn-secondary" style={{width:'100%',marginTop:18,borderColor:`${p.color}22`}}>Edit Plan</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`${PAGE_STYLES} @media(max-width:900px){.plans-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
