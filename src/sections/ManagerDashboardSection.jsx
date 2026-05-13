import { useEffect, useState } from 'react';
import { Users, Film, TrendingUp, DollarSign, CheckCircle, Clock, BarChart3, ArrowRight, Activity, Circle, AlertCircle, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PAGE_STYLES } from '../lib/pageStyles.js';

const revenueData = [
  { month:'Jan',revenue:45000 }, { month:'Feb',revenue:52000 }, { month:'Mar',revenue:48000 },
  { month:'Apr',revenue:61000 }, { month:'May',revenue:58000 }, { month:'Jun',revenue:72000 },
  { month:'Jul',revenue:68000 }, { month:'Aug',revenue:81000 }, { month:'Sep',revenue:77000 },
  { month:'Oct',revenue:89400 },
];

const tasks = [
  { id:1, title:'Review actor applications (4 pending)', priority:'high',   done:false },
  { id:2, title:'Approve content batch — March 2024',   priority:'high',   done:false },
  { id:3, title:'Update subscription pricing',          priority:'medium', done:true  },
  { id:4, title:'Audit user permissions',               priority:'medium', done:false },
  { id:5, title:'Prepare Q1 analytics report',          priority:'low',    done:false },
];

const activity = [
  { text:'New user registered: Priya S.', time:'5m ago', type:'user' },
  { text:'Content published: "Dark Horizon"', time:'22m ago', type:'content' },
  { text:'Payment received: ₹2,450', time:'1h ago', type:'payment' },
  { text:'Actor application: Rohan Mehta', time:'2h ago', type:'actor' },
];

