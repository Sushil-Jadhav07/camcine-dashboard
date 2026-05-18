import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, Film, DollarSign, Eye, Download, Calendar } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { PAGE_STYLES } from '../lib/pageStyles.js';
import { contentService } from '../services/content.js';
import { userService } from '../services/users.js';
import { viewService } from '../services/views.js';
import { CustomSelect } from '../components/CustomSelect.jsx';

const revenueData = [
  {month:'Jan',revenue:72000,users:3200},{month:'Feb',revenue:78000,users:3600},{month:'Mar',revenue:89400,users:4100},
  {month:'Apr',revenue:92000,users:4400},{month:'May',revenue:98000,users:4800},{month:'Jun',revenue:105000,users:5200},
];
const fallbackTopContent = [
  {title:'No tracked content yet', views:0, points:0, type:'N/A'},
];
const COLORS = ['#cc1a1a','#ff6b6b','#fbbf24','#60a5fa'];

const CustomTooltip = ({active,payload,label}) => active&&payload?.length ? (
  <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,.10)',borderRadius:10,padding:'10px 14px',fontSize:12}}>
    <div style={{color:'rgba(255,255,255,.45)',marginBottom:4,textTransform:'uppercase',letterSpacing:'.06em',fontSize:10}}>{label}</div>
    {payload.map((p,i)=><div key={i} style={{color:'#f5f5f5',fontWeight:700}}>{p.value?.toLocaleString()} {p.name}</div>)}
  </div>
) : null;

