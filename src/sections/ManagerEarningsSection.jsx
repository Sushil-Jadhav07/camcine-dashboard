import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, CheckCircle, Clock, XCircle, ChevronLeft, ChevronRight, Search, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { PAGE_STYLES } from '../lib/pageStyles.js';

const earningsData = [
  { id:1, date:'2024-03-15', amount:2450.00, status:'Paid',       method:'Bank Transfer', project:'Film Project A' },
  { id:2, date:'2024-03-14', amount:1800.00, status:'Pending',    method:'PayPal',         project:'Series Episode 3' },
  { id:3, date:'2024-03-13', amount:3200.00, status:'Processing', method:'Wire Transfer',  project:'Documentary B' },
  { id:4, date:'2024-03-12', amount:1500.00, status:'Paid',       method:'Bank Transfer',  project:'Commercial C' },
  { id:5, date:'2024-03-11', amount:2800.00, status:'Paid',       method:'PayPal',         project:'Film Project D' },
  { id:6, date:'2024-03-10', amount:1950.00, status:'Pending',    method:'Bank Transfer',  project:'Music Video E' },
];

const monthlyData = [
  { month:'Jan',earnings:8500 }, { month:'Feb',earnings:9200 }, { month:'Mar',earnings:10500 },
  { month:'Apr',earnings:11800 }, { month:'May',earnings:12300 }, { month:'Jun',earnings:14500 },
  { month:'Jul',earnings:13200 }, { month:'Aug',earnings:15800 }, { month:'Sep',earnings:16400 },
  { month:'Oct',earnings:18200 },
];

const statusMeta = {
  Paid:       { cls:'b-green',  icon:<CheckCircle size={12}/> },
  Pending:    { cls:'b-yellow', icon:<Clock size={12}/> },
  Processing: { cls:'b-blue',   icon:<Clock size={12}/> },
  Failed:     { cls:'b-red',    icon:<XCircle size={12}/> },
};

