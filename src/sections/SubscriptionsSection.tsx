import { useState, useEffect } from 'react';
import {
  AlertCircle,
  TrendingUp,
  Users,
  RotateCcw,
  Check,
  Edit2,
  Plus,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const revenueData = [
  { month: 'Jan', mrr: 45000, subscribers: 1200 },
  { month: 'Feb', mrr: 52000, subscribers: 1350 },
  { month: 'Mar', mrr: 48000, subscribers: 1280 },
  { month: 'Apr', mrr: 61000, subscribers: 1520 },
  { month: 'May', mrr: 58000, subscribers: 1480 },
  { month: 'Jun', mrr: 72000, subscribers: 1750 },
];

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    period: 'month',
    subscribers: 845,
    revenue: 8445,
    features: ['SD Streaming', '1 Screen', 'Limited Content', 'No Downloads'],
    color: '#6b7280'
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 14.99,
    period: 'month',
    subscribers: 1520,
    revenue: 22785,
    features: ['HD Streaming', '2 Screens', 'Full Content', 'Downloads'],
    color: '#800020',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    period: 'month',
    subscribers: 890,
    revenue: 17791,
    features: ['4K Streaming', '4 Screens', 'Full Content', 'Downloads', 'HDR Support'],
    color: '#22c55e'
  }
];

const recentSubscribers = [
  { id: 1, name: 'John Smith', plan: 'Standard', date: '2 min ago', amount: 14.99 },
  { id: 2, name: 'Emma Wilson', plan: 'Premium', date: '15 min ago', amount: 19.99 },
  { id: 3, name: 'Michael Brown', plan: 'Basic', date: '32 min ago', amount: 9.99 },
  { id: 4, name: 'Lisa Davis', plan: 'Standard', date: '1 hour ago', amount: 14.99 },
  { id: 5, name: 'James Taylor', plan: 'Premium', date: '2 hours ago', amount: 19.99 },
];

const tvodTiers = [
  { name: 'Indie/Short', price: 2, useCase: 'Independent/short films', count: 84 },
  { name: 'Standard', price: 5, useCase: 'Regular episodic content', count: 312 },
  { name: 'Premium', price: 10, useCase: 'High-production content', count: 67 },
  { name: 'Blockbuster', price: 20, useCase: 'Major releases', count: 12 },
];

type SubscriptionTab = 'svod' | 'tvod' | 'avod';
type AccessType = 'purchase' | 'rental' | 'configurable';

