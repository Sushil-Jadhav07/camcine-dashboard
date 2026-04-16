import { useEffect, useState } from 'react';
import {
  BarChart3,
  ChevronRight,
  Eye,
  Film,
  IndianRupee,
  ListMusic,
  Settings,
  TrendingDown,
  TrendingUp,
  Upload,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Section } from '../App';

interface ManagerDashboardSectionProps {
  onNavigate: (section: Section) => void;
  userId: string;
}

const stats = [
  {
    label: 'My Titles',
    value: '12',
    change: '+3',
    trend: 'up',
    icon: Film,
  },
  {
    label: 'Total Views',
    value: '48.2K',
    change: '+18.4%',
    trend: 'up',
    icon: Eye,
  },
  {
    label: 'This Month Earnings',
    value: '₹12,450',
    change: '+12.8%',
    trend: 'up',
    icon: IndianRupee,
  },
  {
    label: 'Pending Payout',
    value: '₹8,200',
    change: '-6.2%',
    trend: 'down',
    icon: Wallet,
  },
];

const earningsData = [
  { month: 'Jan', tvod: 5200, avod: 2100 },
  { month: 'Feb', tvod: 6800, avod: 2600 },
  { month: 'Mar', tvod: 6100, avod: 3100 },
  { month: 'Apr', tvod: 8200, avod: 3600 },
  { month: 'May', tvod: 9400, avod: 4100 },
  { month: 'Jun', tvod: 10450, avod: 5200 },
];

const contentRows = [
  {
    id: 1,
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=160&h=100&fit=crop',
    title: 'Crimson City',
    type: 'Movie',
    status: 'Published',
    views: '14.8K',
    earnings: '₹4,820',
  },
  {
    id: 2,
    thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=160&h=100&fit=crop',
    title: 'Monsoon Notes',
    type: 'Song',
    status: 'Published',
    views: '11.2K',
    earnings: '₹2,960',
  },
  {
    id: 3,
    thumbnail: 'https://images.unsplash.com/photo-1497015289639-54688650d173?w=160&h=100&fit=crop',
    title: 'The Archive Room',
    type: 'Series',
    status: 'Review',
    views: '8.6K',
    earnings: '₹2,180',
  },
  {
    id: 4,
    thumbnail: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=160&h=100&fit=crop',
    title: 'Stage Lights',
    type: 'Movie',
    status: 'Published',
    views: '7.9K',
    earnings: '₹1,640',
  },
  {
    id: 5,
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=160&h=100&fit=crop',
    title: 'Midnight Raag',
    type: 'Song',
    status: 'Draft',
    views: '5.7K',
    earnings: '₹850',
  },
];

const quickActions = [
  { label: 'Upload Movie', icon: Upload, action: 'add-title-type' as Section },
  { label: 'Upload Song', icon: ListMusic, action: 'songs' as Section },
  { label: 'View Earnings', icon: BarChart3, action: 'manager-earnings' as Section },
  { label: 'My Profile', icon: Settings, action: 'settings' as Section },
];