const Tt = ({active,payload,label}) => active&&payload?.length ? (
  <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,.10)',borderRadius:10,padding:'10px 14px',fontSize:12}}>
    <div style={{color:'rgba(255,255,255,.35)',marginBottom:4,fontSize:10,textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</div>
    <div style={{color:'#f5f5f5',fontWeight:700}}>₹{(payload[0]?.value).toLocaleString()}</div>
  </div>
) : null;

export function ManagerEarningsSection({ userId }) {
  const [earnings] = useState(earningsData);
  const [filtered, setFiltered] = useState(earningsData);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const PER_PAGE = 4;

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  useEffect(() => {
    let f = earnings;
    if (q) f = f.filter(e => e.project.toLowerCase().includes(q.toLowerCase()) || e.method.toLowerCase().includes(q.toLowerCase()));
    if (status !== 'All') f = f.filter(e => e.status === status);
    setFiltered(f); setPage(1);
  }, [q, status, earnings]);

  const total = earnings.filter(e=>e.status==='Paid').reduce((s,e)=>s+e.amount,0);
  const pending = earnings.filter(e=>e.status==='Pending').reduce((s,e)=>s+e.amount,0);
  const processing = earnings.filter(e=>e.status==='Processing').reduce((s,e)=>s+e.amount,0);

  const paged = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const totalPages = Math.ceil(filtered.length/PER_PAGE);

  return (
    <div className={`page ${visible?'visible':''}`}>
      <style>{PAGE_STYLES}</style>
      <style>{`
        .me-stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
        @media(max-width:900px){.me-stat-grid{grid-template-columns:repeat(2,1fr)}}
        .me-sc{background:#141414;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:20px 22px;position:relative;overflow:hidden;transition:border-color .2s}
        .me-sc:hover{border-color:rgba(255,255,255,.12)}
        .me-sc-bar{position:absolute;top:0;left:0;right:0;height:2px}
        .me-sc-ico{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:12px}
        .me-sc-v{font-family:'Sora',sans-serif;font-size:22px;font-weight:800;color:#f0f0f0;letter-spacing:-.02em;margin-bottom:2px}
        .me-sc-l{font-size:11px;color:rgba(255,255,255,.28);text-transform:uppercase;letter-spacing:.07em}
        .me-sc-trend{display:flex;align-items:center;gap:5px;font-size:11.5px;color:#4ade80;font-weight:600;margin-top:6px}
        .me-grid{display:grid;grid-template-columns:3fr 2fr;gap:18px;margin-bottom:20px}
        @media(max-width:1100px){.me-grid{grid-template-columns:1fr}}
        .me-card{background:#141414;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:22px 24px}
        .me-card-hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px}
        .me-card-ttl{font-size:14px;font-weight:700;color:rgba(255,255,255,.75);margin-bottom:3px}
        .me-card-sub{font-size:12px;color:rgba(255,255,255,.28)}
        /* table */
        .me-tbl-wrap{overflow-x:auto}
        .me-tbl{width:100%;border-collapse:collapse}
        .me-tbl th{font-size:10.5px;font-weight:700;color:rgba(255,255,255,.25);text-transform:uppercase;letter-spacing:.08em;padding:10px 12px;text-align:left;white-space:nowrap}
        .me-tbl td{padding:12px 12px;border-top:1px solid rgba(255,255,255,.05)}
        .me-tbl tr:hover td{background:rgba(255,255,255,.02)}
        .me-amt{font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:#f0f0f0}
        .me-proj{font-size:13.5px;font-weight:600;color:rgba(255,255,255,.68)}
        .me-date{font-size:12px;color:rgba(255,255,255,.35)}
        .me-method{font-size:12px;color:rgba(255,255,255,.45);background:rgba(255,255,255,.05);padding:3px 9px;border-radius:6px;border:1px solid rgba(255,255,255,.07)}
        /* filter bar */
        .me-fbar{display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap}
        .me-search{display:flex;align-items:center;gap:8px;background:#161616;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:8px 13px;flex:1;min-width:180px}
        .me-search input{flex:1;background:transparent;border:none;outline:none;color:#f0f0f0;font-size:13.5px;font-family:inherit}
        .me-search input::placeholder{color:rgba(255,255,255,.22)}
        .me-fsel{background:#161616;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:8px 13px;color:rgba(255,255,255,.55);font-size:13px;font-family:inherit;outline:none;cursor:pointer}
        /* pgn */
        .me-pgn{display:flex;align-items:center;justify-content:space-between;margin-top:16px}
        .me-pgn-info{font-size:12px;color:rgba(255,255,255,.28)}
        .me-pgn-btns{display:flex;gap:6px}
        .me-pgn-btn{width:30px;height:30px;border-radius:8px;border:1px solid rgba(255,255,255,.09);background:transparent;color:rgba(255,255,255,.45);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .12s;font-family:inherit}
        .me-pgn-btn:hover:not(:disabled){background:rgba(255,255,255,.06);color:#f0f0f0}
        .me-pgn-btn:disabled{opacity:.3;cursor:not-allowed}
        /* distribution */
        .me-dist{display:flex;flex-direction:column;gap:10px}
        .me-dist-row{display:flex;flex-direction:column;gap:5px}
        .me-dist-hdr{display:flex;justify-content:space-between;font-size:12px}
        .me-dist-key{color:rgba(255,255,255,.45)}
        .me-dist-val{color:rgba(255,255,255,.65);font-weight:600}
        .me-dist-bar{height:5px;background:rgba(255,255,255,.07);border-radius:10px;overflow:hidden}
        .me-dist-fill{height:100%;border-radius:10px;transition:width .6s .1s}
      `}</style>

      <div className="page-inner">
        <div className="ph">
          <div className="ph-left"><h1>My Earnings</h1><p>Track your payments and revenue history</p></div>
          <div className="ph-right">
            <button className="btn btn-primary"><Download size={14}/> Export CSV</button>
          </div>
        </div>

        {/* Stats */}
        <div className="me-stat-grid">
          {[
            { label:'Total Paid',    val:`₹${total.toLocaleString()}`,       bar:'#22c55e', bg:'rgba(34,197,94,.10)',   ic:'#86efac', ico:<CheckCircle size={17}/>, trend:'+12.4%' },
            { label:'Pending',       val:`₹${pending.toLocaleString()}`,     bar:'#f59e0b', bg:'rgba(245,158,11,.10)', ic:'#fde68a', ico:<Clock size={17}/>,        trend:'2 payments' },
            { label:'Processing',    val:`₹${processing.toLocaleString()}`,  bar:'#1a7acc', bg:'rgba(26,122,204,.12)', ic:'#93c5fd', ico:<TrendingUp size={17}/>,  trend:'1 transfer' },
            { label:'This Month',    val:'₹18,200',                          bar:'#cc1a1a', bg:'rgba(204,26,26,.12)',  ic:'#ff8080', ico:<DollarSign size={17}/>,   trend:'+11.0%' },
          ].map((s,i) => (
            <div key={i} className="me-sc">
              <div className="me-sc-bar" style={{background:s.bar}}/>
              <div className="me-sc-ico" style={{background:s.bg,color:s.ic}}>{s.ico}</div>
              <div className="me-sc-v">{s.val}</div>
              <div className="me-sc-l">{s.label}</div>
              <div className="me-sc-trend"><ArrowUpRight size={12}/>{s.trend}</div>
            </div>
          ))}
        </div>

        {/* Chart + Distribution */}
        <div className="me-grid">
          <div className="me-card">
            <div className="me-card-hdr">
              <div>
                <div className="me-card-ttl">Earnings Trend</div>
                <div className="me-card-sub">Monthly earnings Jan–Oct 2024</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData} margin={{left:-20,right:5,top:5,bottom:0}}>
                <defs>
                  <linearGradient id="meg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#cc1a1a" stopOpacity={.22}/>
                    <stop offset="95%" stopColor="#cc1a1a" stopOpacity={.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
                <XAxis dataKey="month" tick={{fill:'rgba(255,255,255,.28)',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'rgba(255,255,255,.28)',fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip content={<Tt/>}/>
                <Area type="monotone" dataKey="earnings" stroke="#cc1a1a" strokeWidth={2.5} fill="url(#meg)" dot={false} activeDot={{r:5,fill:'#cc1a1a',stroke:'#fff',strokeWidth:2}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="me-card">
            <div className="me-card-hdr">
              <div>
                <div className="me-card-ttl">Payment Methods</div>
                <div className="me-card-sub">Distribution by channel</div>
              </div>
            </div>
            <div className="me-dist">
              {[
                { label:'Bank Transfer', pct:55, color:'#cc1a1a' },
                { label:'PayPal',        pct:30, color:'#1a7acc' },
                { label:'Wire Transfer', pct:15, color:'#22c55e' },
              ].map(d => (
                <div key={d.label} className="me-dist-row">
                  <div className="me-dist-hdr">
                    <span className="me-dist-key">{d.label}</span>
                    <span className="me-dist-val">{d.pct}%</span>
                  </div>
                  <div className="me-dist-bar">
                    <div className="me-dist-fill" style={{width:`${d.pct}%`,background:d.color}}/>
                  </div>
                </div>
              ))}
            </div>

            <div style={{marginTop:24,paddingTop:18,borderTop:'1px solid rgba(255,255,255,.06)'}}>
              <div className="me-card-ttl" style={{marginBottom:12}}>Status Breakdown</div>
              {[
                { label:'Paid',       count:3, color:'#22c55e' },
                { label:'Pending',    count:2, color:'#f59e0b' },
                { label:'Processing', count:1, color:'#1a7acc' },
              ].map(s => (
                <div key={s.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{width:7,height:7,borderRadius:'50%',background:s.color}}/>
                    <span style={{fontSize:13,color:'rgba(255,255,255,.50)'}}>{s.label}</span>
                  </div>
                  <span style={{fontSize:13,fontWeight:700,color:'rgba(255,255,255,.65)'}}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions table */}
        <div className="me-card">
          <div className="me-card-hdr">
            <div>
              <div className="me-card-ttl">Transaction History</div>
              <div className="me-card-sub">{filtered.length} transactions</div>
            </div>
          </div>

          <div className="me-fbar">
            <div className="me-search">
              <Search size={14} style={{color:'rgba(255,255,255,.28)'}}/>
              <input placeholder="Search project or method..." value={q} onChange={e=>setQ(e.target.value)}/>
            </div>
            <select className="me-fsel" value={status} onChange={e=>setStatus(e.target.value)}>
              {['All','Paid','Pending','Processing','Failed'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="me-tbl-wrap">
            <table className="me-tbl">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paged.map(e => (
                  <tr key={e.id}>
                    <td><span className="me-proj">{e.project}</span></td>
                    <td><span className="me-date">{e.date}</span></td>
                    <td><span className="me-amt">₹{e.amount.toLocaleString()}</span></td>
                    <td><span className="me-method">{e.method}</span></td>
                    <td>
                      <span className={`badge ${statusMeta[e.status]?.cls}`} style={{display:'inline-flex',alignItems:'center',gap:5}}>
                        {statusMeta[e.status]?.icon}{e.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr><td colSpan={5} style={{textAlign:'center',padding:30,color:'rgba(255,255,255,.25)',fontSize:13}}>No transactions found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="me-pgn">
            <span className="me-pgn-info">Showing {Math.min((page-1)*PER_PAGE+1,filtered.length)}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length}</span>
            <div className="me-pgn-btns">
              <button className="me-pgn-btn" onClick={()=>setPage(p=>p-1)} disabled={page===1}><ChevronLeft size={14}/></button>
              <button className="me-pgn-btn" onClick={()=>setPage(p=>p+1)} disabled={page>=totalPages}><ChevronRight size={14}/></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
