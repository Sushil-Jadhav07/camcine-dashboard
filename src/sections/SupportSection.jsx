import { useEffect, useMemo, useState } from 'react';
import { MessageSquare, Search, Send, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { PAGE_STYLES } from '../lib/pageStyles.js';
import { CustomSelect } from '../components/CustomSelect.jsx';
import { supportService } from '../services/support.js';

export function SupportSection() {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [status, setStatus] = useState('open');
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [reply, setReply] = useState('');
  const [visible, setVisible] = useState(false);

  const load = async () => {
    const response = await supportService.getAll({ status, category });
    setTickets(response.data?.tickets || []);
  };

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
  useEffect(() => { load().catch(console.error); }, [status, category]);

  useEffect(() => {
    if (!selected) return;
    supportService.getById(selected).then(response => setDetail(response.data)).catch(console.error);
  }, [selected]);

  const stats = useMemo(() => ({
    open: tickets.filter(t => t.status === 'open').length,
    progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    urgent: tickets.filter(t => t.priority === 'urgent').length,
  }), [tickets]);

  const visibleTickets = tickets.filter(ticket => `${ticket.subject} ${ticket.user_email || ''}`.toLowerCase().includes(query.toLowerCase()));

  const sendReply = async () => {
    if (!selected || !reply.trim()) return;
    await supportService.reply(selected, { body: reply });
    setReply('');
    const response = await supportService.getById(selected);
    setDetail(response.data);
  };

  const updateStatus = async (value) => {
    if (!selected) return;
    await supportService.updateStatus(selected, { status: value });
    setDetail(prev => ({ ...prev, ticket: { ...prev?.ticket, status: value } }));
    await load();
  };

  return (
    <div className={`page ${visible ? 'visible' : ''}`}>
      <div className="page-inner">
        <div className="ph">
          <div className="ph-left"><h1>Support</h1><p>Review tickets and respond to users</p></div>
        </div>
        <div className="stats-row">
          {[
            ['Open', stats.open, AlertCircle],
            ['In Progress', stats.progress, Clock],
            ['Resolved', stats.resolved, CheckCircle],
            ['Urgent', stats.urgent, MessageSquare],
          ].map(([label, value, Icon]) => <div className="sc" key={label}><div className="sc-icon"><Icon size={20}/></div><div><div className="sc-label">{label}</div><div className="sc-value">{value}</div></div></div>)}
        </div>
        <div className="fbar">
          <div className="fsearch" style={{ flex: 1 }}><Search size={15}/><input placeholder="Search tickets..." value={query} onChange={e => setQuery(e.target.value)} /></div>
          <CustomSelect value={status} onChange={setStatus} options={[{ value: '', label: 'All Statuses' }, { value: 'open', label: 'Open' }, { value: 'in_progress', label: 'In Progress' }, { value: 'resolved', label: 'Resolved' }]} />
          <CustomSelect value={category} onChange={setCategory} options={[{ value: '', label: 'All Categories' }, { value: 'technical', label: 'Technical' }, { value: 'billing', label: 'Billing' }, { value: 'general', label: 'General' }]} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(360px, 1fr) minmax(420px, 1.25fr)', gap: 18 }}>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Ticket</th><th>User</th><th>Status</th><th>Created</th></tr></thead>
              <tbody>{visibleTickets.map(ticket => (
                <tr key={ticket.id} onClick={() => setSelected(ticket.id)} style={{ cursor: 'pointer' }}>
                  <td><div style={{ fontWeight: 700 }}>{ticket.subject}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,.38)' }}>{ticket.category}</div></td>
                  <td>{ticket.user_email || ticket.user_name || 'User'}</td>
                  <td><span className="badge b-gray">{ticket.status}</span></td>
                  <td>{ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : '-'}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="card">
            {detail?.ticket ? <>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                <div><div className="card-title">{detail.ticket.subject}</div><div className="card-sub">{detail.ticket.body}</div></div>
                <CustomSelect value={detail.ticket.status} onChange={updateStatus} options={[{ value: 'open', label: 'Open' }, { value: 'in_progress', label: 'In Progress' }, { value: 'resolved', label: 'Resolved' }]} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {(detail.replies || []).map(item => <div key={item.id} style={{ padding: 12, borderRadius: 10, background: item.is_staff_reply ? 'rgba(204,26,26,.10)' : 'rgba(255,255,255,.04)' }}>{item.body}</div>)}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <textarea className="input" rows={3} value={reply} onChange={e => setReply(e.target.value)} placeholder="Write a reply..." style={{ flex: 1, resize: 'vertical' }} />
                <button className="btn btn-primary" onClick={sendReply}><Send size={14}/>Reply</button>
              </div>
            </> : <div className="empty"><MessageSquare size={36}/><p>Select a ticket to view the conversation</p></div>}
          </div>
        </div>
      </div>
      <style>{PAGE_STYLES}</style>
    </div>
  );
}
