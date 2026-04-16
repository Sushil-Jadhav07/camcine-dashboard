import { useMemo, useState } from 'react';
import type { ElementType, ReactElement, ReactNode } from 'react';
import {
  AlertTriangle,
  Clock,
  DollarSign,
  Eye,
  Film,
  Gauge,
  IndianRupee,
  Radio,
  TrendingUp,
  Users,
  Wifi,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Section } from '../App';

interface AnalyticsSectionProps {
  onNavigate: (section: Section) => void;
}

type AnalyticsTab = 'Content' | 'Revenue' | 'Users' | 'Quality';
type DateRange = 'Today' | '7 Days' | '30 Days' | '90 Days' | 'Custom';

const dailySessions = Array.from({ length: 30 }, (_, index) => ({
  day: `${index + 1}`,
  sessions: 4200 + Math.round(Math.sin(index / 3) * 900) + index * 110,
}));

const completionByGenre = [
  { genre: 'Thriller', rate: 78 },
  { genre: 'Drama', rate: 71 },
  { genre: 'Action', rate: 64 },
  { genre: 'Sci-Fi', rate: 69 },
  { genre: 'Comedy', rate: 74 },
  { genre: 'Horror', rate: 58 },
];

const topContentViews = [
  'Crimson City', 'Monsoon Notes', 'The Archive Room', 'Stage Lights', 'Midnight Raag',
  'Dust Roads', 'Night Market', 'River Home', 'Glass House', 'Blue Train',
].map((title, index) => ({ title, views: 98000 - index * 7200 }));

const dropoffData = Array.from({ length: 13 }, (_, index) => ({
  minute: index * 10,
  remaining: Math.max(18, 100 - index * 6.8 - Math.round(Math.sin(index) * 4)),
}));

const regionHeatmap = [
  ['Maharashtra', 95], ['Delhi', 88], ['Tamil Nadu', 82], ['Karnataka', 76], ['Telangana', 72],
  ['West Bengal', 66], ['Gujarat', 61], ['Punjab', 55], ['Kerala', 48], ['Rajasthan', 44],
  ['Uttar Pradesh', 39], ['Bihar', 31], ['Odisha', 26], ['Assam', 22], ['Goa', 18],
] as const;

const revenuePie = [
  { name: 'TVOD', value: 312000, color: '#8b5cf6' },
  { name: 'SVOD', value: 418000, color: '#800020' },
  { name: 'AVOD', value: 164000, color: '#f59e0b' },
];

const monthlyRevenue = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, index) => ({
  month,
  TVOD: 26000 + index * 4200,
  SVOD: 39000 + index * 5200,
  AVOD: 14000 + index * 2100,
}));

const topEarningContent = [
  { title: 'Crimson City', revenue: 128000 },
  { title: 'Dust Roads', revenue: 104000 },
  { title: 'Night Market', revenue: 96000 },
  { title: 'River Home', revenue: 83000 },
  { title: 'The Archive Room', revenue: 76000 },
];

const filmmakerPayouts = [
  { name: 'Aarav Films', count: 12, earned: '₹1,42,000', status: 'Scheduled', date: 'May 1, 2026' },
  { name: 'Meera Rao', count: 8, earned: '₹98,400', status: 'Paid', date: 'Apr 1, 2026' },
  { name: 'Neha Iyer', count: 5, earned: '₹62,900', status: 'Pending', date: 'May 1, 2026' },
  { name: 'Kabir Frames', count: 7, earned: '₹84,700', status: 'Scheduled', date: 'May 1, 2026' },
];

const userGrowth = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map((month, index) => ({
  month,
  users: 26000 + index * 2750,
}));

const newReturningUsers = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'].map((week, index) => ({
  week,
  New: 2200 + index * 180,
  Returning: 6800 + index * 420,
}));

const planDistribution = [
  { name: 'Basic', value: 1620, color: '#f59e0b' },
  { name: 'Standard', value: 1120, color: '#800020' },
  { name: 'Premium', value: 515, color: '#8b5cf6' },
];

