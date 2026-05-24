import { useState, useEffect } from 'react';
import { Search, Download, Filter, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, DollarSign, CreditCard, ArrowUpRight, ArrowDownRight, TrendingUp, X, RefreshCw } from 'lucide-react';
import { PAGE_STYLES } from '../lib/pageStyles.js';
import { CustomSelect } from '../components/CustomSelect.jsx';
import { paymentService } from '../services/payments.js';

const mockTxns = [
  { id:'TXN-001234', date:'2024-03-15', customer:'John Smith',    email:'john@email.com',    amount:14.99, status:'completed', method:'Visa ••4242',     plan:'Standard' },
  { id:'TXN-001235', date:'2024-03-15', customer:'Emma Wilson',   email:'emma@email.com',    amount:19.99, status:'completed', method:'MC ••8888',       plan:'Premium' },
  { id:'TXN-001236', date:'2024-03-14', customer:'Michael Brown', email:'michael@email.com', amount:9.99,  status:'pending',   method:'Visa ••1234',     plan:'Basic' },
  { id:'TXN-001237', date:'2024-03-14', customer:'Lisa Davis',    email:'lisa@email.com',    amount:14.99, status:'completed', method:'Amex ••0005',     plan:'Standard' },
  { id:'TXN-001238', date:'2024-03-13', customer:'James Taylor',  email:'james@email.com',   amount:19.99, status:'failed',    method:'Visa ••9999',     plan:'Premium' },
  { id:'TXN-001239', date:'2024-03-13', customer:'Sarah Chen',    email:'sarah@email.com',   amount:14.99, status:'refunded',  method:'MC ••7777',       plan:'Standard' },
  { id:'TXN-001240', date:'2024-03-12', customer:'David Martinez',email:'david@email.com',   amount:9.99,  status:'completed', method:'Visa ••5555',     plan:'Basic' },
  { id:'TXN-001241', date:'2024-03-12', customer:'Anna Taylor',   email:'anna@email.com',    amount:19.99, status:'completed', method:'Amex ••3333',     plan:'Premium' },
];

const statusBadge = { completed:'b-green', pending:'b-yellow', failed:'b-red', refunded:'b-gray' };
const statusFilters = ['All','Completed','Pending','Failed','Refunded'];

