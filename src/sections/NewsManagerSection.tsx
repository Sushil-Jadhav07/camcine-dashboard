import { useState } from 'react';
import type { ReactNode } from 'react';
import { AlertCircle, Edit2, Eye, Globe, Plus, Radio, Trash2, Wifi } from 'lucide-react';
import type { Section } from '../App';

interface NewsManagerSectionProps {
  onNavigate: (section: Section) => void;
}

type StreamStatus = 'Live' | 'Offline' | 'Scheduled';

interface Stream {
  id: number;
  region: string;
  language: string;
  channel: string;
  url: string;
  status: StreamStatus;
  latency: string;
  lastChecked: string;
  active: boolean;
  description: string;
}

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal'
];

const languages = ['Hindi', 'Marathi', 'Gujarati', 'Punjabi', 'Bengali', 'Tamil', 'Kannada', 'Malayalam', 'Telugu'];

const initialStreams: Stream[] = [
  { id: 1, region: 'Maharashtra', language: 'Marathi', channel: 'Maha Live 24x7', url: 'https://cdn.news.example.com/maharashtra/live/stream.m3u8', status: 'Live', latency: '~2.4s', lastChecked: '1 min ago', active: true, description: 'Licensed regional news stream.' },
  { id: 2, region: 'Gujarat', language: 'Gujarati', channel: 'Gujarat Samachar Live', url: 'https://cdn.news.example.com/gujarat/live/stream.m3u8', status: 'Live', latency: '~2.1s', lastChecked: '2 min ago', active: true, description: 'Statewide news aggregation.' },
  { id: 3, region: 'Punjab', language: 'Punjabi', channel: 'Punjab Now', url: 'https://cdn.news.example.com/punjab/live/stream.m3u8', status: 'Live', latency: '~2.7s', lastChecked: '1 min ago', active: true, description: 'Licensed Punjabi news stream.' },
  { id: 4, region: 'Delhi', language: 'Hindi', channel: 'Delhi Desk', url: 'https://cdn.news.example.com/delhi/live/stream.m3u8', status: 'Live', latency: '~2.3s', lastChecked: 'just now', active: true, description: 'NCR news coverage.' },
  { id: 5, region: 'UP', language: 'Hindi', channel: 'UP Bulletin', url: 'https://cdn.news.example.com/up/live/stream.m3u8', status: 'Live', latency: '~2.9s', lastChecked: '3 min ago', active: true, description: 'Uttar Pradesh stream.' },
  { id: 6, region: 'West Bengal', language: 'Bengali', channel: 'Bangla Live', url: 'https://cdn.news.example.com/bengal/live/stream.m3u8', status: 'Offline', latency: '-', lastChecked: '18 min ago', active: false, description: 'Temporarily offline.' },
  { id: 7, region: 'Tamil Nadu', language: 'Tamil', channel: 'Tamil Nadu Newsline', url: 'https://cdn.news.example.com/tamilnadu/live/stream.m3u8', status: 'Live', latency: '~2.0s', lastChecked: '1 min ago', active: true, description: 'Licensed Tamil stream.' },
  { id: 8, region: 'Karnataka', language: 'Kannada', channel: 'Karnataka Live', url: 'https://cdn.news.example.com/karnataka/live/stream.m3u8', status: 'Live', latency: '~2.6s', lastChecked: '2 min ago', active: true, description: 'Kannada regional news.' },
  { id: 9, region: 'Kerala', language: 'Malayalam', channel: 'Kerala Signal', url: 'https://cdn.news.example.com/kerala/live/stream.m3u8', status: 'Offline', latency: '-', lastChecked: '24 min ago', active: false, description: 'Maintenance window.' },
  { id: 10, region: 'Andhra/Telangana', language: 'Telugu', channel: 'Telugu News Grid', url: 'https://cdn.news.example.com/telugu/live/stream.m3u8', status: 'Live', latency: '~2.5s', lastChecked: '2 min ago', active: true, description: 'AP and Telangana stream.' },
  { id: 11, region: 'Rajasthan', language: 'Hindi', channel: 'Rajasthan Report', url: 'https://cdn.news.example.com/rajasthan/live/stream.m3u8', status: 'Scheduled', latency: '-', lastChecked: '6 min ago', active: true, description: 'Scheduled to go live.' },
];

