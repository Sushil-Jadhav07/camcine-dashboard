import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, Film, DollarSign, Eye, Download, Calendar } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { PAGE_STYLES } from '../lib/pageStyles.js';

const revenueData = [
  {month:'Jan',revenue:72000,users:3200},{month:'Feb',revenue:78000,users:3600},{month:'Mar',revenue:89400,users:4100},
  {month:'Apr',revenue:92000,users:4400},{month:'May',revenue:98000,users:4800},{month:'Jun',revenue:105000,users:5200},
];
const topContent = [
  {title:'The Midnight Archive', views:125000, revenue:4500, type:'Film'},
  {title:'Cyber Chronicles S2',  views:98000,  revenue:3200, type:'Series'},
  {title:'Urban Legends Doc',    views:87000,  revenue:2800, type:'Film'},
  {title:'Comedy Special Live',  views:76000,  revenue:2100, type:'Special'},
  {title:'Science: Space',       views:65000,  revenue:1900, type:'Educational'},
];
const deviceData = [{name:'Mobile',value:45},{name:'Desktop',value:32},{name:'TV',value:18},{name:'Tablet',value:5}];
const COLORS = ['#cc1a1a','#ff6b6b','#fbbf24','#60a5fa'];

const CustomTooltip = ({active,payload,label}) => active&&payload?.length ? (
  <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,.10)',borderRadius:10,padding:'10px 14px',fontSize:12}}>
    <div style={{color:'rgba(255,255,255,.45)',marginBottom:4,textTransform:'uppercase',letterSpacing:'.06em',fontSize:10}}>{label}</div>
    {payload.map((p,i)=><div key={i} style={{color:'#f5f5f5',fontWeight:700}}>{p.name==='revenue'?'$':''}{p.value?.toLocaleString()}{p.name==='users'?' users':''}</div>)}
  </div>
) : null;

export function AnalyticsSection() {
  const [period, setPeriod] = useState('30d');
  const [visible, setVisible] = useState(false);
  useEffect(()=>{ setTimeout(()=>setVisible(true),80); },[]);

  const stats = [
    {label:'Total Views',    value:'1.25M', change:'+15.2%', trend:'up',   icon:Eye},
    {label:'Active Users',   value:'45.2K', change:'+8.7%',  trend:'up',   icon:Users},
    {label:'Revenue',        value:'$89.4K',change:'+23.1%', trend:'up',   icon:DollarSign},
    {label:'Avg Watch Time', value:'42 min',change:'+5.4%',  trend:'up',   icon:Film},
  ];

  return (
    <div className={`page ${visible?'visible':''}`}>
      <div className="page-inner">
        <div className="ph">
          <div className="ph-left"><h1>Analytics</h1><p>Platform performance and audience insights</p></div>
          <div className="ph-right">
            <select className="fselect" value={period} onChange={e=>setPeriod(e.target.value)}>
              {[['7d','Last 7 days'],['30d','Last 30 days'],['90d','Last 90 days'],['1y','This year']].map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
            <button className="btn btn-secondary btn-sm"><Download size={13}/> Export</button>
          </div>
        </div>

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
              <AreaChart data={revenueData} margin={{left:-20,right:5,top:5,bottom:0}}>
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
            <div style={{marginBottom:20}}><div className="card-title">Device Breakdown</div><div className="card-sub">Views by device type</div></div>
            <div style={{display:'flex',justifyContent:'center'}}>
              <PieChart width={180} height={180}>
                <Pie data={deviceData} cx={90} cy={90} innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value">
                  {deviceData.map((e,i)=><Cell key={i} fill={COLORS[i]} stroke="transparent"/>)}
                </Pie>
                <Tooltip formatter={v=>`${v}%`} contentStyle={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,.10)',borderRadius:10,fontSize:12}}/>
              </PieChart>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:8}}>
              {deviceData.map((d,i)=>(
                <div key={d.name} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{width:10,height:10,borderRadius:3,background:COLORS[i]}}/>
                    <span style={{fontSize:12.5,color:'rgba(255,255,255,.55)'}}>{d.name}</span>
                  </div>
                  <span style={{fontSize:13,fontWeight:700,color:'#f5f5f5'}}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User growth chart */}
        <div className="card">
          <div style={{marginBottom:20}}><div className="card-title">User Growth</div><div className="card-sub">Monthly active users</div></div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueData} margin={{left:-20,right:5,top:5,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
              <XAxis dataKey="month" tick={{fill:'rgba(255,255,255,.30)',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'rgba(255,255,255,.30)',fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="users" name="users" fill="rgba(204,26,26,.50)" radius={[5,5,0,0]} activeBar={{fill:'#cc1a1a'}}/>
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
                  const maxV = topContent[0].views;
                  return (
                    <tr key={i}>
                      <td style={{color:'rgba(255,255,255,.25)',fontWeight:700,width:32}}>{i+1}</td>
                      <td style={{fontWeight:600}}>{c.title}</td>
                      <td><span className="badge b-gray" style={{fontSize:11}}>{c.type}</span></td>
                      <td style={{fontWeight:700}}>{(c.views/1000).toFixed(0)}K</td>
                      <td style={{color:'#4ade80',fontWeight:700}}>${(c.revenue/1000).toFixed(1)}K</td>
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