const Tt = ({active,payload,label}) => active&&payload?.length ? (
  <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,.10)',borderRadius:10,padding:'10px 14px',fontSize:12}}>
    <div style={{color:'rgba(255,255,255,.35)',marginBottom:4,fontSize:10,textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</div>
    <div style={{color:'#f5f5f5',fontWeight:700}}>₹{(payload[0]?.value/1000).toFixed(1)}K</div>
  </div>
) : null;

const priorityColor = { high:'#ef4444', medium:'#f59e0b', low:'#6b7280' };
const activityColor = { user:'#1a7acc', content:'#cc1a1a', payment:'#22c55e', actor:'#7a1acc' };

export function ManagerDashboardSection({ onNavigate, userRole }) {
  const [taskList, setTaskList] = useState(tasks);
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
  const toggle = id => setTaskList(p => p.map(t => t.id===id ? {...t, done:!t.done} : t));
  const pending = taskList.filter(t => !t.done).length;

  return (
    <div className={`page ${visible?'visible':''}`}>
      <style>{PAGE_STYLES}</style>
      <style>{`
        .md-grid{display:grid;grid-template-columns:1fr 320px;gap:20px;margin-bottom:20px}
        @media(max-width:1100px){.md-grid{grid-template-columns:1fr}}
        .md-card{background:#141414;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:22px 24px}
        .md-card-hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px}
        .md-card-ttl{font-size:14px;font-weight:700;color:rgba(255,255,255,.75);margin-bottom:3px}
        .md-card-sub{font-size:12px;color:rgba(255,255,255,.28)}
        .md-stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
        @media(max-width:900px){.md-stat-grid{grid-template-columns:repeat(2,1fr)}}
        .md-sc{background:#141414;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:20px 22px;position:relative;overflow:hidden;transition:border-color .2s}
        .md-sc:hover{border-color:rgba(255,255,255,.12)}
        .md-sc-bar{position:absolute;top:0;left:0;right:0;height:2px;border-radius:2px 2px 0 0}
        .md-sc-ico{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:14px}
        .md-sc-v{font-family:'Sora',sans-serif;font-size:24px;font-weight:800;color:#f0f0f0;letter-spacing:-.02em;margin-bottom:3px}
        .md-sc-l{font-size:11px;color:rgba(255,255,255,.28);text-transform:uppercase;letter-spacing:.07em}
        .md-sc-ch{font-size:11.5px;color:#4ade80;margin-top:6px;font-weight:600}
        /* task */
        .md-task{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;border:1px solid transparent;transition:all .12s}
        .md-task:hover{background:rgba(255,255,255,.03);border-color:rgba(255,255,255,.07)}
        .md-task.done{opacity:.4}
        .md-task-cb{width:18px;height:18px;border-radius:6px;border:1.5px solid rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .12s}
        .md-task.done .md-task-cb{border-color:transparent;background:rgba(74,222,128,.12)}
        .md-task-text{flex:1;font-size:13px;color:rgba(255,255,255,.65)}
        .md-task.done .md-task-text{text-decoration:line-through;color:rgba(255,255,255,.28)}
        .md-prio{width:6px;height:6px;border-radius:50%;flex-shrink:0}
        /* activity */
        .md-act-row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.05)}
        .md-act-row:last-child{border-bottom:none}
        .md-act-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .md-act-txt{flex:1;font-size:13px;color:rgba(255,255,255,.50)}
        .md-act-time{font-size:11px;color:rgba(255,255,255,.22)}
        /* quick actions */
        .md-qa-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        @media(max-width:900px){.md-qa-grid{grid-template-columns:repeat(2,1fr)}}
        .md-qa-btn{display:flex;flex-direction:column;align-items:flex-start;gap:8px;padding:16px;background:#141414;border:1px solid rgba(255,255,255,.07);border-radius:14px;cursor:pointer;font-family:inherit;transition:all .18s;text-align:left}
        .md-qa-btn:hover{background:#1a1a1a;border-color:rgba(204,26,26,.25);transform:translateY(-2px)}
        .md-qa-ico{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center}
        .md-qa-label{font-size:13px;font-weight:600;color:rgba(255,255,255,.60)}
        .md-qa-arrow{color:rgba(204,26,26,.60);margin-top:auto}
      `}</style>
      <div className="page-inner">
        <div className="ph">
          <div className="ph-left"><h1>Manager Dashboard</h1><p>Team overview and task management</p></div>
          <div className="ph-right">
            <button className="btn btn-primary" onClick={() => onNavigate&&onNavigate('analytics')}>
              <BarChart3 size={14}/> Full Analytics
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="md-stat-grid">
          {[
            { label:'Team Members',    val:'12',   change:'+2 this month',  ico:<Users size={18}/>,     bg:'rgba(26,122,204,.12)',  ic:'#93c5fd', bar:'#1a7acc' },
            { label:'Active Projects', val:'8',    change:'3 new',          ico:<Film size={18}/>,      bg:'rgba(204,26,26,.12)',   ic:'#ff8080', bar:'#cc1a1a' },
            { label:'Monthly Revenue', val:'₹89K', change:'+15.2% growth',  ico:<DollarSign size={18}/>,bg:'rgba(34,197,94,.10)',   ic:'#86efac', bar:'#22c55e' },
            { label:'Pending Tasks',   val:pending, change:`${taskList.length-pending} done`, ico:<Clock size={18}/>,  bg:'rgba(245,158,11,.10)', ic:'#fde68a', bar:'#f59e0b' },
          ].map((s,i) => (
            <div key={i} className="md-sc">
              <div className="md-sc-bar" style={{background:s.bar}}/>
              <div className="md-sc-ico" style={{background:s.bg,color:s.ic}}>{s.ico}</div>
              <div className="md-sc-v">{s.val}</div>
              <div className="md-sc-l">{s.label}</div>
              <div className="md-sc-ch">{s.change}</div>
            </div>
          ))}
        </div>

        {/* Chart + Tasks */}
        <div className="md-grid">
          <div className="md-card">
            <div className="md-card-hdr">
              <div>
                <div className="md-card-ttl">Revenue Overview</div>
                <div className="md-card-sub">Monthly performance Jan–Oct</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate&&onNavigate('earnings')}>
                View Earnings <ArrowRight size={13}/>
              </button>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{left:-20,right:5,top:5,bottom:0}}>
                <defs>
                  <linearGradient id="mdg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cc1a1a" stopOpacity={.22}/>
                    <stop offset="95%" stopColor="#cc1a1a" stopOpacity={.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
                <XAxis dataKey="month" tick={{fill:'rgba(255,255,255,.28)',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'rgba(255,255,255,.28)',fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip content={<Tt/>}/>
                <Area type="monotone" dataKey="revenue" stroke="#cc1a1a" strokeWidth={2.5} fill="url(#mdg)" dot={false} activeDot={{r:5,fill:'#cc1a1a',stroke:'#fff',strokeWidth:2}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="md-card">
            <div className="md-card-hdr">
              <div>
                <div className="md-card-ttl">Tasks</div>
                <div className="md-card-sub">{pending} pending</div>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {taskList.map(t => (
                <div key={t.id} className={`md-task ${t.done?'done':''}`} onClick={() => toggle(t.id)}>
                  <div className="md-task-cb">
                    {t.done && <CheckCircle size={13} style={{color:'#4ade80'}}/>}
                  </div>
                  <span className="md-task-text">{t.title}</span>
                  <div className="md-prio" style={{background:priorityColor[t.priority]}}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity + Quick Actions */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <div className="md-card">
            <div className="md-card-hdr">
              <div>
                <div className="md-card-ttl">Recent Activity</div>
                <div className="md-card-sub">Latest platform events</div>
              </div>
            </div>
            {activity.map((a,i) => (
              <div key={i} className="md-act-row">
                <div className="md-act-dot" style={{background:activityColor[a.type]}}/>
                <span className="md-act-txt">{a.text}</span>
                <span className="md-act-time">{a.time}</span>
              </div>
            ))}
          </div>

          <div className="md-card">
            <div className="md-card-hdr">
              <div>
                <div className="md-card-ttl">Quick Actions</div>
                <div className="md-card-sub">Navigate fast</div>
              </div>
            </div>
            <div className="md-qa-grid">
              {[
                { label:'Actor Queue', nav:'actor-queue', ico:<Users size={16}/>, bg:'rgba(122,26,204,.15)', ic:'#c4b5fd' },
                { label:'Content Library', nav:'content', ico:<Film size={16}/>, bg:'rgba(204,26,26,.12)', ic:'#ff8080' },
                { label:'Manage Users', nav:'users', ico:<Users size={16}/>, bg:'rgba(26,122,204,.12)', ic:'#93c5fd' },
                { label:'Analytics', nav:'analytics', ico:<BarChart3 size={16}/>, bg:'rgba(34,197,94,.10)', ic:'#86efac' },
              ].map(({label,nav,ico,bg,ic}) => (
                <button key={nav} className="md-qa-btn" onClick={() => onNavigate&&onNavigate(nav)}>
                  <div className="md-qa-ico" style={{background:bg,color:ic}}>{ico}</div>
                  <span className="md-qa-label">{label}</span>
                  <ChevronRight size={14} className="md-qa-arrow"/>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