const cohorts = [
  ['Jan 2026', 100, 72, 61, 55, 48, 42, 39, 35, 32],
  ['Feb 2026', 100, 75, 64, 58, 51, 46, 41, 38, 34],
  ['Mar 2026', 100, 78, 68, 60, 54, 49, 44, 40, 36],
  ['Apr 2026', 100, 81, 72, 66, 59, 53, 49, 45, 41],
];

const qualityPie = [
  { name: '4K', value: 9, color: '#8b5cf6' },
  { name: '1080p', value: 34, color: '#800020' },
  { name: '720p', value: 28, color: '#f59e0b' },
  { name: '480p', value: 17, color: '#22c55e' },
  { name: '360p', value: 8, color: '#3b82f6' },
  { name: '240p', value: 4, color: '#94a3b8' },
];

const startupTrend = Array.from({ length: 30 }, (_, index) => ({
  day: `${index + 1}`,
  seconds: Number((2.4 - index * 0.015 + Math.sin(index / 4) * 0.18).toFixed(2)),
}));

const cdnPerformance = [
  { cdn: 'Cloudflare', response: 82 },
  { cdn: 'CloudFront', response: 104 },
];

const errorTypes = [
  { type: '404', count: 42 },
  { type: 'DRM license failure', count: 18 },
  { type: 'Network timeout', count: 31 },
  { type: 'Other', count: 12 },
];

const chartMargin = { top: 12, right: 18, left: 0, bottom: 8 };

