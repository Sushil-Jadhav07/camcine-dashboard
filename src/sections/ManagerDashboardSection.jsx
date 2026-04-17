import { Briefcase, DollarSign, Layers3, Sparkles, Users } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 58000 },
  { month: 'Jun', revenue: 72000 },
  { month: 'Jul', revenue: 68000 },
  { month: 'Aug', revenue: 81000 },
  { month: 'Sep', revenue: 77000 },
  { month: 'Oct', revenue: 89400 },
];

const stats = [
  { label: 'Team Members', value: '12', icon: Users, note: '2 new this month' },
  { label: 'Active Projects', value: '8', icon: Layers3, note: '3 in review' },
  { label: 'Team Revenue', value: '$45.2K', icon: DollarSign, note: '12.5% uplift' },
  { label: 'Performance Score', value: '94%', icon: Sparkles, note: 'Ahead of target' },
];

export function ManagerDashboardSection({ userId }) {
  return (
    <section className="dashboard-shell">
      <div className="shell-container">
        <div className="hero-panel compact">
          <div className="hero-content hero-grid">
            <div className="hero-copy">
              <span className="hero-topline">Manager overview</span>
              <h1>Lead delivery, approvals, and revenue with less noise.</h1>
              <p>
                The functionality is unchanged. The presentation now focuses on team momentum, account clarity,
                and fast next actions for the manager role.
              </p>
            </div>
            <div className="hero-side">
              <div className="hero-stat">
                <div className="hero-kicker">Signed in as</div>
                <strong>{userId || 'Manager'}</strong>
                <span>Oversight window for current team portfolio</span>
              </div>
            </div>
          </div>
        </div>

        <div className="metric-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="metric-card">
                <div className="metric-icon">
                  <Icon size={22} />
                </div>
                <span className="eyebrow">{stat.label}</span>
                <strong>{stat.value}</strong>
                <div className="subtle" style={{ marginTop: 10 }}>{stat.note}</div>
              </div>
            );
          })}
        </div>

        <div className="content-grid-2">
          <div className="surface-panel">
            <div className="surface-content">
              <div className="section-heading">
                <div>
                  <h3>Team Revenue Arc</h3>
                  <p>Monthly trend line for the managed portfolio.</p>
                </div>
              </div>
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="managerRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c1121f" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#780000" stopOpacity={0.08} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,244,242,0.08)" vertical={false} />
                    <XAxis dataKey="month" stroke="#bf9596" />
                    <YAxis stroke="#bf9596" />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(38, 1, 6, 0.96)',
                        border: '1px solid rgba(255,244,242,0.12)',
                        borderRadius: '16px',
                      }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#c1121f" strokeWidth={3} fill="url(#managerRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="surface-panel">
            <div className="surface-content">
              <div className="section-heading">
                <div>
                  <h3>Management Actions</h3>
                  <p>Existing actions reframed as executive shortcuts.</p>
                </div>
              </div>
              <div className="list-stack">
                {[
                  { title: 'Review active team members', note: '12 profiles ready for review', icon: Users },
                  { title: 'Approve current releases', note: '3 projects awaiting decision', icon: Briefcase },
                  { title: 'Track earnings distribution', note: 'Monthly split closes in 4 days', icon: DollarSign },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="list-card">
                      <div style={{ display: 'flex', gap: 14 }}>
                        <div className="metric-icon" style={{ width: 42, height: 42 }}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <strong style={{ display: 'block', marginBottom: 4 }}>{item.title}</strong>
                          <span className="subtle">{item.note}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