const clips = [
  { title: 'Mumbai Rain Alert', region: 'Maharashtra', duration: '3:12', thumb: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&h=320&fit=crop' },
  { title: 'Delhi Policy Brief', region: 'Delhi', duration: '6:40', thumb: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=500&h=320&fit=crop' },
  { title: 'Punjab Farm Update', region: 'Punjab', duration: '4:18', thumb: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=320&fit=crop' },
  { title: 'Chennai Metro Report', region: 'Tamil Nadu', duration: '8:05', thumb: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&h=320&fit=crop' },
];

const health = [
  ['Maharashtra', 'healthy'], ['Gujarat', 'healthy'], ['Punjab', 'healthy'], ['Delhi', 'healthy'],
  ['UP', 'degraded'], ['West Bengal', 'offline'], ['Tamil Nadu', 'healthy'], ['Karnataka', 'healthy'],
  ['Kerala', 'offline'], ['Andhra/Telangana', 'healthy'], ['Rajasthan', 'degraded']
];

const blankStream: Stream = {
  id: 0,
  region: 'Maharashtra',
  language: 'Marathi',
  channel: '',
  url: 'https://cdn.news.example.com/stream.m3u8',
  status: 'Live',
  latency: '~2.4s',
  lastChecked: 'just now',
  active: true,
  description: '',
};

export function NewsManagerSection({ onNavigate }: NewsManagerSectionProps) {
  const [streams, setStreams] = useState(initialStreams);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Stream>(blankStream);
  const [saving, setSaving] = useState(false);

  const openModal = (stream?: Stream) => {
    setEditing(stream ? { ...stream } : { ...blankStream, id: Date.now() });
    setModalOpen(true);
  };

  const saveStream = () => {
    setSaving(true);
    setTimeout(() => {
      setStreams((current) => {
        const exists = current.some((stream) => stream.id === editing.id);
        return exists ? current.map((stream) => stream.id === editing.id ? editing : stream) : [editing, ...current];
      });
      setSaving(false);
      setModalOpen(false);
    }, 1000);
  };

  const toggleStream = (id: number) => {
    setStreams((current) => current.map((stream) => {
      if (stream.id !== id) return stream;
      const active = !stream.active;
      return { ...stream, active, status: active ? 'Live' : 'Offline', latency: active ? '~2.4s' : '-' };
    }));
  };

  return (
    <section className="news-section">
      <div className="news-bg" />
      <div className="news-overlay" />
      <div className="news-content">
        <div className="news-header">
          <div>
            <h1>News Streams</h1>
            <p>Licensed LL-HLS streams by Indian state and region.</p>
          </div>
          <div className="header-actions">
            <span className="live-indicator"><i />8 streams broadcasting live</span>
            <button onClick={() => openModal()}><Plus /> Add Stream</button>
          </div>
        </div>

        <div className="stats-grid">
          <Stat icon={<Radio />} label="Live Streams" value="8" pulse="green" />
          <Stat icon={<AlertCircle />} label="Offline Streams" value="3" pulse="red" />
          <Stat icon={<Globe />} label="Total Regions Covered" value="11" />
        </div>

        <div className="streams-card">
          <div className="table-wrap">
            <table className="streams-table">
              <thead>
                <tr>
                  <th>Region/State</th><th>Language</th><th>Channel Name</th><th>Stream URL</th><th>Status</th><th>Latency</th><th>Last Checked</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {streams.map((stream, index) => (
                  <tr key={stream.id} style={{ animationDelay: `${index * 0.04}s` }}>
                    <td className="region-cell">🗺️ {stream.region}</td>
                    <td>{stream.language}</td>
                    <td>{stream.channel}</td>
                    <td><div className="url-cell"><span>{stream.url}</span><button onClick={() => navigator.clipboard?.writeText(stream.url)}>Copy</button></div></td>
                    <td><StatusBadge status={stream.status} /></td>
                    <td>{stream.status === 'Live' ? stream.latency : '-'}</td>
                    <td>{stream.lastChecked}</td>
                    <td>
                      <div className="action-row">
                        <button onClick={() => openModal(stream)} title="Edit"><Edit2 /></button>
                        <button onClick={() => toggleStream(stream.id)} title="Toggle On/Off"><Wifi /></button>
                        <button onClick={() => setStreams((current) => current.filter((item) => item.id !== stream.id))} title="Delete"><Trash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lower-grid">
          <section className="clips-card">
            <div className="card-title">
              <div><h2>News Clips (VOD)</h2><p>Short recordings from licensed live streams.</p></div>
              <button onClick={() => onNavigate('add-title-type')}><UploadIcon /> Upload Clip</button>
            </div>
            <div className="clip-grid">
              {clips.map((clip) => (
                <article className="clip-card" key={clip.title}>
                  <img src={clip.thumb} alt="" />
                  <h3>{clip.title}</h3>
                  <p>{clip.region} • {clip.duration}</p>
                  <button><Eye /> View Clip</button>
                </article>
              ))}
            </div>
          </section>

          <section className="health-card">
            <h2>Stream Health Monitor</h2>
            <div className="health-list">
              {health.map(([region, status]) => (
                <div className="health-row" key={region}>
                  <span>{region}</span>
                  <div className="health-bar"><div className={status} /></div>
                  <strong>{status}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="stream-modal">
            <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
            <h2>{streams.some((stream) => stream.id === editing.id) ? 'Edit Stream' : 'Add Stream'}</h2>
            <div className="modal-grid">
              <label>Region/State<select value={editing.region} onChange={(e) => setEditing({ ...editing, region: e.target.value })}>{states.map((state) => <option key={state}>{state}</option>)}</select></label>
              <label>Language<select value={editing.language} onChange={(e) => setEditing({ ...editing, language: e.target.value })}>{languages.map((language) => <option key={language}>{language}</option>)}</select></label>
              <label>Channel Name<input value={editing.channel} onChange={(e) => setEditing({ ...editing, channel: e.target.value })} /></label>
              <label>Stream URL<input value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} /></label>
              <label className="wide">Description<textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></label>
              <label className="toggle-label"><input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked, status: e.target.checked ? 'Live' : 'Offline' })} /> Active</label>
            </div>
            <button className="save-btn" onClick={saveStream} disabled={saving}>{saving ? 'Saving...' : 'Save Stream'}</button>
          </div>
        </div>
      )}

      <style>{`
        .news-section{position:relative;min-height:100vh;padding:28px 0 56px}.news-bg{position:fixed;inset:0;background-image:url('/dashboard_bg.jpg');background-size:cover;background-position:center;background-attachment:fixed}.news-overlay{position:fixed;inset:0;background:linear-gradient(to bottom,rgba(22,7,9,.86),rgba(22,7,9,.93) 50%,rgba(22,7,9,.98))}.news-content{position:relative;z-index:10;max-width:1400px;margin:0 auto;padding:0 24px}.news-header,.stat-card,.streams-card,.clips-card,.health-card,.stream-modal{background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02)),rgba(50,18,23,.58);border:1px solid var(--border);border-radius:26px;backdrop-filter:blur(24px);box-shadow:var(--shadow-soft)}.news-header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:26px 30px;margin-bottom:24px}.news-header h1{font-size:36px;color:var(--text-primary);margin-bottom:8px}.news-header p,.card-title p{color:var(--text-secondary);font-size:14px}.header-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.header-actions button,.card-title button,.url-cell button,.save-btn{display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:9px 13px;border:1px solid var(--border);border-radius:8px;background:rgba(128,0,32,.14);color:var(--text-primary);font-weight:800;cursor:pointer}.header-actions svg,.card-title svg,.action-row svg,.clip-card svg{width:16px;height:16px}.live-indicator{display:inline-flex;align-items:center;gap:8px;color:#86efac;font-size:13px;font-weight:800}.live-indicator i,.dot{width:9px;height:9px;border-radius:50%;display:inline-block}.live-indicator i,.dot.live{background:#22c55e;animation:pulse 1.4s ease infinite}.dot.offline{background:#ef4444}.dot.scheduled{background:#f59e0b}.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}.stat-card{display:flex;align-items:center;gap:14px;padding:20px}.stat-icon{width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:16px;color:var(--accent);background:rgba(128,0,32,.1);border:1px solid rgba(255,255,255,.08)}.stat-card span{display:block;color:var(--text-secondary);font-size:12px;text-transform:uppercase;letter-spacing:.08em}.stat-card strong{display:flex;align-items:center;gap:8px;color:var(--text-primary);font-size:26px}.table-wrap{overflow-x:auto}.streams-table{width:100%;min-width:1060px;border-collapse:collapse}.streams-table th{padding:16px 18px;color:var(--text-secondary);font-size:12px;text-align:left;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid var(--border)}.streams-table td{padding:16px 18px;color:var(--text-primary);font-size:14px;border-bottom:1px solid var(--border)}.streams-table tr{animation:rise .45s ease both}.streams-table tr:hover td{background:rgba(247,237,239,.05)}.region-cell{font-weight:800}.url-cell{display:flex;align-items:center;gap:10px;max-width:260px}.url-cell span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-secondary)}.status-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.08);font-size:12px;font-weight:800}.status-badge.live{color:#86efac;background:rgba(34,197,94,.12)}.status-badge.offline{color:#fca5a5;background:rgba(239,68,68,.12)}.status-badge.scheduled{color:#fbbf24;background:rgba(245,158,11,.12)}.action-row{display:flex;gap:8px}.action-row button{width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:1px solid var(--border);border-radius:8px;background:rgba(255,255,255,.04);color:var(--text-primary);cursor:pointer}.lower-grid{display:grid;grid-template-columns:2fr 1fr;gap:24px;margin-top:24px}.clips-card,.health-card{padding:24px}.card-title{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:18px}.card-title h2,.health-card h2,.stream-modal h2{color:var(--text-primary);font-size:20px}.clip-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.clip-card{padding:12px;border:1px solid var(--border);border-radius:18px;background:rgba(255,255,255,.04)}.clip-card img{width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:12px;margin-bottom:10px}.clip-card h3{color:var(--text-primary);font-size:14px}.clip-card p{color:var(--text-secondary);font-size:12px;margin:5px 0 10px}.clip-card button{display:flex;align-items:center;gap:6px;border:none;background:transparent;color:var(--accent);font-weight:800;cursor:pointer}.health-list{display:grid;gap:12px;margin-top:18px}.health-row{display:grid;grid-template-columns:1fr 1.4fr auto;gap:10px;align-items:center;color:var(--text-secondary);font-size:13px}.health-row strong{text-transform:capitalize}.health-bar{height:9px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden}.health-bar div{height:100%;border-radius:inherit}.health-bar .healthy{width:96%;background:#22c55e}.health-bar .degraded{width:58%;background:#f59e0b}.health-bar .offline{width:24%;background:#ef4444}.modal-backdrop{position:fixed;inset:0;z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(7,2,3,.72);backdrop-filter:blur(8px)}.stream-modal{position:relative;width:min(760px,100%);padding:28px}.modal-close{position:absolute;right:18px;top:18px;width:36px;height:36px;border:1px solid var(--border);border-radius:8px;background:rgba(255,255,255,.04);color:var(--text-primary);cursor:pointer}.modal-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin:20px 0}label{display:flex;flex-direction:column;gap:8px;color:var(--text-secondary);font-size:13px;font-weight:700}.wide{grid-column:1/-1}.toggle-label{flex-direction:row;align-items:center}input,select,textarea{width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--border);background:rgba(255,255,255,.05);color:var(--text-primary);outline:none}textarea{min-height:100px;resize:vertical}.save-btn{min-width:140px;justify-content:center}.save-btn:disabled{opacity:.6;cursor:not-allowed}@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.4)}50%{box-shadow:0 0 0 9px rgba(34,197,94,0)}}@keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@media(max-width:1180px){.lower-grid{grid-template-columns:1fr}.clip-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:760px){.news-header,.card-title{align-items:flex-start;flex-direction:column}.stats-grid,.clip-grid,.modal-grid{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}

function Stat({ icon, label, value, pulse }: { icon: ReactNode; label: string; value: string; pulse?: 'green' | 'red' }) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{pulse && <i className={`dot ${pulse === 'green' ? 'live' : 'offline'}`} />}{value}</strong></div></div>;
}

function StatusBadge({ status }: { status: StreamStatus }) {
  return <span className={`status-badge ${status.toLowerCase()}`}><i className={`dot ${status.toLowerCase()}`} />{status}</span>;
}

function UploadIcon() {
  return <Plus />;
}