export function AnalyticsSection({ onNavigate }: AnalyticsSectionProps) {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('Content');
  const [dateRange, setDateRange] = useState<DateRange>('30 Days');

  const customVisible = dateRange === 'Custom';
  const tabs: AnalyticsTab[] = ['Content', 'Revenue', 'Users', 'Quality'];

  const content = useMemo(() => {
    if (activeTab === 'Content') return <ContentAnalytics />;
    if (activeTab === 'Revenue') return <RevenueAnalytics />;
    if (activeTab === 'Users') return <UserAnalytics />;
    return <QualityAnalytics />;
  }, [activeTab]);

  return (
    <section className="analytics-section">
      <div className="analytics-bg" />
      <div className="analytics-overlay" />
      <div className="analytics-content">
        <div className="analytics-header">
          <div>
            <h1>Analytics</h1>
            <p>Platform-wide telemetry mocked from the Kafka, S3, and Athena analytics pipeline.</p>
          </div>
          <button className="header-link" onClick={() => onNavigate('dashboard')}>Dashboard</button>
        </div>

        <div className="analytics-controls">
          <div className="analytics-tabs">
            {tabs.map((tab) => (
              <button className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>
            ))}
          </div>
          <div className="range-picker">
            {(['Today', '7 Days', '30 Days', '90 Days', 'Custom'] as DateRange[]).map((range) => (
              <button className={dateRange === range ? 'active' : ''} onClick={() => setDateRange(range)} key={range}>{range}</button>
            ))}
          </div>
        </div>

        {customVisible && (
          <div className="custom-range">
            <label>Start date<input type="date" /></label>
            <label>End date<input type="date" /></label>
          </div>
        )}

        {content}
      </div>

      <style>{`
        .analytics-section{position:relative;min-height:100vh;padding:28px 0 56px}.analytics-bg{position:fixed;inset:0;background-image:url('/dashboard_bg.jpg');background-size:cover;background-position:center;background-attachment:fixed}.analytics-overlay{position:fixed;inset:0;background:linear-gradient(to bottom,rgba(22,7,9,.86),rgba(22,7,9,.93) 50%,rgba(22,7,9,.98))}.analytics-content{position:relative;z-index:10;max-width:1450px;margin:0 auto;padding:0 24px}.analytics-header,.analytics-controls,.custom-range,.stat-card,.chart-card,.heatmap-card,.table-card{background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02)),rgba(50,18,23,.58);border:1px solid var(--border);border-radius:26px;backdrop-filter:blur(24px);box-shadow:var(--shadow-soft)}.analytics-header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:26px 30px;margin-bottom:22px}.analytics-header h1{font-size:36px;color:var(--text-primary);margin-bottom:8px}.analytics-header p,.stat-card span,.chart-card p,.table-card p{color:var(--text-secondary);font-size:14px}.header-link,.analytics-tabs button,.range-picker button{min-height:38px;padding:8px 13px;border:1px solid var(--border);border-radius:8px;background:rgba(255,255,255,.04);color:var(--text-primary);font-weight:800;cursor:pointer}.analytics-controls{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px;margin-bottom:18px}.analytics-tabs,.range-picker{display:flex;gap:8px;flex-wrap:wrap}.analytics-tabs button.active,.range-picker button.active{background:linear-gradient(135deg,var(--accent-hover),var(--accent));border-color:var(--accent)}.custom-range{display:flex;gap:14px;padding:16px;margin-bottom:18px}label{display:flex;flex-direction:column;gap:8px;color:var(--text-secondary);font-size:13px;font-weight:700}input{padding:11px 13px;border-radius:10px;border:1px solid var(--border);background:rgba(255,255,255,.05);color:var(--text-primary)}.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:22px}.stat-card{display:flex;align-items:center;gap:14px;padding:20px;animation:rise .42s ease both}.stat-icon{width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:16px;color:var(--accent);background:rgba(128,0,32,.1);border:1px solid rgba(255,255,255,.08)}.stat-card strong{display:block;color:var(--text-primary);font-size:26px;margin:2px 0}.trend{color:#86efac!important;font-weight:800}.chart-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-bottom:22px}.chart-card,.heatmap-card,.table-card{padding:24px;min-width:0}.chart-card h2,.heatmap-card h2,.table-card h2{color:var(--text-primary);font-size:19px;margin-bottom:6px}.chart-box{height:320px;margin-top:16px}.wide-chart{grid-column:1/-1}.heatmap-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:16px}.state-chip{border-radius:12px;padding:14px 10px;color:#fff;font-size:13px;font-weight:800;text-align:center;border:1px solid rgba(255,255,255,.1)}.data-table{width:100%;border-collapse:collapse;margin-top:14px}.data-table th{padding:13px 14px;text-align:left;color:var(--text-secondary);font-size:12px;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid var(--border)}.data-table td{padding:14px;color:var(--text-primary);border-bottom:1px solid var(--border)}.status-pill{padding:6px 9px;border-radius:999px;background:rgba(34,197,94,.12);color:#86efac;font-weight:800;font-size:12px}.status-pill.pending{background:rgba(245,158,11,.12);color:#fbbf24}.cohort-grid{display:grid;grid-template-columns:1.3fr repeat(9,1fr);gap:4px;margin-top:16px}.cohort-cell{padding:10px;border-radius:8px;background:rgba(255,255,255,.04);color:var(--text-primary);font-size:12px;text-align:center}.cohort-head{color:var(--text-secondary);font-weight:800}.recharts-tooltip-wrapper{outline:none}@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@media(max-width:1180px){.stats-row{grid-template-columns:repeat(2,1fr)}.chart-grid{grid-template-columns:1fr}.heatmap-grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:760px){.analytics-header,.analytics-controls,.custom-range{align-items:flex-start;flex-direction:column}.stats-row,.heatmap-grid{grid-template-columns:1fr}.chart-box{height:280px}.cohort-grid{overflow-x:auto;display:flex}.cohort-cell{min-width:80px}}
      `}</style>
    </section>
  );
}