export function AnalyticsSection() {
  const [period, setPeriod] = useState('30d');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({ totalViews: 0, activeUsers: 0, titles: 0, points: 0 });
  const [topContent, setTopContent] = useState(fallbackTopContent);
  const [typeBreakdown, setTypeBreakdown] = useState([{ name: 'No data', value: 1 }]);
  const [trendData, setTrendData] = useState(revenueData);

  useEffect(()=>{ setTimeout(()=>setVisible(true),80); },[]);
  useEffect(() => { fetchAnalytics(); }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const [contentResult, usersResult] = await Promise.allSettled([
        contentService.getContent({ limit: 50, sort: 'newest' }),
        userService.getAllUsers({ limit: 50 }),
      ]);

      const contentItems = contentResult.status === 'fulfilled' ? contentResult.value.data?.content || [] : [];
      const usersData = usersResult.status === 'fulfilled' ? usersResult.value.data : {};
      const usersList = usersData?.users || usersData || [];
      const normalizedUsers = Array.isArray(usersList) ? usersList : [];

      const statsResults = await Promise.allSettled(
        contentItems.slice(0, 12).map(item => viewService.getContentStats(item.id))
      );
      const rows = contentItems.slice(0, 12).map((item, index) => {
        const stats = statsResults[index].status === 'fulfilled' ? statsResults[index].value.data || {} : {};
        return {
          ...item,
          views: Number(stats.total_views || item.views || item.view_count || 0),
          points: Number(stats.total_points_awarded || 0),
          unique_viewers: Number(stats.unique_viewers || 0),
          today_views: Number(stats.today_views || 0),
        };
      }).sort((a, b) => b.views - a.views);

      const byType = contentItems.reduce((acc, item) => {
        const key = item.type || 'unknown';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
      const breakdown = Object.entries(byType).map(([name, value]) => ({ name, value }));
      const totalViews = rows.reduce((sum, item) => sum + item.views, 0);
      const totalPoints = rows.reduce((sum, item) => sum + item.points, 0);

      setSummary({
        totalViews,
        activeUsers: normalizedUsers.filter(user => user.is_active !== false).length,
        titles: contentItems.length,
        points: totalPoints,
      });
      setTopContent(rows.length ? rows : fallbackTopContent);
      setTypeBreakdown(breakdown.length ? breakdown : [{ name: 'No data', value: 1 }]);
      setTrendData(rows.slice(0, 6).map((item, index) => ({
        month: item.title?.slice(0, 12) || `Item ${index + 1}`,
        revenue: item.views,
        users: item.unique_viewers,
      })).reverse());
    } catch (e) {
      setError(e.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {label:'Tracked Views', value:summary.totalViews.toLocaleString(), change:'API', trend:'up', icon:Eye},
    {label:'Active Users', value:summary.activeUsers.toLocaleString(), change:'API', trend:'up', icon:Users},
    {label:'Content Titles', value:summary.titles.toLocaleString(), change:'API', trend:'up', icon:Film},
    {label:'Points Awarded', value:summary.points.toLocaleString(), change:'API', trend:'up', icon:DollarSign},
  ];

  return (
    <div className={`page ${visible?'visible':''}`}>
      <div className="page-inner">
        <div className="ph">
          <div className="ph-left"><h1>Analytics</h1><p>Platform performance and audience insights</p></div>
          <div className="ph-right">
            <CustomSelect value={period} onChange={setPeriod} options={[
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
              { value: '90d', label: 'Last 90 days' },
              { value: '1y', label: 'This year' },
            ]} />
            <button className="btn btn-secondary btn-sm" onClick={fetchAnalytics} disabled={loading}><Download size={13}/> Refresh</button>
          </div>
        </div>
        {error && <div style={{padding:'12px 14px',background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.18)',borderRadius:10,color:'#fca5a5',fontSize:13,marginBottom:12}}>{error}</div>}

        <div className="stats-row">
          {stats.map(({label,value,change,trend,icon:Icon},i)=>(
            <div key={i} className="sc">
              <div className="sc-icon"><Icon size={20}/></div>
              <div>
                <div className="sc-label">{label}</div>
                <div className="sc-value">{value}</div>
                <div className={`sc-change ${trend}`}>{trend==='up'?<TrendingUp size={12}/>:<TrendingDown size={12}/>}<span>{change}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:18}}>
          <div className="card">
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:20}}>
              <div><div className="card-title">Revenue Trend</div><div className="card-sub">Monthly revenue over time</div></div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData} margin={{left:-20,right:5,top:5,bottom:0}}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cc1a1a" stopOpacity={.22}/>
                    <stop offset="95%" stopColor="#cc1a1a" stopOpacity={.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
                <XAxis dataKey="month" tick={{fill:'rgba(255,255,255,.30)',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'rgba(255,255,255,.30)',fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Area type="monotone" dataKey="revenue" name="revenue" stroke="#cc1a1a" strokeWidth={2.5} fill="url(#rg)" dot={false} activeDot={{r:5,fill:'#cc1a1a',stroke:'#fff',strokeWidth:2}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div style={{marginBottom:20}}><div className="card-title">Content Breakdown</div><div className="card-sub">Titles by API content type</div></div>
            <div style={{display:'flex',justifyContent:'center'}}>
              <PieChart width={180} height={180}>
                <Pie data={typeBreakdown} cx={90} cy={90} innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value">
                  {typeBreakdown.map((e,i)=><Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent"/>)}
                </Pie>
                <Tooltip contentStyle={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,.10)',borderRadius:10,fontSize:12}}/>
              </PieChart>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:8}}>
              {typeBreakdown.map((d,i)=>(
                <div key={d.name} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{width:10,height:10,borderRadius:3,background:COLORS[i % COLORS.length]}}/>
                    <span style={{fontSize:12.5,color:'rgba(255,255,255,.55)'}}>{d.name}</span>
                  </div>
                  <span style={{fontSize:13,fontWeight:700,color:'#f5f5f5'}}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User growth chart */}
        <div className="card">
          <div style={{marginBottom:20}}><div className="card-title">User Growth</div><div className="card-sub">Monthly active users</div></div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={trendData} margin={{left:-20,right:5,top:5,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
              <XAxis dataKey="month" tick={{fill:'rgba(255,255,255,.30)',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'rgba(255,255,255,.30)',fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="users" name="unique viewers" fill="rgba(204,26,26,.50)" radius={[5,5,0,0]} activeBar={{fill:'#cc1a1a'}}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top content */}
        <div className="card">
          <div style={{marginBottom:16}}><div className="card-title">Top Performing Content</div><div className="card-sub">Ranked by total views</div></div>
          <div className="tbl-wrap" style={{border:'none',borderRadius:0}}>
            <table className="tbl">
              <thead><tr><th>#</th><th>Title</th><th>Type</th><th>Views</th><th>Revenue</th><th>Share</th></tr></thead>
              <tbody>
                {topContent.map((c,i)=>{
                  const maxV = Math.max(topContent[0].views || 1, 1);
                  return (
                    <tr key={i}>
                      <td style={{color:'rgba(255,255,255,.25)',fontWeight:700,width:32}}>{i+1}</td>
                      <td style={{fontWeight:600}}>{c.title}</td>
                      <td><span className="badge b-gray" style={{fontSize:11}}>{c.type}</span></td>
                      <td style={{fontWeight:700}}>{Number(c.views || 0).toLocaleString()}</td>
                      <td style={{color:'#4ade80',fontWeight:700}}>{Number(c.points || 0).toLocaleString()} pts</td>
                      <td style={{minWidth:100}}>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <div style={{flex:1,height:5,background:'rgba(255,255,255,.08)',borderRadius:999,overflow:'hidden'}}>
                            <div style={{width:`${(c.views/maxV)*100}%`,height:'100%',background:'#cc1a1a',borderRadius:999}}/>
                          </div>
                          <span style={{fontSize:11,color:'rgba(255,255,255,.35)',minWidth:30}}>{Math.round((c.views/maxV)*100)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style>{`${PAGE_STYLES} @media(max-width:900px){.chart-row{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
