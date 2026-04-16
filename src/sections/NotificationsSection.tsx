import { useMemo, useState } from 'react';
import { Bell, CheckCircle, Clock, Filter, Send, Users } from 'lucide-react';
import type { Section } from '../App';

interface NotificationsSectionProps {
  onNavigate: (section: Section) => void;
}

type Audience = 'all' | 'premium' | 'region' | 'plan' | 'specific';
type NotificationType = 'Push (App)' | 'Email' | 'Both';
type HistoryStatus = 'Sent' | 'Scheduled' | 'Failed';

interface HistoryItem {
  id: number;
  sentAt: string;
  title: string;
  audience: string;
  delivery: string;
  openRate: string;
  type: NotificationType;
  status: HistoryStatus;
  message: string;
}

const states = [
  'Maharashtra', 'Delhi', 'Tamil Nadu', 'Karnataka', 'Telangana', 'West Bengal',
  'Gujarat', 'Punjab', 'Kerala', 'Rajasthan', 'Uttar Pradesh', 'Bihar',
];

const audienceOptions = [
  { id: 'all' as Audience, title: 'All Users', description: 'Send to all 42,300 registered users', estimate: 42300 },
  { id: 'premium' as Audience, title: 'Premium Subscribers', description: '3,255 users with active premium plans', estimate: 3255 },
  { id: 'region' as Audience, title: 'Users in a Region', description: 'Target viewers by Indian state or region', estimate: 8400 },
  { id: 'plan' as Audience, title: 'Users with Plan Type', description: 'Target Basic, Standard, or Premium users', estimate: 12100 },
  { id: 'specific' as Audience, title: 'Specific User', description: 'Send to one user by email or ID', estimate: 1 },
];

const historyItems: HistoryItem[] = [
  { id: 1, sentAt: 'Apr 16, 2026 10:30 AM', title: 'New thriller release', audience: 'All Users', delivery: '41,982', openRate: '18.4%', type: 'Both', status: 'Sent', message: 'Crimson City is now streaming. Watch the premiere today.' },
  { id: 2, sentAt: 'Apr 15, 2026 7:00 PM', title: 'Premium weekend drop', audience: 'Premium Subscribers', delivery: '3,248', openRate: '31.2%', type: 'Push (App)', status: 'Sent', message: 'Your premium weekend lineup is ready with four new titles.' },
  { id: 3, sentAt: 'Apr 14, 2026 9:15 AM', title: 'Tamil news streams live', audience: 'Tamil Nadu', delivery: '5,820', openRate: '22.1%', type: 'Email', status: 'Sent', message: 'Licensed Tamil Nadu live news streams are now available.' },
  { id: 4, sentAt: 'Apr 13, 2026 8:45 PM', title: 'Payment reminder', audience: 'Standard Plan', delivery: '9,440', openRate: '12.8%', type: 'Email', status: 'Sent', message: 'Your plan renewal is coming up soon. Keep watching without interruption.' },
  { id: 5, sentAt: 'Apr 12, 2026 6:00 PM', title: 'Song premiere tonight', audience: 'All Users', delivery: '42,020', openRate: '20.7%', type: 'Push (App)', status: 'Sent', message: 'A new devotional music premiere starts tonight at 8 PM.' },
  { id: 6, sentAt: 'Apr 11, 2026 11:00 AM', title: 'Profile approved', audience: 'Specific User', delivery: '1', openRate: '100%', type: 'Email', status: 'Sent', message: 'Your actor profile has been approved by the Camcine team.' },
  { id: 7, sentAt: 'Apr 10, 2026 4:25 PM', title: 'Regional picks', audience: 'Maharashtra', delivery: '7,640', openRate: '16.9%', type: 'Both', status: 'Sent', message: 'Hand-picked Marathi movies and songs are ready for you.' },
  { id: 8, sentAt: 'Apr 9, 2026 5:10 PM', title: 'Scheduled maintenance', audience: 'All Users', delivery: '41,776', openRate: '9.3%', type: 'Email', status: 'Sent', message: 'Some live stream services may be briefly unavailable after midnight.' },
  { id: 9, sentAt: 'Apr 18, 2026 8:00 PM', title: 'Upcoming release alert', audience: 'Premium Subscribers', delivery: '-', openRate: '-', type: 'Push (App)', status: 'Scheduled', message: 'Your early access premiere starts in one hour.' },
  { id: 10, sentAt: 'Apr 8, 2026 3:35 PM', title: 'Old app version alert', audience: 'Specific User', delivery: '0', openRate: '-', type: 'Push (App)', status: 'Failed', message: 'Please update your app to continue watching.' },
];