export function PaymentsSection() {
  const [txns, setTxns] = useState(mockTxns);
  const [stats, setStats] = useState(null);
  const [filtered, setFiltered] = useState(mockTxns);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [range, setRange] = useState('30d');
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const PER = 6;

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    Promise.allSettled([
      paymentService.getAll({ limit: 50 }),
      paymentService.getStats(),
    ]).then(([txnsResult, statsResult]) => {
      if (txnsResult.status === 'fulfilled') {
        const rows = txnsResult.value.data?.transactions || [];
        setTxns(rows.map(item => ({
          id: item.id,
          date: item.created_at ? new Date(item.created_at).toLocaleDateString() : '-',
          customer: item.user_name || item.user_email || 'Customer',
          email: item.user_email || '',
          amount: Number(item.amount || 0),
          status: item.status,
          method: item.card_last4 ? `${item.card_brand || 'Card'} **${item.card_last4}` : item.payment_method || item.gateway || '-',
          plan: item.plan_name || '-',
        })));
      }
      if (statsResult.status === 'fulfilled') setStats(statsResult.value.data);
    });
  }, []);
  useEffect(() => {
    let f = txns;
    if (q) f = f.filter(t => `${t.customer} ${t.email} ${t.id}`.toLowerCase().includes(q.toLowerCase()));
    if (status !== 'All') f = f.filter(t => t.status === status.toLowerCase());
    setFiltered(f); setPage(1);
  }, [q, status, txns]);

  const total = stats?.total_revenue ?? filtered.filter(t=>t.status==='completed').reduce((s,t)=>s+t.amount,0);
  const totalPages = Math.ceil(filtered.length / PER);
  const paged = filtered.slice((page-1)*PER, page*PER);

  return (
    <div className={`page ${visible?'visible':''}`}>
      <div className="page-inner">
        <div className="ph">
          <div className="ph-left"><h1>Payments</h1><p>Transaction history and revenue tracking</p></div>
          <div className="ph-right">
            <CustomSelect value={range} onChange={setRange} options={[
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
              { value: '90d', label: 'Last 90 days' },
              { value: '1y', label: 'This year' },
            ]} />
            <button className="btn btn-secondary btn-sm"><Download size={13}/> Export</button>
          </div>
        </div>

        <div className="stats-row">
          {[
            {label:'Total Revenue', value:`$${total.toFixed(2)}`,      icon:DollarSign, cls:''},
            {label:'Completed',     value:stats?.completed_count ?? txns.filter(t=>t.status==='completed').length, icon:CheckCircle, cls:''},
            {label:'Pending',       value:stats?.pending_count ?? txns.filter(t=>t.status==='pending').length,   icon:Clock, cls:''},
            {label:'Failed/Refunded',value:(stats ? Number(stats.failed_count || 0) + Number(stats.refunded_count || 0) : txns.filter(t=>['failed','refunded'].includes(t.status)).length), icon:XCircle, cls:''},
          ].map(({label,value,icon:Icon},i)=>(
            <div key={i} className="sc">
              <div className="sc-icon"><Icon size={20}/></div>
              <div><div className="sc-label">{label}</div><div className="sc-value">{value}</div></div>
            </div>
          ))}
        </div>

        <div className="fbar">
          <div className="fsearch" style={{flex:1}}>
            <Search size={15} style={{color:'rgba(255,255,255,.30)',flexShrink:0}}/>
            <input placeholder="Search transactions, customers..." value={q} onChange={e=>setQ(e.target.value)}/>
            {q && <button onClick={()=>setQ('')} style={{background:'none',border:'none',color:'rgba(255,255,255,.30)',cursor:'pointer',padding:0}}><X size={14}/></button>}
          </div>
          <CustomSelect value={status} onChange={setStatus} options={statusFilters} />
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Transaction ID</th><th>Customer</th><th>Plan</th><th>Method</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={7}><div className="empty"><DollarSign size={32}/><p>No transactions found</p></div></td></tr>
              ) : paged.map(t=>(
                <tr key={t.id}>
                  <td><span style={{fontFamily:'monospace',fontSize:12,color:'rgba(255,255,255,.55)'}}>{t.id}</span></td>
                  <td><div style={{fontWeight:600,fontSize:13}}>{t.customer}</div><div style={{fontSize:11,color:'rgba(255,255,255,.38)'}}>{t.email}</div></td>
                  <td><span className="badge b-gray" style={{fontSize:11}}>{t.plan}</span></td>
                  <td style={{fontSize:12,color:'rgba(255,255,255,.50)',display:'flex',alignItems:'center',gap:6}}><CreditCard size={13}/>{t.method}</td>
                  <td><span style={{fontWeight:700,fontSize:14,color:t.status==='refunded'?'#f87171':'#f5f5f5'}}>{t.status==='refunded'?'-':''}${t.amount.toFixed(2)}</span></td>
                  <td><span className={`badge ${statusBadge[t.status]||'b-gray'}`}>{t.status}</span></td>
                  <td style={{fontSize:12,color:'rgba(255,255,255,.45)'}}>{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span className="pgn-info">Showing {(page-1)*PER+1}–{Math.min(page*PER,filtered.length)} of {filtered.length}</span>
            <div className="pgn">
              <button className="btn btn-secondary btn-sm" disabled={page===1} onClick={()=>setPage(p=>p-1)}><ChevronLeft size={14}/></button>
              <button className="btn btn-secondary btn-sm" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}><ChevronRight size={14}/></button>
            </div>
          </div>
        )}
      </div>
      <style>{PAGE_STYLES}</style>
    </div>
  );
}