export function ManagerDashboardSection({ onNavigate, userId }: ManagerDashboardSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="manager-dashboard-section">
      <div
        className="manager-dashboard-bg"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(1.06)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      />
      <div className="manager-dashboard-overlay" />

      <div className="manager-dashboard-content">
        <div
          className="manager-dashboard-header"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
            transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
          }}
        >
          <h1>manager Dashboard</h1>
          <p>{userId ? `${userId}, track your content, views, and revenue.` : 'Track your content, views, and revenue.'}</p>
        </div>

        <div
          className="manager-stats-grid"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
            transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s',
          }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="manager-stat-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="manager-stat-header">
                  <div className="manager-stat-icon">
                    <Icon />
                  </div>
                  <div className={`manager-stat-change ${stat.trend}`}>
                    {stat.trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="manager-stat-value">{stat.value}</div>
                <div className="manager-stat-label">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div
          className="manager-dashboard-card manager-chart-card"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s',
          }}
        >
          <div className="manager-card-header">
            <h3>My Earnings Breakdown</h3>
            <button className="btn btn-ghost" onClick={() => onNavigate('manager-earnings')}>
              View Details <ChevronRight />
            </button>
          </div>
          <div className="manager-chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="colorTvod" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.34} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAvod" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.34} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,246,251,0.08)" />
                <XAxis dataKey="month" stroke="#c8afb4" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#c8afb4"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `₹${Number(value) / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: '#231013',
                    border: '1px solid rgba(247,237,239,0.1)',
                    borderRadius: '10px',
                    color: '#f7edef',
                  }}
                  formatter={(value: number, name: string) => [
                    `₹${value.toLocaleString('en-IN')}`,
                    name === 'tvod' ? 'TVOD earnings' : 'AVOD earnings',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="tvod"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTvod)"
                />
                <Area
                  type="monotone"
                  dataKey="avod"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAvod)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="manager-dashboard-card manager-content-card"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s',
          }}
        >
          <div className="manager-card-header">
            <h3>My Content</h3>
            <button className="btn btn-ghost" onClick={() => onNavigate('content')}>
              View All
            </button>
          </div>
          <div className="manager-table-wrap">
            <table className="manager-content-table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Earnings</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contentRows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <img className="manager-title-thumb" src={row.thumbnail} alt="" />
                    </td>
                    <td>
                      <span className="manager-title-name">{row.title}</span>
                    </td>
                    <td>{row.type}</td>
                    <td>
                      <span className={`manager-status ${row.status.toLowerCase()}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>{row.views}</td>
                    <td>{row.earnings}</td>
                    <td>
                      <button className="manager-table-action" onClick={() => onNavigate('content-detail')}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className="manager-quick-actions"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease 0.6s, transform 0.6s ease 0.6s',
          }}
        >
          <h3>Quick Actions</h3>
          <div className="manager-quick-actions-grid">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="manager-quick-action-btn"
                  onClick={() => onNavigate(action.action)}
                >
                  <div className="manager-quick-action-icon">
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
        .manager-dashboard-section {
          position: relative;
          min-height: 100vh;
          padding: 28px 0 56px;
        }

        .manager-dashboard-bg {
          position: fixed;
          inset: 0;
          background-image: url('/dashboard_bg.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .manager-dashboard-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(22, 7, 9, 0.86) 0%,
            rgba(22, 7, 9, 0.93) 50%,
            rgba(22, 7, 9, 0.98) 100%
          );
        }

        .manager-dashboard-content {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .manager-dashboard-header {
          margin-bottom: 34px;
          padding: 26px 30px;
          border: 1px solid var(--border);
          border-radius: 28px;
          background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(19, 23, 30, 0.84);
          backdrop-filter: blur(26px);
          box-shadow: var(--shadow-soft);
        }

        .manager-dashboard-header h1 {
          font-size: 42px;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .manager-dashboard-header p {
          color: var(--text-secondary);
          font-size: 16px;
          max-width: 560px;
        }

        .manager-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .manager-stat-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(19, 23, 30, 0.86);
          border: 1px solid var(--border);
          border-radius: 26px;
          padding: 22px;
          backdrop-filter: blur(26px);
          box-shadow: var(--shadow-soft);
          transition: all 0.3s ease;
        }

        .manager-stat-card:hover {
          transform: translateY(-8px);
        }

        .manager-stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .manager-stat-icon {
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

        .manager-stat-icon svg {
          width: 22px;
          height: 22px;
        }

        .manager-stat-change {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
        }

        .manager-stat-change.up {
          color: var(--success);
        }

        .manager-stat-change.down {
          color: var(--error);
        }

        .manager-stat-change svg {
          width: 14px;
          height: 14px;
        }

        .manager-stat-value {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .manager-stat-label {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .manager-dashboard-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(19, 23, 30, 0.86);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 26px;
          backdrop-filter: blur(26px);
          box-shadow: var(--shadow-soft);
          margin-bottom: 32px;
        }

        .manager-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
        }

        .manager-card-header h3 {
          font-size: 18px;
          color: var(--text-primary);
        }

        .manager-card-header .btn {
          font-size: 13px;
          padding: 8px 12px;
        }

        .manager-card-header .btn svg {
          width: 16px;
          height: 16px;
        }

        .manager-chart-container {
          margin-top: 16px;
        }

        .manager-table-wrap {
          overflow-x: auto;
        }

        .manager-content-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 860px;
        }

        .manager-content-table th {
          padding: 0 14px 14px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-align: left;
          text-transform: uppercase;
          color: var(--text-secondary);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .manager-content-table td {
          padding: 16px 14px;
          font-size: 14px;
          color: var(--text-secondary);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .manager-content-table tbody tr:hover {
          background: rgba(255,255,255,0.03);
        }

        .manager-title-thumb {
          width: 82px;
          height: 52px;
          object-fit: cover;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          display: block;
        }

        .manager-title-name {
          color: var(--text-primary);
          font-weight: 600;
        }

        .manager-status {
          display: inline-flex;
          align-items: center;
          padding: 5px 9px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-primary);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .manager-status.published {
          background: rgba(34, 197, 94, 0.12);
          color: #86efac;
        }

        .manager-status.review {
          background: rgba(245, 158, 11, 0.12);
          color: #fbbf24;
        }

        .manager-status.draft {
          background: rgba(148, 163, 184, 0.12);
          color: #cbd5e1;
        }

        .manager-table-action {
          background: rgba(128, 0, 32, 0.12);
          border: 1px solid rgba(128, 0, 32, 0.26);
          border-radius: 8px;
          color: var(--text-primary);
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 10px;
          transition: all 0.2s ease;
        }

        .manager-table-action:hover {
          background: rgba(128, 0, 32, 0.22);
          border-color: var(--accent);
        }

        .manager-quick-actions {
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(19, 23, 30, 0.84);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 26px;
          backdrop-filter: blur(26px);
          box-shadow: var(--shadow-soft);
        }

        .manager-quick-actions h3 {
          font-size: 18px;
          color: var(--text-primary);
          margin-bottom: 20px;
        }

        .manager-quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .manager-quick-action-btn {
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

        .manager-quick-action-btn:hover {
          border-color: var(--accent);
          transform: translateY(-6px);
          box-shadow: 0 18px 36px rgba(128, 0, 32, 0.22);
        }

        .manager-quick-action-icon {
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

        .manager-quick-action-icon svg {
          width: 24px;
          height: 24px;
        }

        @media (max-width: 1200px) {
          .manager-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .manager-stats-grid {
            grid-template-columns: 1fr;
          }

          .manager-quick-actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .manager-dashboard-header h1 {
            font-size: 32px;
          }
        }

        @media (max-width: 520px) {
          .manager-quick-actions-grid {
            grid-template-columns: 1fr;
          }

          .manager-card-header {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}
