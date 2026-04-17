import {
  ArrowUpRight,
  BarChart3,
  Clock3,
  DollarSign,
  Film,
  Play,
  Search,
  Ticket,
  Users,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const metricCards = [
  { label: 'Total Pages Viewed', value: '12.4K', delta: '+0.9%', icon: Users },
  { label: 'Avg. Time on Page', value: '2:45 min', delta: '+0.8%', icon: Clock3 },
  { label: 'Top Content Type', value: 'Movies', delta: '+0.4%', icon: Film },
  { label: 'Open Tickets', value: '127', delta: '-0.3%', icon: Ticket },
];

const chartData = [
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

const quickStats = [
  ['Monthly Revenue', '$89.4K'],
  ['Active Subscribers', '42.3K'],
  ['Content Library', '1,248'],
];

export function DashboardSection({ onNavigate }) {
  return (
    <section className="dashboard-shell">
      <div className="shell-container">
        <div className="dashboard-topbar">
          <div className="topbar-title">
            <div className="topbar-icon">
              <BarChart3 size={18} />
            </div>
            <div>
              <h1>Dashboard</h1>
              <p>Overview of platform performance and audience movement.</p>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="topbar-search">
              <Search size={16} />
              <input type="text" placeholder="Search Anything" />
            </div>
            <button className="btn btn-primary" onClick={() => onNavigate('analytics')}>
              <ArrowUpRight size={16} />
              Analytics
            </button>
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
                <p>Monthly trend for user engagement duration.</p>
              </div>
            </div>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="dashboardAreaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.52} />
                      <stop offset="95%" stopColor="var(--accent-strong)" stopOpacity={0.05} />
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
                  <Area type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={3} fill="url(#dashboardAreaFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <div className="section-heading">
              <div>
                <h3>Command Summary</h3>
                <p>Fast operational pulse for this cycle.</p>
              </div>
            </div>
            <div className="list-stack">
              {quickStats.map(([label, value]) => (
                <div key={label} className="list-card">
                  <div>
                    <strong style={{ display: 'block', marginBottom: 4 }}>{label}</strong>
                    <span className="subtle">Updated in real time</span>
                  </div>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="surface-panel">
          <div className="section-heading">
            <div>
              <h3>Quick Actions</h3>
              <p>Keep the same workflows, but surface them like the reference layout.</p>
            </div>
          </div>
          <div className="content-grid-3">
            <button className="btn btn-secondary" onClick={() => onNavigate('add-title')}>
              <Film size={16} />
              Add New Title
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('content')}>
              <Play size={16} />
              Open Library
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('payments')}>
              <DollarSign size={16} />
              Review Payments
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