function ContentAnalytics() {
  return (
    <>
      <StatsRow stats={[
        ['Total Play Sessions', '184,200', '+22%', Film],
        ['Avg. Completion Rate', '68.4%', '+3.1%', Gauge],
        ['Avg. Watch Time per Session', '42 min', '', Clock],
        ['Total Watch Hours', '129,500 hrs', '', Eye],
      ]} />
      <div className="chart-grid">
        <ChartCard title="Daily Play Sessions"><AreaChart data={dailySessions} margin={chartMargin}><Grid /><XAxis dataKey="day" stroke="#c8afb4" /><YAxis stroke="#c8afb4" /><Tooltip contentStyle={tooltipStyle} /><Area type="monotone" dataKey="sessions" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.28} /></AreaChart></ChartCard>
        <ChartCard title="Completion Rate by Genre"><BarChart data={completionByGenre} layout="vertical" margin={chartMargin}><Grid /><XAxis type="number" stroke="#c8afb4" /><YAxis dataKey="genre" type="category" stroke="#c8afb4" width={80} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="rate" fill="#800020" radius={[0, 8, 8, 0]} /></BarChart></ChartCard>
        <ChartCard title="Top 10 Content by Views"><BarChart data={topContentViews} margin={chartMargin}><Grid /><XAxis dataKey="title" stroke="#c8afb4" hide /><YAxis stroke="#c8afb4" /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="views" fill="#f59e0b" radius={[8, 8, 0, 0]} /></BarChart></ChartCard>
        <ChartCard title="Drop-off Analysis"><LineChart data={dropoffData} margin={chartMargin}><Grid /><XAxis dataKey="minute" stroke="#c8afb4" /><YAxis stroke="#c8afb4" /><Tooltip contentStyle={tooltipStyle} /><Line type="monotone" dataKey="remaining" stroke="#8b5cf6" strokeWidth={3} dot={false} /></LineChart></ChartCard>
      </div>
      <div className="heatmap-card"><h2>Traffic by Region</h2><p>Mock India region heatmap by view intensity.</p><div className="heatmap-grid">{regionHeatmap.map(([state, intensity]) => <div className="state-chip" style={{ background: `rgba(128,0,32,${0.25 + intensity / 130})` }} key={state}>{state}<br />{intensity}K</div>)}</div></div>
    </>
  );
}

function RevenueAnalytics() {
  return (
    <>
      <StatsRow stats={[
        ['Total Revenue', '₹8,94,000', '', IndianRupee],
        ['TVOD', '₹3,12,000', '', DollarSign],
        ['SVOD', '₹4,18,000', '', Users],
        ['AVOD', '₹1,64,000', '', Radio],
      ]} />
      <div className="chart-grid">
        <ChartCard title="Revenue Breakdown"><PieChart><Tooltip contentStyle={tooltipStyle} /><Pie data={revenuePie} dataKey="value" nameKey="name" outerRadius={110} label>{revenuePie.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie></PieChart></ChartCard>
        <ChartCard title="Monthly Revenue Trend"><AreaChart data={monthlyRevenue} margin={chartMargin}><Grid /><XAxis dataKey="month" stroke="#c8afb4" /><YAxis stroke="#c8afb4" /><Tooltip contentStyle={tooltipStyle} /><Area dataKey="TVOD" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.18} /><Area dataKey="SVOD" stroke="#800020" fill="#800020" fillOpacity={0.18} /><Area dataKey="AVOD" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.18} /></AreaChart></ChartCard>
        <ChartCard title="Top Earning Content"><BarChart data={topEarningContent} margin={chartMargin}><Grid /><XAxis dataKey="title" stroke="#c8afb4" hide /><YAxis stroke="#c8afb4" /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="revenue" fill="#800020" radius={[8, 8, 0, 0]} /></BarChart></ChartCard>
        <TableCard title="Filmmaker Payout Summary" headers={['Name', 'Content Count', 'Total Earned', 'Payout Status', 'Next Payout Date']} rows={filmmakerPayouts.map((item) => [item.name, item.count, item.earned, <span className={`status-pill ${item.status === 'Pending' ? 'pending' : ''}`}>{item.status}</span>, item.date])} />
      </div>
    </>
  );
}

