import { useEffect, useState } from 'react';
import { 
  Film, 
  Users, 
  DollarSign, 
  Ticket,
  TrendingUp,
  TrendingDown,
  Plus,
  UserPlus,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import type { Section } from '../App';

interface DashboardSectionProps {
  onNavigate: (section: Section) => void;
}

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

const recentActivity = [
  { id: 1, action: 'New movie added', item: 'The Midnight Archive', time: '2 min ago', type: 'content' },
  { id: 2, action: 'User subscribed', item: 'Premium Plan', time: '15 min ago', type: 'subscription' },
  { id: 3, action: 'Payment received', item: '$19.99 from john@email.com', time: '32 min ago', type: 'payment' },
  { id: 4, action: 'Series updated', item: 'Cyber Chronicles S2', time: '1 hour ago', type: 'content' },
  { id: 5, action: 'Support ticket', item: 'Resolved #2847', time: '2 hours ago', type: 'support' },
];

const stats = [
  { 
    label: 'Total Titles', 
    value: '1,248', 
    change: '+12%', 
    trend: 'up',
    icon: Film 
  },
  { 
    label: 'Active Users', 
    value: '42.3K', 
    change: '+8.5%', 
    trend: 'up',
    icon: Users 
  },
  { 
    label: 'Monthly Revenue', 
    value: '$89.4K', 
    change: '+15.2%', 
    trend: 'up',
    icon: DollarSign 
  },
  { 
    label: 'Support Tickets', 
    value: '12', 
    change: '-3', 
    trend: 'down',
    icon: Ticket 
  },
];

const quickActions = [
  { label: 'Add Movie', icon: Film, action: 'add-title' as Section },
  { label: 'Add Series', icon: Plus, action: 'add-title' as Section },
  { label: 'Invite User', icon: UserPlus, action: 'users' as Section },
  { label: 'View Reports', icon: BarChart3, action: 'payments' as Section },
];

export function DashboardSection({ onNavigate }: DashboardSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="dashboard-section">
      {/* Background */}
      <div 
        className="dashboard-bg"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(1.06)',
          transition: 'opacity 0.9s ease, transform 0.9s ease'
        }}
      />
      <div className="dashboard-overlay" />

      {/* Content */}
      <div className="dashboard-content">
        {/* Header */}
        <div 
          className="dashboard-header"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
            transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s'
          }}
        >
          <h1>Dashboard</h1>
          <p>Everything happening right now.</p>
        </div>

        {/* Stats Grid */}
        <div 
          className="stats-grid"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
            transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s'
          }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label} 
                className="stat-card"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="stat-header">
                  <div className="stat-icon">
                    <Icon />
                  </div>
                  <div className={`stat-change ${stat.trend}`}>
                    {stat.trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Revenue Chart */}
          <div 
            className="dashboard-card chart-card"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s'
            }}
          >
            <div className="card-header">
              <h3>Revenue Overview</h3>
              <button className="btn btn-ghost">
                View Details <ChevronRight />
              </button>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#800020" stopOpacity={0.32}/>
                      <stop offset="95%" stopColor="#800020" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,246,251,0.08)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#c8afb4" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#c8afb4" 
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: '#231013',
                      border: '1px solid rgba(247,237,239,0.1)',
                      borderRadius: '10px',
                      color: '#f7edef'
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#800020" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div 
            className="dashboard-card activity-card"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s'
            }}
          >
            <div className="card-header">
              <h3>Recent Activity</h3>
              <button className="btn btn-ghost">View All</button>
            </div>
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-dot ${activity.type}`} />
                  <div className="activity-content">
                    <div className="activity-action">{activity.action}</div>
                    <div className="activity-item-name">{activity.item}</div>
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div 
          className="quick-actions"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease 0.6s, transform 0.6s ease 0.6s'
          }}
        >
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="quick-action-btn"
                  onClick={() => onNavigate(action.action)}
                >
                  <div className="quick-action-icon">
                    <Icon />
                  </div>
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-section {
          position: relative;
          min-height: 100vh;
          padding: 28px 0 56px;
        }

        .dashboard-bg {
          position: fixed;
          inset: 0;
          background-image: url('/dashboard_bg.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .dashboard-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(22, 7, 9, 0.86) 0%,
            rgba(22, 7, 9, 0.93) 50%,
            rgba(22, 7, 9, 0.98) 100%
          );
        }

        .dashboard-content {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .dashboard-header {
          margin-bottom: 34px;
          padding: 26px 30px;
          border: 1px solid var(--border);
          border-radius: 28px;
          background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(19, 23, 30, 0.84);
          backdrop-filter: blur(26px);
          box-shadow: var(--shadow-soft);
        }

        .dashboard-header h1 {
          font-size: 42px;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .dashboard-header p {
          color: var(--text-secondary);
          font-size: 16px;
          max-width: 560px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          border-radius: 26px;
          padding: 22px;
        }

        .stat-card:hover {
          transform: translateY(-8px);
        }

        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          background: rgba(128, 0, 32, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .stat-icon svg {
          width: 22px;
          height: 22px;
        }

        .stat-change {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
        }

        .stat-change.up {
          color: var(--success);
        }

        .stat-change.down {
          color: var(--error);
        }

        .stat-change svg {
          width: 14px;
          height: 14px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .dashboard-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(19, 23, 30, 0.86);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 26px;
          backdrop-filter: blur(26px);
          box-shadow: var(--shadow-soft);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .card-header h3 {
          font-size: 18px;
          color: var(--text-primary);
        }

        .card-header .btn {
          font-size: 13px;
          padding: 8px 12px;
        }

        .card-header .btn svg {
          width: 16px;
          height: 16px;
        }

        .chart-container {
          margin-top: 16px;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .activity-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .activity-dot.content {
          background: var(--accent);
        }

        .activity-dot.subscription {
          background: var(--success);
        }

        .activity-dot.payment {
          background: var(--accent);
        }

        .activity-dot.support {
          background: var(--warning);
        }

        .activity-content {
          flex: 1;
        }

        .activity-action {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .activity-item-name {
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .activity-time {
          font-size: 12px;
          color: var(--text-secondary);
          flex-shrink: 0;
        }

        .quick-actions {
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(19, 23, 30, 0.84);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 26px;
          backdrop-filter: blur(26px);
          box-shadow: var(--shadow-soft);
        }

        .quick-actions h3 {
          font-size: 18px;
          color: var(--text-primary);
          margin-bottom: 20px;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .quick-action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 24px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 22px;
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .quick-action-btn:hover {
          border-color: var(--accent);
          transform: translateY(-6px);
          box-shadow: 0 18px 36px rgba(128, 0, 32, 0.22);
        }

        .quick-action-icon {
          width: 54px;
          height: 54px;
          background: rgba(128, 0, 32, 0.1);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .quick-action-icon svg {
          width: 24px;
          height: 24px;
        }

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboard-header h1 {
            font-size: 32px;
          }
        }
      `}</style>
    </section>
  );
}