const formatReach = (value: number) => value.toLocaleString('en-IN');

export function NotificationsSection({ onNavigate }: NotificationsSectionProps) {
  const [activeTab, setActiveTab] = useState<'send' | 'history'>('send');
  const [audience, setAudience] = useState<Audience>('all');
  const [region, setRegion] = useState(states[0]);
  const [plan, setPlan] = useState('Basic');
  const [specificUser, setSpecificUser] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('Push (App)');
  const [deepLink, setDeepLink] = useState('');
  const [scheduled, setScheduled] = useState(false);
  const [scheduleAt, setScheduleAt] = useState('');
  const [sending, setSending] = useState(false);
  const [sentMessage, setSentMessage] = useState('');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const selectedAudience = audienceOptions.find((option) => option.id === audience) ?? audienceOptions[0];
  const estimatedReach = audience === 'specific' && specificUser.trim() ? 1 : selectedAudience.estimate;
  const totalPages = Math.ceil(historyItems.length / 5);
  const pagedHistory = historyItems.slice((page - 1) * 5, page * 5);

  const audienceLabel = useMemo(() => {
    if (audience === 'region') return `Users in ${region}`;
    if (audience === 'plan') return `${plan} plan users`;
    if (audience === 'specific') return specificUser || 'Specific user';
    return selectedAudience.title;
  }, [audience, plan, region, selectedAudience.title, specificUser]);

  const sendNotification = () => {
    setSending(true);
    setSentMessage('');
    setTimeout(() => {
      setSending(false);
      setSentMessage(`${scheduled ? 'Scheduled' : 'Sent'} to ${formatReach(estimatedReach)} users`);
    }, 2000);
  };

  return (
    <section className="notifications-section">
      <div className="notifications-bg" />
      <div className="notifications-overlay" />
      <div className="notifications-content">
        <div className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p>Send platform announcements, reminders, and targeted alerts.</p>
          </div>
          <button className="header-link" onClick={() => onNavigate('dashboard')}>Dashboard</button>
        </div>

        <div className="notification-tabs">
          <button className={activeTab === 'send' ? 'active' : ''} onClick={() => setActiveTab('send')}>
            <Send /> Send Notification
          </button>
          <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>
            <Clock /> History
          </button>
        </div>

        {activeTab === 'send' ? (
          <div className="send-layout">
            <div className="send-main">
              <section className="notify-card">
                <div className="card-title"><Users /><div><h2>Audience</h2><p>Choose who should receive this notification.</p></div></div>
                <div className="audience-grid">
                  {audienceOptions.map((option) => (
                    <button
                      key={option.id}
                      className={`audience-option ${audience === option.id ? 'selected' : ''}`}
                      onClick={() => setAudience(option.id)}
                    >
                      <span className="radio-dot" />
                      <strong>{option.title}</strong>
                      <small>{option.description}</small>
                    </button>
                  ))}
                </div>

                {audience === 'region' && (
                  <label className="conditional-field">
                    Region
                    <select value={region} onChange={(event) => setRegion(event.target.value)}>
                      {states.map((state) => <option key={state}>{state}</option>)}
                    </select>
                  </label>
                )}
                {audience === 'plan' && (
                  <label className="conditional-field">
                    Plan Type
                    <select value={plan} onChange={(event) => setPlan(event.target.value)}>
                      <option>Basic</option>
                      <option>Standard</option>
                      <option>Premium</option>
                    </select>
                  </label>
                )}
                {audience === 'specific' && (
                  <label className="conditional-field">
                    User email or ID
                    <input value={specificUser} onChange={(event) => setSpecificUser(event.target.value)} placeholder="Enter user email or ID" />
                  </label>
                )}

                <div className="reach-estimate">
                  <Filter />
                  Estimated reach: ~{formatReach(estimatedReach)} users
                </div>
              </section>

              <section className="notify-card">
                <div className="card-title"><Bell /><div><h2>Notification Content</h2><p>Compose the message and delivery settings.</p></div></div>
                <div className="form-grid">
                  <label className="wide-field">
                    Title
                    <input maxLength={60} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="New release available" />
                    <span>{title.length}/60</span>
                  </label>
                  <label className="wide-field">
                    Message
                    <textarea maxLength={200} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a short notification message..." />
                    <span>{message.length}/200</span>
                  </label>
                  <div className="toggle-group wide-field">
                    {(['Push (App)', 'Email', 'Both'] as NotificationType[]).map((item) => (
                      <button className={type === item ? 'active' : ''} onClick={() => setType(item)} key={item}>{item}</button>
                    ))}
                  </div>
                  <label>
                    Deep Link URL
                    <input value={deepLink} onChange={(event) => setDeepLink(event.target.value)} placeholder="/watch/movie-id" />
                  </label>
                  <label className="inline-toggle">
                    <input type="checkbox" checked={scheduled} onChange={(event) => setScheduled(event.target.checked)} />
                    Schedule for later
                  </label>
                  {scheduled && (
                    <label>
                      Schedule date and time
                      <input type="datetime-local" value={scheduleAt} onChange={(event) => setScheduleAt(event.target.value)} />
                    </label>
                  )}
                </div>
                <div className="send-actions">
                  {sentMessage && <span className="success-message"><CheckCircle /> {sentMessage}</span>}
                  <button className="send-button" onClick={sendNotification} disabled={sending || !title.trim() || !message.trim()}>
                    {sending ? <Clock /> : <Send />}
                    {sending ? 'Sending...' : scheduled ? 'Schedule' : 'Send Now'}
                  </button>
                </div>
              </section>
            </div>

            <aside className="preview-card">
              <h2>Mobile Preview</h2>
              <div className="phone-shell">
                <div className="phone-top">9:41</div>
                <div className="push-card">
                  <div className="push-icon"><Bell /></div>
                  <div>
                    <strong>{title || 'Notification title'}</strong>
                    <p>{message || 'Your message preview appears here as users type.'}</p>
                    <span>{type} • {deepLink || 'No deep link'}</span>
                  </div>
                </div>
                <div className="phone-meta">
                  <span>{audienceLabel}</span>
                  {scheduled && <span>{scheduleAt || 'Scheduled time not set'}</span>}
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <section className="history-card">
            <div className="card-title"><Clock /><div><h2>Notification History</h2><p>Past sent and scheduled notification campaigns.</p></div></div>
            <div className="history-table-wrap">
              <table className="history-table">
                <thead>
                  <tr><th>Sent At</th><th>Title</th><th>Audience</th><th>Delivery Count</th><th>Open Rate</th><th>Type</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {pagedHistory.map((item) => (
                    <>
                      <tr key={item.id} onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                        <td>{item.sentAt}</td>
                        <td className="history-title">{item.title}</td>
                        <td>{item.audience}</td>
                        <td>{item.delivery}</td>
                        <td>{item.openRate}</td>
                        <td>{item.type}</td>
                        <td><span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span></td>
                      </tr>
                      {expandedId === item.id && (
                        <tr className="expanded-row" key={`${item.id}-message`}>
                          <td colSpan={7}>
                            <strong>Full message</strong>
                            <p>{item.message}</p>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next</button>
            </div>
          </section>
        )}
      </div>

      <style>{`
        .notifications-section{position:relative;min-height:100vh;padding:28px 0 56px}.notifications-bg{position:fixed;inset:0;background-image:url('/dashboard_bg.jpg');background-size:cover;background-position:center;background-attachment:fixed}.notifications-overlay{position:fixed;inset:0;background:linear-gradient(to bottom,rgba(22,7,9,.86),rgba(22,7,9,.93) 50%,rgba(22,7,9,.98))}.notifications-content{position:relative;z-index:10;max-width:1400px;margin:0 auto;padding:0 24px}.notifications-header,.notification-tabs,.notify-card,.preview-card,.history-card{background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02)),rgba(50,18,23,.58);border:1px solid var(--border);border-radius:26px;backdrop-filter:blur(24px);box-shadow:var(--shadow-soft)}.notifications-header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:26px 30px;margin-bottom:20px}.notifications-header h1{color:var(--text-primary);font-size:36px;margin-bottom:8px}.notifications-header p,.card-title p,.audience-option small,.push-card p,.phone-meta,.history-card p{color:var(--text-secondary);font-size:14px}.header-link,.notification-tabs button,.toggle-group button,.send-button,.pagination button{min-height:40px;padding:9px 13px;border:1px solid var(--border);border-radius:8px;background:rgba(255,255,255,.04);color:var(--text-primary);font-weight:800;cursor:pointer}.notification-tabs{display:flex;gap:8px;width:max-content;padding:8px;margin-bottom:22px}.notification-tabs button,.send-button,.success-message{display:inline-flex;align-items:center;gap:8px}.notification-tabs svg,.card-title svg,.send-button svg,.success-message svg,.reach-estimate svg{width:18px;height:18px}.notification-tabs button.active,.toggle-group button.active,.send-button{background:linear-gradient(135deg,var(--accent-hover),var(--accent));border-color:var(--accent)}.send-layout{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:24px}.send-main{display:grid;gap:22px}.notify-card,.preview-card,.history-card{padding:24px}.card-title{display:flex;align-items:center;gap:12px;margin-bottom:18px}.card-title h2,.preview-card h2{color:var(--text-primary);font-size:20px}.card-title svg{color:var(--accent)}.audience-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.audience-option{display:grid;grid-template-columns:auto 1fr;gap:5px 10px;text-align:left;padding:16px;border:1px solid var(--border);border-radius:16px;background:rgba(255,255,255,.04);color:var(--text-primary);cursor:pointer}.audience-option.selected{border-color:var(--accent);background:rgba(128,0,32,.16)}.radio-dot{width:16px;height:16px;border:2px solid var(--border);border-radius:50%;margin-top:2px}.audience-option.selected .radio-dot{border-color:var(--accent);box-shadow:inset 0 0 0 4px rgba(128,0,32,.9);background:#fff}.audience-option small{grid-column:2}.conditional-field{margin-top:16px}.reach-estimate{display:flex;align-items:center;gap:8px;margin-top:16px;padding:12px;border-radius:12px;background:rgba(128,0,32,.12);color:var(--text-primary);font-weight:800}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}label{display:flex;flex-direction:column;gap:8px;color:var(--text-secondary);font-size:13px;font-weight:700}.wide-field{grid-column:1/-1}input,select,textarea{width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--border);background:rgba(255,255,255,.05);color:var(--text-primary);outline:none}textarea{min-height:130px;resize:vertical}input:focus,select:focus,textarea:focus{border-color:var(--accent);box-shadow:0 0 0 4px rgba(128,0,32,.1)}label span{align-self:flex-end;color:var(--text-secondary);font-size:12px}.toggle-group{display:flex;gap:10px;flex-wrap:wrap}.inline-toggle{display:flex;flex-direction:row;align-items:center;justify-content:flex-start}.inline-toggle input{width:auto}.send-actions{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:20px;flex-wrap:wrap}.send-button:disabled{opacity:.55;cursor:not-allowed}.success-message{color:#86efac;font-weight:800}.phone-shell{min-height:560px;border-radius:36px;padding:18px;background:linear-gradient(180deg,#151923,#0c0f15);border:1px solid rgba(255,255,255,.12);box-shadow:inset 0 0 0 8px rgba(255,255,255,.03)}.phone-top{text-align:center;color:#f7edef;font-weight:800;margin-bottom:120px}.push-card{display:flex;gap:12px;padding:14px;border-radius:18px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(18px);color:var(--text-primary)}.push-icon{width:38px;height:38px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border-radius:10px;background:rgba(128,0,32,.8)}.push-icon svg{width:20px;height:20px}.push-card strong{display:block;margin-bottom:5px}.push-card span{color:#cbd5e1;font-size:12px}.phone-meta{display:flex;flex-direction:column;gap:6px;margin-top:16px;text-align:center}.history-table-wrap{overflow-x:auto}.history-table{width:100%;min-width:980px;border-collapse:collapse}.history-table th{padding:15px 16px;text-align:left;color:var(--text-secondary);font-size:12px;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid var(--border)}.history-table td{padding:15px 16px;color:var(--text-primary);font-size:14px;border-bottom:1px solid var(--border)}.history-table tbody tr:not(.expanded-row){cursor:pointer}.history-table tbody tr:not(.expanded-row):hover td{background:rgba(247,237,239,.05)}.history-title{font-weight:800}.status-pill{padding:6px 9px;border-radius:999px;border:1px solid rgba(255,255,255,.08);font-size:12px;font-weight:800}.status-pill.sent{color:#86efac;background:rgba(34,197,94,.12)}.status-pill.scheduled{color:#fbbf24;background:rgba(245,158,11,.12)}.status-pill.failed{color:#fca5a5;background:rgba(239,68,68,.12)}.expanded-row td{background:rgba(128,0,32,.1)!important}.expanded-row strong{display:block;margin-bottom:6px}.pagination{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:18px;color:var(--text-secondary)}.pagination button:disabled{opacity:.45;cursor:not-allowed}@media(max-width:1100px){.send-layout{grid-template-columns:1fr}.preview-card{max-width:460px}}@media(max-width:720px){.notifications-header,.send-actions{align-items:flex-start;flex-direction:column}.notification-tabs{width:100%}.notification-tabs button{flex:1}.audience-grid,.form-grid{grid-template-columns:1fr}.phone-shell{min-height:460px}.phone-top{margin-bottom:80px}}
      `}</style>
    </section>
  );
}