function UserAnalytics() {
  return (
    <>
      <StatsRow stats={[
        ['Total Users', '42,300', '', Users],
        ['Premium Subscribers', '3,255', '', TrendingUp],
        ['Free Users', '38,900', '', Eye],
        ['Churn Rate', '2.4%', '', AlertTriangle],
      ]} />
      <div className="chart-grid">
        <ChartCard title="User Growth"><AreaChart data={userGrowth} margin={chartMargin}><Grid /><XAxis dataKey="month" stroke="#c8afb4" /><YAxis stroke="#c8afb4" /><Tooltip contentStyle={tooltipStyle} /><Area dataKey="users" stroke="#800020" fill="#800020" fillOpacity={0.28} /></AreaChart></ChartCard>
        <ChartCard title="New vs Returning Users"><BarChart data={newReturningUsers} margin={chartMargin}><Grid /><XAxis dataKey="week" stroke="#c8afb4" /><YAxis stroke="#c8afb4" /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="New" fill="#8b5cf6" radius={[8, 8, 0, 0]} /><Bar dataKey="Returning" fill="#f59e0b" radius={[8, 8, 0, 0]} /></BarChart></ChartCard>
        <ChartCard title="Subscription Plan Distribution"><PieChart><Tooltip contentStyle={tooltipStyle} /><Pie data={planDistribution} dataKey="value" nameKey="name" outerRadius={110} label>{planDistribution.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie></PieChart></ChartCard>
        <div className="table-card"><h2>User Retention Cohort</h2><p>Retention percentage by signup month.</p><div className="cohort-grid">{['Cohort', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'].map((h) => <div className="cohort-cell cohort-head" key={h}>{h}</div>)}{cohorts.flatMap((row) => row.map((cell, index) => <div className="cohort-cell" style={index > 0 ? { background: `rgba(128,0,32,${0.12 + Number(cell) / 160})` } : undefined} key={`${row[0]}-${index}`}>{index === 0 ? cell : `${cell}%`}</div>))}</div></div>
      </div>
    </>
  );
}

function QualityAnalytics() {
  return (
    <>
      <StatsRow stats={[
        ['Avg. Startup Time', '2.1s', '', Clock],
        ['Avg. Buffering Events per Session', '0.3', '', Wifi],
        ['CDN Hit Rate', '97.8%', '', Gauge],
        ['Error Rate', '0.12%', '', AlertTriangle],
      ]} />
      <div className="chart-grid">
        <ChartCard title="Quality Level Distribution"><PieChart><Tooltip contentStyle={tooltipStyle} /><Pie data={qualityPie} dataKey="value" nameKey="name" outerRadius={110} label>{qualityPie.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie></PieChart></ChartCard>
        <ChartCard title="Startup Time Trend"><LineChart data={startupTrend} margin={chartMargin}><Grid /><XAxis dataKey="day" stroke="#c8afb4" /><YAxis stroke="#c8afb4" /><Tooltip contentStyle={tooltipStyle} /><Line dataKey="seconds" stroke="#8b5cf6" strokeWidth={3} dot={false} /></LineChart></ChartCard>
        <ChartCard title="CDN Performance"><BarChart data={cdnPerformance} margin={chartMargin}><Grid /><XAxis dataKey="cdn" stroke="#c8afb4" /><YAxis stroke="#c8afb4" /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="response" fill="#22c55e" radius={[8, 8, 0, 0]} /></BarChart></ChartCard>
        <ChartCard title="Error Event Types"><BarChart data={errorTypes} margin={chartMargin}><Grid /><XAxis dataKey="type" stroke="#c8afb4" hide /><YAxis stroke="#c8afb4" /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="count" fill="#ef4444" radius={[8, 8, 0, 0]} /></BarChart></ChartCard>
      </div>
    </>
  );
}

function StatsRow({ stats }: { stats: Array<[string, string, string, ElementType]> }) {
  return <div className="stats-row">{stats.map(([label, value, trend, Icon], index) => <div className="stat-card" style={{ animationDelay: `${index * 0.06}s` }} key={label}><div className="stat-icon"><Icon /></div><div><span>{label}</span><strong>{value}</strong>{trend && <span className="trend">{trend}</span>}</div></div>)}</div>;
}

function ChartCard({ title, children }: { title: string; children: ReactElement }) {
  return <div className="chart-card"><h2>{title}</h2><div className="chart-box"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div></div>;
}

function TableCard({ title, headers, rows }: { title: string; headers: string[]; rows: ReactNode[][] }) {
  return <div className="table-card"><h2>{title}</h2><table className="data-table"><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

function Grid() {
  return <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,246,251,0.08)" />;
}

const tooltipStyle = {
  background: '#231013',
  border: '1px solid rgba(247,237,239,0.1)',
  borderRadius: '10px',
  color: '#f7edef',
};
