import { useEffect, useState } from 'react';
import { Film, Users, DollarSign, Ticket, TrendingUp, TrendingDown, Plus, UserPlus, BarChart3, Play, ArrowRight, Eye, Bell, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { PAGE_STYLES } from '../lib/pageStyles.js';
import { contentService } from '../services/content.js';
import { userService } from '../services/users.js';

const revenueData = [
  {month:'Jan',revenue:45000},{month:'Feb',revenue:52000},{month:'Mar',revenue:48000},
  {month:'Apr',revenue:61000},{month:'May',revenue:58000},{month:'Jun',revenue:72000},
  {month:'Jul',revenue:68000},{month:'Aug',revenue:81000},{month:'Sep',revenue:77000},
  {month:'Oct',revenue:89400},
];
const activity = [
  {id:1,action:'New movie added',     item:'The Midnight Archive',          time:'2m ago',  type:'content'},
  {id:2,action:'New subscription',    item:'Premium Plan — john@email.com', time:'15m ago', type:'subscription'},
  {id:3,action:'Payment received',    item:'$19.99 from maria@email.com',   time:'32m ago', type:'payment'},
  {id:4,action:'Series updated',      item:'Cyber Chronicles S2',           time:'1h ago',  type:'content'},
  {id:5,action:'Support resolved',    item:'Ticket #2847',                  time:'2h ago',  type:'support'},
];
const activityColor = { content:'rgba(204,26,26,.12)', subscription:'rgba(59,130,246,.10)', payment:'rgba(34,197,94,.10)', support:'rgba(255,255,255,.06)' };
const activityIconColor = { content:'#ff6b6b', subscription:'#60a5fa', payment:'#4ade80', support:'rgba(255,255,255,.40)' };

const CustomTooltip = ({active,payload,label}) => active&&payload?.length ? (
  <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,.10)',borderRadius:10,padding:'10px 14px',fontSize:12}}>
    <div style={{color:'rgba(255,255,255,.40)',fontSize:10,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4}}>{label}</div>
    <div style={{color:'#f5f5f5',fontWeight:700}}>${payload[0]?.value?.toLocaleString()}</div>
  </div>
) : null;

export function DashboardSection({ onNavigate, userRole }) {
  const [visible, setVisible] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [apiStats, setApiStats] = useState({ titles: 0, users: 0, published: 0, songs: 0 });
  useEffect(()=>{ setTimeout(()=>setVisible(true),80); },[]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const [contentResult, userResult] = await Promise.allSettled([
        contentService.getStats(),
        userService.getAllUsers({ page: 1, limit: 1 }),
      ]);

      const contentData = contentResult.status === 'fulfilled' ? contentResult.value.data || {} : {};
      const usersData = userResult.status === 'fulfilled' ? userResult.value.data || {} : {};
      setApiStats({
        titles: contentData.total || 0,
        users: usersData.pagination?.total || usersData.total || usersData.users?.length || 0,
        published: contentData.published || 0,
        songs: contentData.songs || 0,
      });
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const stats = [
    {label:'Total Titles', value:apiStats.titles.toLocaleString(), change:`${apiStats.published} live`, trend:'up', icon:Film},
    {label:'Users', value:apiStats.users.toLocaleString(), change:'from /users', trend:'up', icon:Users},
    {label:'Songs', value:apiStats.songs.toLocaleString(), change:'from /songs', trend:'up', icon:DollarSign},
    {label:'Open Tickets', value:'0', change:'not in API', trend:'down', icon:Ticket},
  ];

  return (
    <div className={`page ${visible?'visible':''}`}>
      <div className="page-inner">
        <div className="ph">
          <div className="ph-left"><h1>Dashboard</h1><p>Platform overview — October 2024</p></div>
          <div className="ph-right">
            <button className="btn btn-secondary btn-sm" onClick={fetchStats} disabled={loadingStats}>
              <RefreshCw size={13} className={loadingStats ? 'spin-icon' : ''}/>Refresh
            </button>
            <button className="btn btn-primary" onClick={()=>onNavigate&&onNavigate('add-title-type')}><Plus size={14}/>Add Content</button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {stats.map(({label,value,change,trend,icon:Icon},i)=>(
            <div key={i} className="sc">
              <div className="sc-icon"><Icon size={20}/></div>
              <div>
                <div className="sc-label">{label}</div>
                <div className="sc-value">{value}</div>
                <div className={`sc-change ${trend}`}>
                  {trend==='up'?<TrendingUp size={12}/>:<TrendingDown size={12}/>}
                  <span>{change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:18}}>
          {/* Revenue chart */}
          <div className="card">
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:20}}>
              <div><div className="card-title">Revenue Trend</div><div className="card-sub">Monthly platform revenue</div></div>
              <button className="btn btn-ghost btn-sm" onClick={()=>onNavigate&&onNavigate('payments')} style={{gap:4}}>View Payments<ArrowRight size={13}/></button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData} margin={{left:-20,right:5,top:5,bottom:0}}>
                <defs>
                  <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#cc1a1a" stopOpacity={.20}/>
                    <stop offset="95%" stopColor="#cc1a1a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
                <XAxis dataKey="month" tick={{fill:'rgba(255,255,255,.30)',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'rgba(255,255,255,.30)',fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Area type="monotone" dataKey="revenue" stroke="#cc1a1a" strokeWidth={2.5} fill="url(#dg)" dot={false} activeDot={{r:5,fill:'#cc1a1a',stroke:'#fff',strokeWidth:2}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Activity feed */}
          <div className="card">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
              <div><div className="card-title">Recent Activity</div><div className="card-sub">Latest platform events</div></div>
              <span className="badge b-accent" style={{fontSize:10}}>{activity.length} new</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {activity.map(a=>(
                <div key={a.id} style={{display:'flex',alignItems:'flex-start',gap:10}}>
                  <div style={{width:32,height:32,borderRadius:9,background:activityColor[a.type],color:activityIconColor[a.type],display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>
                    {a.type==='content'?<Film size={14}/>:a.type==='subscription'?<Users size={14}/>:a.type==='payment'?<DollarSign size={14}/>:<Bell size={14}/>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12.5,fontWeight:600,color:'rgba(255,255,255,.75)',marginBottom:1}}>{a.action}</div>
                    <div style={{fontSize:11.5,color:'rgba(255,255,255,.38)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.item}</div>
                  </div>
                  <span style={{fontSize:10.5,color:'rgba(255,255,255,.25)',whiteSpace:'nowrap',flexShrink:0,marginTop:2}}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="card">
          <div style={{marginBottom:14}}><div className="card-title">Quick Actions</div></div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            {[
              {label:'Add Content',    nav:'add-title-type', icon:Plus},
              {label:'Add User',       nav:'users',          icon:UserPlus},
              {label:'View Analytics', nav:'analytics',      icon:BarChart3},
              {label:'Content Library',nav:'content',        icon:Play},
            ].map(({label,nav,icon:Icon})=>(
              <button key={nav} className="btn btn-secondary" onClick={()=>onNavigate&&onNavigate(nav)}>
                <Icon size={14}/>{label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{`${PAGE_STYLES} @keyframes spin{to{transform:rotate(360deg)}} .spin-icon{animation:spin .75s linear infinite} @media(max-width:900px){.chart-row{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
