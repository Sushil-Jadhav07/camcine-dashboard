import { useState, useEffect } from 'react';
import { Settings, User, Shield, Bell, Plug, CreditCard, Save, LogOut, Key, Webhook, Check, Eye, EyeOff, X, ChevronRight, AlertTriangle } from 'lucide-react';
import { UserRole } from '../constants/sections';
import { useAuth } from '../contexts/AuthContext.jsx';
import { PAGE_STYLES } from '../lib/pageStyles.js';

const tabs = [
  { id:'account',       label:'Account',       icon:User },
  { id:'security',      label:'Security',      icon:Shield },
  { id:'notifications', label:'Notifications', icon:Bell },
  { id:'integrations',  label:'Integrations',  icon:Plug },
  { id:'billing',       label:'Billing',       icon:CreditCard },
];

export function SettingsSection({ onLogout, userRole, userId }) {
  const { updateUser } = useAuth();
  const [tab, setTab] = useState('account');
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPw, setShowPw] = useState(false);

  const [acct, setAcct] = useState({ first_name:'', last_name:'', email:'', phone_number:'', age:'' });
  const [security, setSecurity] = useState({ current_password:'', new_password:'', confirm_password:'', twoFactor:false, sessionTimeout:'30' });
  const [notifs, setNotifs] = useState({ email:true, push:true, sms:false, marketing:false, newContent:true, billing:true });
  const [integrations, setIntegrations] = useState([
    { id:'slack',   name:'Slack',          enabled:false, webhook:'' },
    { id:'discord', name:'Discord',        enabled:false, webhook:'' },
    { id:'webhook', name:'Custom Webhook', enabled:false, webhook:'' },
  ]);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const save = async (fn) => {
    setSaving(true);
    try { await fn(); showToast('Settings saved successfully!'); } catch(e) { showToast('Error saving settings.'); } finally { setSaving(false); }
  };

  const setA = (k,v) => setAcct(p=>({...p,[k]:v}));
  const setS = (k,v) => setSecurity(p=>({...p,[k]:v}));
  const setN = (k,v) => setNotifs(p=>({...p,[k]:v}));
  const toggleInt = (id) => setIntegrations(p=>p.map(i=>i.id===id?{...i,enabled:!i.enabled}:i));
  const setIntW = (id,v) => setIntegrations(p=>p.map(i=>i.id===id?{...i,webhook:v}:i));

  const renderContent = () => {
    if (tab === 'account') return (
      <div className="sett-panel">
        <div className="sett-ph"><div><div className="card-title">Account Information</div><div className="card-sub">Update your personal details</div></div></div>
        <div className="form-grid-2">
          {[['First Name','text','first_name'],['Last Name','text','last_name']].map(([l,t,k])=>(
            <div className="fg" key={k}><label className="lbl">{l}</label><input type={t} className="inp" value={acct[k]} onChange={e=>setA(k,e.target.value)} placeholder={l}/></div>
          ))}
          <div className="fg"><label className="lbl">Email</label><input type="email" className="inp" value={acct.email} onChange={e=>setA('email',e.target.value)} placeholder="you@example.com"/></div>
          <div className="fg"><label className="lbl">Phone</label><input type="tel" className="inp" value={acct.phone_number} onChange={e=>setA('phone_number',e.target.value)} placeholder="+91 98765 43210"/></div>
          <div className="fg"><label className="lbl">Age</label><input type="number" className="inp" value={acct.age} onChange={e=>setA('age',e.target.value)} placeholder="Age"/></div>
          <div className="fg"><label className="lbl">Role</label>
            <div className="inp" style={{display:'flex',alignItems:'center',color:'rgba(255,255,255,.45)',cursor:'not-allowed',opacity:.7}}>{userRole}</div>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:20}}>
          <button className="btn btn-primary" disabled={saving} onClick={()=>save(()=>updateUser(acct))}>
            {saving?<div className="spin"/>:<><Save size={14}/>Save Changes</>}
          </button>
        </div>
      </div>
    );
    if (tab === 'security') return (
      <div className="sett-panel">
        <div className="sett-ph"><div className="card-title">Security</div><div className="card-sub">Manage your password and account security</div></div>
        <div className="sett-section">
          <div className="sett-section-title">Change Password</div>
          <div className="form-grid-2">
            {[['Current Password','current_password'],['New Password','new_password'],['Confirm New Password','confirm_password']].map(([l,k])=>(
              <div className="fg" key={k}><label className="lbl">{l}</label>
                <div className="inp-wrap">
                  <Key size={15} className="inp-icon"/>
                  <input type={showPw?'text':'password'} className="inp" value={security[k]} onChange={e=>setS(k,e.target.value)} placeholder={l}/>
                  <button type="button" className="inp-end" style={{background:'none',border:'none',color:'rgba(255,255,255,.35)',cursor:'pointer',padding:4}} onClick={()=>setShowPw(p=>!p)}>
                    {showPw?<EyeOff size={14}/>:<Eye size={14}/>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="sett-section">
          <div className="sett-section-title">Two-Factor Authentication</div>
          <div className="sett-toggle-row">
            <div><div style={{fontSize:14,color:'#f5f5f5',fontWeight:500}}>Enable 2FA</div><div style={{fontSize:12,color:'rgba(255,255,255,.38)',marginTop:2}}>Add an extra layer of security to your account</div></div>
            <label className="toggle"><input type="checkbox" checked={security.twoFactor} onChange={e=>setS('twoFactor',e.target.checked)}/><span className="toggle-slider"/></label>
          </div>
        </div>
        <div className="sett-section">
          <div className="sett-section-title">Session Timeout</div>
          <div className="fg" style={{maxWidth:220}}>
            <label className="lbl">Auto-logout after</label>
            <select className="inp fselect" value={security.sessionTimeout} onChange={e=>setS('sessionTimeout',e.target.value)}>
              {[['15','15 minutes'],['30','30 minutes'],['60','1 hour'],['240','4 hours'],['0','Never']].map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:4}}>
          <button className="btn btn-primary" disabled={saving} onClick={()=>save(()=>Promise.resolve())}>
            {saving?<div className="spin"/>:<><Save size={14}/>Save Security Settings</>}
          </button>
        </div>
      </div>
    );
    if (tab === 'notifications') return (
      <div className="sett-panel">
        <div className="sett-ph"><div className="card-title">Notifications</div><div className="card-sub">Choose how you receive updates</div></div>
        {[
          {k:'email',      label:'Email Notifications',    sub:'Receive updates via email'},
          {k:'push',       label:'Push Notifications',      sub:'Browser push notifications'},
          {k:'sms',        label:'SMS Notifications',       sub:'Text message alerts'},
          {k:'marketing',  label:'Marketing Emails',        sub:'Promotional and product news'},
          {k:'newContent', label:'New Content Alerts',      sub:'When new titles are added'},
          {k:'billing',    label:'Billing Alerts',          sub:'Payment and subscription updates'},
        ].map(({k,label,sub})=>(
          <div key={k} className="sett-toggle-row">
            <div><div style={{fontSize:14,color:'#f5f5f5',fontWeight:500}}>{label}</div><div style={{fontSize:12,color:'rgba(255,255,255,.38)',marginTop:2}}>{sub}</div></div>
            <label className="toggle"><input type="checkbox" checked={notifs[k]} onChange={e=>setN(k,e.target.checked)}/><span className="toggle-slider"/></label>
          </div>
        ))}
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:8}}>
          <button className="btn btn-primary" disabled={saving} onClick={()=>save(()=>Promise.resolve())}>{saving?<div className="spin"/>:<><Save size={14}/>Save Preferences</>}</button>
        </div>
      </div>
    );
    if (tab === 'integrations') return (
      <div className="sett-panel">
        <div className="sett-ph"><div className="card-title">Integrations</div><div className="card-sub">Connect external services via webhooks</div></div>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {integrations.map(int=>(
            <div key={int.id} className="sett-int-card">
              <div className="sett-int-hdr">
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div className="sc-icon" style={{width:38,height:38,borderRadius:10}}><Webhook size={15}/></div>
                  <div><div style={{fontSize:14,fontWeight:600,color:'#f5f5f5'}}>{int.name}</div><div style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>{int.enabled?'Connected':'Disconnected'}</div></div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span className={`badge ${int.enabled?'b-green':'b-gray'}`}>{int.enabled?'Active':'Off'}</span>
                  <label className="toggle"><input type="checkbox" checked={int.enabled} onChange={()=>toggleInt(int.id)}/><span className="toggle-slider"/></label>
                </div>
              </div>
              {int.enabled && (
                <div style={{marginTop:12}}>
                  <label className="lbl">Webhook URL</label>
                  <input type="url" className="inp" value={int.webhook} onChange={e=>setIntW(int.id,e.target.value)} placeholder="https://hooks.example.com/..."/>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:16}}>
          <button className="btn btn-primary" disabled={saving} onClick={()=>save(()=>Promise.resolve())}>{saving?<div className="spin"/>:<><Save size={14}/>Save Integrations</>}</button>
        </div>
      </div>
    );
    if (tab === 'billing') return (
      <div className="sett-panel">
        <div className="sett-ph"><div className="card-title">Billing</div><div className="card-sub">Manage your plan and payment methods</div></div>
        <div className="sett-billing-card">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
            <div><div style={{fontSize:13,color:'rgba(255,255,255,.40)',marginBottom:4}}>Current Plan</div><div style={{fontSize:20,fontWeight:800,color:'#f5f5f5'}}>Enterprise</div></div>
            <span className="badge b-green">Active</span>
          </div>
          <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
            {['Unlimited users','99.9% uptime SLA','24/7 support','Custom integrations'].map(f=>(
              <div key={f} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'rgba(255,255,255,.55)'}}><Check size={12} style={{color:'#4ade80'}}/>{f}</div>
            ))}
          </div>
        </div>
        <div className="sett-section">
          <div className="sett-section-title">Payment Method</div>
          <div className="sett-card-row">
            <CreditCard size={18} style={{color:'rgba(255,255,255,.40)'}}/>
            <div style={{flex:1}}><div style={{fontSize:13,color:'#f5f5f5',fontWeight:500}}>Visa ending in 4242</div><div style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>Expires 12/26</div></div>
            <button className="btn btn-secondary btn-sm">Update</button>
          </div>
        </div>
        <div className="sett-section sett-danger">
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
            <AlertTriangle size={16} style={{color:'#f87171'}}/>
            <div className="sett-section-title" style={{margin:0,color:'#f87171'}}>Danger Zone</div>
          </div>
          <p style={{fontSize:13,color:'rgba(255,255,255,.40)',marginBottom:14}}>These actions are permanent and cannot be undone.</p>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <button className="btn btn-danger btn-sm" onClick={onLogout}><LogOut size={13}/>Sign Out</button>
            <button className="btn btn-danger btn-sm">Delete Account</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`page ${visible?'visible':''}`}>
      <div className="page-inner">
        <div className="ph">
          <div className="ph-left"><h1>Settings</h1><p>Manage your account and preferences</p></div>
        </div>

        <div className="sett-layout">
          {/* sidebar nav */}
          <nav className="sett-nav">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} className={`sett-nav-item ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)}>
                  <Icon size={16}/>
                  <span>{t.label}</span>
                  <ChevronRight size={13} className="sett-nav-arrow"/>
                </button>
              );
            })}
          </nav>

          {/* content */}
          <div className="card sett-content">{renderContent()}</div>
        </div>

        {toast && (
          <div className="sett-toast">
            <Check size={14} style={{color:'#4ade80'}}/>{toast}
          </div>
        )}
      </div>

      <style>{`
        ${PAGE_STYLES}
        .sett-layout { display:grid; grid-template-columns:220px 1fr; gap:20px; align-items:start; }
        .sett-nav { background:#141414; border:1px solid rgba(255,255,255,.07); border-radius:16px; padding:8px; display:flex; flex-direction:column; gap:2px; }
        .sett-nav-item { width:100%; display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:11px; font-size:13.5px; font-weight:500; color:rgba(255,255,255,.45); background:transparent; border:1px solid transparent; cursor:pointer; transition:all .15s; font-family:inherit; text-align:left; }
        .sett-nav-item:hover { color:rgba(255,255,255,.80); background:rgba(255,255,255,.04); }
        .sett-nav-item.active { color:#ff9999; background:rgba(204,26,26,.12); border-color:rgba(204,26,26,.20); }
        .sett-nav-arrow { margin-left:auto; opacity:.3; }
        .sett-nav-item.active .sett-nav-arrow { opacity:.6; color:#ff6b6b; }
        .sett-content { min-height:400px; }
        .sett-panel { display:flex; flex-direction:column; gap:20px; }
        .sett-ph { margin-bottom:4px; }
        .sett-section { padding-top:20px; border-top:1px solid rgba(255,255,255,.06); }
        .sett-section-title { font-size:12px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,.35); margin-bottom:14px; }
        .sett-toggle-row { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,.05); }
        .sett-toggle-row:last-of-type { border-bottom:none; }
        .sett-int-card { background:#1a1a1a; border:1px solid rgba(255,255,255,.07); border-radius:14px; padding:16px; }
        .sett-int-hdr { display:flex; align-items:center; justify-content:space-between; }
        .sett-billing-card { background:linear-gradient(135deg,rgba(204,26,26,.12),rgba(204,26,26,.05)); border:1px solid rgba(204,26,26,.20); border-radius:14px; padding:20px; }
        .sett-card-row { display:flex; align-items:center; gap:12px; padding:12px 14px; background:#1a1a1a; border:1px solid rgba(255,255,255,.07); border-radius:12px; }
        .sett-danger { border-color:rgba(239,68,68,.15); background:rgba(239,68,68,.04); border-radius:12px; padding:16px; }
        .sett-toast { position:fixed; bottom:28px; right:28px; display:flex; align-items:center; gap:8px; padding:12px 18px; background:#1e1e1e; border:1px solid rgba(74,222,128,.20); border-radius:12px; font-size:13px; font-weight:600; color:#f5f5f5; box-shadow:0 8px 24px rgba(0,0,0,.4); z-index:9999; animation:slideUp .25s ease; }
        @keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        @media (max-width:768px) { .sett-layout { grid-template-columns:1fr; } .sett-nav { flex-direction:row; overflow-x:auto; } .sett-nav-arrow { display:none; } }
      `}</style>
    </div>
  );
}