export function SubscriptionsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeChart, setActiveChart] = useState<'mrr' | 'subscribers'>('mrr');
  const [activeTab, setActiveTab] = useState<SubscriptionTab>('svod');
  const [pricingRows, setPricingRows] = useState(tvodTiers);
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [accessType, setAccessType] = useState<AccessType>('purchase');
  const [freeTierEnabled, setFreeTierEnabled] = useState(true);
  const [adProvider, setAdProvider] = useState('Google Ad Manager');
  const [preRollEnabled, setPreRollEnabled] = useState(true);
  const [preRollMode, setPreRollMode] = useState<'Non-skippable (30s)' | 'Skippable after 15s'>('Non-skippable (30s)');
  const [midRollEnabled, setMidRollEnabled] = useState(true);
  const [midRollMinutes, setMidRollMinutes] = useState('20');

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const totalMRR = plans.reduce((acc, plan) => acc + plan.revenue, 0);
  const totalSubscribers = plans.reduce((acc, plan) => acc + plan.subscribers, 0);
  const churnRate = 3.2;

  return (
    <section className="subscriptions-section">
      <div className="subscriptions-container">
        <div className="subscriptions-header" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(-20px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>
          <div>
            <h1>Subscriptions</h1>
            <p>Plans, pricing, and growth at a glance.</p>
          </div>
          <button className="btn btn-primary"><Plus /> Create Plan</button>
        </div>

        <div className="subscription-tabs" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(-20px)', transition: 'opacity 0.5s ease 0.08s, transform 0.5s ease 0.08s' }}>
          <button className={activeTab === 'svod' ? 'active' : ''} onClick={() => setActiveTab('svod')}>Plans (SVOD)</button>
          <button className={activeTab === 'tvod' ? 'active' : ''} onClick={() => setActiveTab('tvod')}>Per-Episode Pricing (TVOD)</button>
          <button className={activeTab === 'avod' ? 'active' : ''} onClick={() => setActiveTab('avod')}>Free Tier (AVOD)</button>
        </div>

        {activeTab === 'svod' && (
          <>
            <div className="metrics-grid" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s' }}>
              <div className="metric-card"><div className="metric-header"><div className="metric-icon purple"><DollarSign /></div><div className="metric-trend up"><TrendingUp /><span>+12%</span></div></div><div className="metric-value">${(totalMRR / 1000).toFixed(1)}K</div><div className="metric-label">Monthly Recurring Revenue</div></div>
              <div className="metric-card"><div className="metric-header"><div className="metric-icon blue"><Users /></div><div className="metric-trend up"><TrendingUp /><span>+8.5%</span></div></div><div className="metric-value">{totalSubscribers.toLocaleString()}</div><div className="metric-label">Active Subscribers</div></div>
              <div className="metric-card"><div className="metric-header"><div className="metric-icon orange"><RotateCcw /></div><div className="metric-trend down"><TrendingUp /><span>-0.5%</span></div></div><div className="metric-value">{churnRate}%</div><div className="metric-label">Churn Rate</div></div>
            </div>

            <div className="subscriptions-grid">
              <div className="chart-card" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s' }}>
                <div className="chart-header"><h3>Growth Overview</h3><div className="chart-tabs"><button className={`chart-tab ${activeChart === 'mrr' ? 'active' : ''}`} onClick={() => setActiveChart('mrr')}>MRR</button><button className={`chart-tab ${activeChart === 'subscribers' ? 'active' : ''}`} onClick={() => setActiveChart('subscribers')}>Subscribers</button></div></div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={280}>
                    {activeChart === 'mrr' ? (
                      <AreaChart data={revenueData}><defs><linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#800020" stopOpacity={0.32}/><stop offset="95%" stopColor="#800020" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(244,246,251,0.08)" /><XAxis dataKey="month" stroke="#c8afb4" fontSize={12} tickLine={false} /><YAxis stroke="#c8afb4" fontSize={12} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} /><Tooltip contentStyle={{ background: '#231013', border: '1px solid rgba(247,237,239,0.1)', borderRadius: '10px', color: '#f7edef' }} formatter={(value: number) => [`$${value.toLocaleString()}`, 'MRR']} /><Area type="monotone" dataKey="mrr" stroke="#800020" strokeWidth={2} fill="url(#mrrGradient)" /></AreaChart>
                    ) : (
                      <LineChart data={revenueData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(244,246,251,0.08)" /><XAxis dataKey="month" stroke="#c8afb4" fontSize={12} tickLine={false} /><YAxis stroke="#c8afb4" fontSize={12} tickLine={false} /><Tooltip contentStyle={{ background: '#231013', border: '1px solid rgba(247,237,239,0.1)', borderRadius: '10px', color: '#f7edef' }} formatter={(value: number) => [value.toLocaleString(), 'Subscribers']} /><Line type="monotone" dataKey="subscribers" stroke="#9f1d35" strokeWidth={2} dot={{ fill: '#9f1d35', strokeWidth: 0, r: 4 }} /></LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="recent-subs-card" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s' }}>
                <div className="card-header"><h3>Recent Subscribers</h3><button className="btn btn-ghost">View All <ChevronRight /></button></div>
                <div className="recent-subs-list">{recentSubscribers.map((sub) => <div key={sub.id} className="recent-sub-item"><div className="sub-info"><span className="sub-name">{sub.name}</span><span className="sub-plan">{sub.plan}</span></div><div className="sub-meta"><span className="sub-amount">${sub.amount}</span><span className="sub-time">{sub.date}</span></div></div>)}</div>
              </div>
            </div>

            <div className="plans-section" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s' }}>
              <h3>Subscription Plans</h3>
              <div className="plans-grid">{plans.map((plan) => <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''}`}>{plan.popular && <div className="popular-badge">Most Popular</div>}<div className="plan-header"><h4 className="plan-name">{plan.name}</h4><div className="plan-price"><span className="price">${plan.price}</span><span className="period">/{plan.period}</span></div></div><div className="plan-stats"><div className="plan-stat"><Users className="stat-icon" /><span>{plan.subscribers} subscribers</span></div><div className="plan-stat"><DollarSign className="stat-icon" /><span>${plan.revenue.toLocaleString()}/mo</span></div></div><div className="plan-features">{plan.features.map((feature, idx) => <div key={idx} className="plan-feature"><Check className="feature-icon" style={{ color: plan.color }} /><span>{feature}</span></div>)}</div><div className="plan-actions"><button className="btn btn-secondary"><Edit2 /> Edit</button></div></div>)}</div>
            </div>
          </>
        )}
        {activeTab === 'tvod' && (
          <div className="tab-card">
            <div className="tab-copy">
              <h3>Per-Episode Pricing</h3>
              <p>Configure pricing tiers for individual episode and film purchases. Each content item can be assigned a pricing tier by the admin.</p>
            </div>
            <div className="table-wrapper">
              <table className="pricing-table">
                <thead><tr><th>Tier Name</th><th>Price (?)</th><th>Use Case</th><th>Content Count</th><th></th></tr></thead>
                <tbody>
                  {pricingRows.map((tier) => (
                    <tr key={tier.name}>
                      <td>{tier.name}</td>
                      <td>{editingTier === tier.name ? <input className="inline-price-input" type="number" value={tier.price} onChange={(e) => setPricingRows((rows) => rows.map((row) => row.name === tier.name ? { ...row, price: Number(e.target.value) } : row))} /> : `?${tier.price}`}</td>
                      <td>{tier.useCase}</td>
                      <td>{tier.count}</td>
                      <td><button className="table-action" onClick={() => setEditingTier(editingTier === tier.name ? null : tier.name)}><Edit2 /> Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn btn-primary save-btn">Save Changes</button>

            <div className="access-type-card">
              <h4>Episode Access Type</h4>
              <label className="access-option"><input type="radio" checked={accessType === 'purchase'} onChange={() => setAccessType('purchase')} /><span>Permanent Purchase - Users own the episode forever after purchase</span></label>
              <label className="access-option"><input type="radio" checked={accessType === 'rental'} onChange={() => setAccessType('rental')} /><span>48h Rental - Access expires 48 hours after first play</span></label>
              <label className="access-option"><input type="radio" checked={accessType === 'configurable'} onChange={() => setAccessType('configurable')} /><span>Configurable per content - Admin sets per title in CMS</span></label>
            </div>

            <div className="note-card"><AlertCircle /><span>Open Question: Confirm rental vs purchase model with client before implementing billing logic.</span></div>
          </div>
        )}

        {activeTab === 'avod' && (
          <div className="avod-grid">
            <div className="tab-card">
              <div className="tab-copy">
                <h3>AVOD Settings</h3>
                <p>Configure ad-supported free tier behavior and placement rules.</p>
              </div>
              <label className="switch-row"><span>Enable free tier with ads</span><input type="checkbox" checked={freeTierEnabled} onChange={() => setFreeTierEnabled((value) => !value)} /></label>
              <label className="form-row">Ad provider<select className="avod-select" value={adProvider} onChange={(e) => setAdProvider(e.target.value)}><option>Google Ad Manager</option><option>Custom DSP</option><option>Direct advertisers</option></select></label>
              <div className="ad-option-block">
                <label className="switch-row"><span>Pre-roll ads</span><input type="checkbox" checked={preRollEnabled} onChange={() => setPreRollEnabled((value) => !value)} /></label>
                {preRollEnabled && <div className="radio-group"><label className="access-option"><input type="radio" checked={preRollMode === 'Non-skippable (30s)'} onChange={() => setPreRollMode('Non-skippable (30s)')} /><span>Non-skippable (30s)</span></label><label className="access-option"><input type="radio" checked={preRollMode === 'Skippable after 15s'} onChange={() => setPreRollMode('Skippable after 15s')} /><span>Skippable after 15s</span></label></div>}
              </div>
              <div className="ad-option-block">
                <label className="switch-row"><span>Mid-roll ads</span><input type="checkbox" checked={midRollEnabled} onChange={() => setMidRollEnabled((value) => !value)} /></label>
                {midRollEnabled && <label className="form-row compact">Every X minutes<input className="midroll-input" value={midRollMinutes} onChange={(e) => setMidRollMinutes(e.target.value)} /></label>}
              </div>
            </div>

            <div className="tab-card">
              <div className="tab-copy">
                <h3>Free Content Configuration</h3>
                <p>Define which content is available free. Admin tags content as 'Free' in the CMS.</p>
              </div>
              <div className="free-stat">Currently free: 156 titles</div>
              <button className="btn btn-secondary">View Free Content</button>
            </div>

            <div className="revenue-estimate-card">
              <h3>Ad Revenue Estimate</h3>
              <p>Estimated monthly AVOD revenue: ?1,64,000 (based on 38,900 active free users × avg 2 sessions/week × ?0.50 CPM)</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .subscriptions-section { min-height: 100vh; padding: 28px 0 56px; background: var(--bg-primary); }
        .subscriptions-container { max-width: 1400px; margin: 0 auto; padding: 0 24px; }
        .subscriptions-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 26px; padding: 26px 30px; border-radius: 28px; border: 1px solid var(--border); background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), rgba(50, 18, 23, 0.58); backdrop-filter: blur(26px); box-shadow: var(--shadow-soft); }
        .subscriptions-header h1 { font-size: 36px; color: var(--text-primary); margin-bottom: 8px; }
        .subscriptions-header p { color: var(--text-secondary); font-size: 14px; }
        .subscriptions-header .btn { gap: 8px; }
        .subscription-tabs { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 28px; padding: 10px; border-radius: 20px; border: 1px solid var(--border); background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(50, 18, 23, 0.58); backdrop-filter: blur(24px); box-shadow: var(--shadow-soft); }
        .subscription-tabs button { min-height: 40px; padding: 10px 14px; background: transparent; border: 1px solid transparent; border-radius: 10px; color: var(--text-secondary); font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s ease; }
        .subscription-tabs button.active, .subscription-tabs button:hover { color: var(--text-primary); background: rgba(128, 0, 32, 0.16); border-color: rgba(128, 0, 32, 0.28); }
        .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px; }
        .metric-card, .chart-card, .recent-subs-card, .tab-card, .revenue-estimate-card { background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), rgba(50, 18, 23, 0.58); border: 1px solid var(--border); border-radius: 24px; padding: 24px; transition: all 0.3s ease; backdrop-filter: blur(24px); box-shadow: var(--shadow-soft); }
        .metric-card:hover { border-color: var(--accent); transform: translateY(-4px); }
        .metric-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .metric-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .metric-icon.purple, .metric-icon.blue { background: rgba(128, 0, 32, 0.14); color: var(--accent); }
        .metric-icon.orange { background: rgba(159, 29, 53, 0.12); color: var(--accent-hover); }
        .metric-icon svg { width: 22px; height: 22px; }
        .metric-trend { display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 600; }
        .metric-trend.up { color: var(--success); }
        .metric-trend.down { color: var(--error); }
        .metric-trend svg { width: 14px; height: 14px; }
        .metric-value { font-size: 32px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
        .metric-label { font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); }
        .subscriptions-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 32px; }
        .chart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .chart-header h3, .tab-copy h3, .revenue-estimate-card h3, .access-type-card h4 { font-size: 18px; color: var(--text-primary); }
        .chart-tabs { display: flex; gap: 8px; }
        .chart-tab { padding: 8px 16px; background: transparent; border: 1px solid var(--border); border-radius: 8px; color: var(--text-secondary); font-size: 13px; cursor: pointer; transition: all 0.2s ease; }
        .chart-tab:hover { border-color: var(--border-hover); color: var(--text-primary); }
        .chart-tab.active { background: var(--accent); border-color: var(--accent); color: white; }
        .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .card-header h3 { font-size: 18px; color: var(--text-primary); }
        .card-header .btn { font-size: 13px; padding: 8px 12px; }
        .card-header .btn svg { width: 16px; height: 16px; }
        .recent-subs-list { display: flex; flex-direction: column; gap: 16px; }
        .recent-sub-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border); }
        .recent-sub-item:last-child { border-bottom: none; }
        .sub-info { display: flex; flex-direction: column; gap: 4px; }
        .sub-name { font-size: 14px; font-weight: 500; color: var(--text-primary); }
        .sub-plan, .tab-copy p, .revenue-estimate-card p, .access-option span, .switch-row span, .form-row { font-size: 14px; color: var(--text-secondary); }
        .sub-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .sub-amount { font-size: 14px; font-weight: 600; color: var(--text-primary); }
        .sub-time { font-size: 12px; color: var(--text-secondary); }
        .plans-section { margin-top: 32px; }
        .plans-section h3 { font-size: 20px; color: var(--text-primary); margin-bottom: 24px; }
        .plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .plan-card { position: relative; background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), rgba(50, 18, 23, 0.58); border: 1px solid var(--border); border-radius: 24px; padding: 24px; transition: all 0.3s ease; backdrop-filter: blur(24px); box-shadow: var(--shadow-soft); }
        .plan-card:hover { border-color: var(--accent); transform: translateY(-4px); }
        .plan-card.popular { border-color: var(--accent); box-shadow: 0 10px 30px rgba(128, 0, 32, 0.18); }
        .popular-badge { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); padding: 4px 12px; background: var(--accent); border-radius: 999px; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: white; }
        .plan-header { text-align: center; margin-bottom: 24px; }
        .plan-name { font-size: 20px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; }
        .plan-price { display: flex; align-items: baseline; justify-content: center; gap: 4px; }
        .price { font-size: 36px; font-weight: 700; color: var(--text-primary); }
        .period { font-size: 14px; color: var(--text-secondary); }
        .plan-stats { display: flex; flex-direction: column; gap: 8px; padding: 16px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 20px; }
        .plan-stat { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary); }
        .stat-icon { width: 16px; height: 16px; }
        .plan-features { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
        .plan-feature { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--text-primary); }
        .feature-icon { width: 18px; height: 18px; }
        .plan-actions .btn { width: 100%; gap: 8px; }
        .table-wrapper { overflow-x: auto; }
        .pricing-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .pricing-table th, .pricing-table td { padding: 14px 12px; text-align: left; border-bottom: 1px solid var(--border); color: var(--text-primary); font-size: 14px; }
        .pricing-table th { color: var(--text-secondary); font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
        .inline-price-input, .avod-select, .midroll-input { padding: 10px 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 10px; color: var(--text-primary); outline: none; }
        .inline-price-input { width: 90px; }
        .table-action { display: inline-flex; align-items: center; gap: 6px; padding: 8px 10px; background: transparent; border: 1px solid var(--border); border-radius: 8px; color: var(--text-primary); cursor: pointer; }
        .save-btn { margin-bottom: 22px; }
        .access-type-card, .note-card { padding: 18px; border-radius: 18px; border: 1px solid var(--border); background: rgba(255,255,255,0.04); }
        .access-option { display: flex; align-items: flex-start; gap: 10px; margin-top: 14px; }
        .access-option input { margin-top: 3px; }
        .note-card { display: flex; align-items: flex-start; gap: 12px; margin-top: 18px; color: #fbbf24; }
        .note-card svg { width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px; }
        .avod-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 24px; }
        .switch-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
        .switch-row input { width: auto; }
        .form-row { display: flex; flex-direction: column; gap: 8px; font-size: 13px; font-weight: 600; margin-bottom: 18px; }
        .form-row.compact { max-width: 180px; }
        .ad-option-block { padding: 18px; border-radius: 18px; border: 1px solid var(--border); background: rgba(255,255,255,0.04); margin-bottom: 16px; }
        .radio-group { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
        .free-stat { margin-bottom: 18px; padding: 18px; border-radius: 18px; background: rgba(128, 0, 32, 0.14); border: 1px solid rgba(128, 0, 32, 0.22); color: var(--text-primary); font-size: 20px; font-weight: 700; }
        @media (max-width: 1024px) { .subscriptions-grid { grid-template-columns: 1fr; } .plans-grid { grid-template-columns: 1fr; } .avod-grid { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { .metrics-grid { grid-template-columns: 1fr; } .subscription-tabs { flex-direction: column; } }
      `}</style>
    </section>
  );
}
