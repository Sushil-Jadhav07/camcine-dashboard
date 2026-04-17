import { useEffect, useState } from 'react';
import {
  Activity,
  BarChart3,
  Clock3,
  Download,
  FileText,
  Search,
  Users,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const historyData = [
  { month: 'Jan', value: 20 },
  { month: 'Feb', value: 31 },
  { month: 'Mar', value: 24 },
  { month: 'Apr', value: 16 },
  { month: 'May', value: 29 },
  { month: 'Jun', value: 23 },
  { month: 'Jul', value: 34 },
  { month: 'Aug', value: 36 },
  { month: 'Sep', value: 29 },
  { month: 'Oct', value: 27 },
  { month: 'Nov', value: 32 },
  { month: 'Dec', value: 35 },
];

const topPages = [
  ['homepage', 81.7],
  ['blog/seo-tips', 8.1],
  ['resources/ebook', 4.2],
  ['pricing', 2.5],
  ['blog/content-marketing', 2.9],
  ['blog/social-media-strategy', 2.4],
  ['features', 2.1],
  ['case-studies', 2.0],
  ['contact', 1.8],
  ['about', 1.5],
];

const tableRows = [
  ['/resources/guide', 387, 215, '28.9%', 81],
  ['/blog/content-marketing-tips', 720, 180, '32.5%', 78],
  ['/blog/seo-best-practices', 846, 147, '38.2%', 72],
  ['/case-studies/ecommerce', 580, 160, '35%', 70],
  ['/features/analytics', 512, 113, '41.7%', 68],
];

const metricCards = [
  { label: 'Total Pages Viewed', value: '12.4K', delta: '+0.9%', icon: Users },
  { label: 'Avg. Time on Page', value: '2:45 min', delta: '+0.8%', icon: Clock3 },
  { label: 'Top Content Type', value: '12.5%', delta: '+0.5%', icon: FileText },
  { label: 'Scroll Depth', value: '12.5%', delta: '+0.6%', icon: Activity },
];

export function AnalyticsSection() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [sortMetric, setSortMetric] = useState('scrollDepth');
  const [direction, setDirection] = useState('desc');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 120);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`dashboard-shell ${isVisible ? 'visible' : ''}`}>
      <div className="shell-container">
        <div className="dashboard-topbar">
          <div className="topbar-title">
            <div className="topbar-icon">
              <BarChart3 size={18} />
            </div>
            <div>
              <h1>Analytics</h1>
              <p>Monthly trends for user engagement and page behavior.</p>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="topbar-search">
              <Search size={16} />
              <input type="text" placeholder="Search Anything" />
            </div>
            <select className="select" value={selectedPeriod} onChange={(event) => setSelectedPeriod(event.target.value)}>
              <option value="7d">7 days</option>
              <option value="30d">30 days</option>
              <option value="90d">90 days</option>
              <option value="1y">1 year</option>
            </select>
            <div className="topbar-user">
              <div className="user-badge">A</div>
              <div>
                <strong style={{ display: 'block', fontSize: 13 }}>admin</strong>
                <span className="subtle">admin@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="metric-grid">
          {metricCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.label} className="metric-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <span className="metric-label">{card.label}</span>
                    <strong className="metric-value">{card.value}</strong>
                    <div className="metric-meta" style={{ color: 'var(--danger)', marginTop: 10 }}>{card.delta}</div>
                  </div>
                  <div className="topbar-icon" style={{ width: 32, height: 32, borderRadius: 10 }}>
                    <Icon size={14} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="analytics-layout">
          <div className="chart-card">
            <div className="section-heading">
              <div>
                <h3>Average Time History</h3>
                <p>Monthly trends of user engagement duration with bounce rate comparison.</p>
              </div>
            </div>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="analyticsAreaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.56} />
                      <stop offset="95%" stopColor="var(--accent-strong)" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--line)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '14px',
                      border: '1px solid var(--line)',
                      background: 'var(--panel-strong)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={3} fill="url(#analyticsAreaFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="toolbar" style={{ marginTop: 12 }}>
              <div>
                <strong style={{ fontSize: 13 }}>Avg. Time on Page</strong>
                <div className="subtle">2.7 min (+5% vs last month)</div>
              </div>
              <div className="inline-meta" style={{ color: 'var(--accent)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--accent)', display: 'inline-block' }} />
                Avg. Time (min)
              </div>
            </div>
          </div>

          <div className="chart-card">
            <div className="section-heading">
              <div>
                <h3>Top 10 pages by sessions</h3>
                <p>Fast scan of the highest traffic destinations.</p>
              </div>
            </div>
            <div className="progress-list">
              {topPages.map(([label, value]) => (
                <div key={label} className="progress-item">
                  <div className="progress-row">
                    <span>{label}</span>
                    <span>{value}K</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${Math.min(value, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="surface-panel">
          <div className="section-heading">
            <div>
              <h3>Top Content by Engagement</h3>
              <p>Key pages sorted by sessions. Hover to compare engagement metrics.</p>
            </div>
            <button className="btn btn-primary">
              <Download size={16} />
              Export
            </button>
          </div>

          <div className="toolbar" style={{ marginBottom: 16 }}>
            <div className="toolbar-group">
              <span className="metric-label">Sort by</span>
              <select className="select" value={sortMetric} onChange={(event) => setSortMetric(event.target.value)}>
                <option value="scrollDepth">Scroll Depth</option>
                <option value="sessions">Sessions</option>
                <option value="averageTime">Average Time</option>
                <option value="bounceRate">Bounce Rate</option>
              </select>
            </div>
            <div className="toolbar-group">
              <button className={`btn ${direction === 'asc' ? 'btn-secondary' : 'btn-primary'}`} onClick={() => setDirection('asc')}>Asc</button>
              <button className={`btn ${direction === 'desc' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDirection('desc')}>Desc</button>
            </div>
          </div>

          <div className="table-shell">
            <table className="data-table table-striped">
              <thead>
                <tr>
                  <th>Page URL</th>
                  <th>Sessions</th>
                  <th>Average Time</th>
                  <th>Bounce Rate</th>
                  <th>Scroll Depth</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map(([url, sessions, averageTime, bounceRate, scrollDepth]) => (
                  <tr key={url}>
                    <td>{url}</td>
                    <td>{sessions}</td>
                    <td>{averageTime}</td>
                    <td>{bounceRate}</td>
                    <td>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${scrollDepth}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
