import { useState, useEffect } from 'react';
import { UserCircle, Film, Star, Calendar, Edit2, Save, Camera, Award, TrendingUp, Eye, X } from 'lucide-react';
import { PAGE_STYLES } from '../lib/pageStyles.js';

const mockProfile = { name:'Alex Johnson', role:'Actor', bio:'Award-winning actor with 8 years of experience in film and television. Known for versatile roles ranging from action leads to dramatic supporting characters.', experience:'8 years', age:32, languages:['English','Hindi'], genres:['Thriller','Drama','Action'], totalMovies:14, totalViews:'2.4M', avgRating:4.7 };
const mockMovies = [
  { id:1, title:'The Midnight Archive', role:'Lead',      year:2024, status:'filming',   rating:0 },
  { id:2, title:'Urban Legends',        role:'Supporting',year:2023, status:'released',  rating:4.8 },
  { id:3, title:'City Beats',           role:'Lead',      year:2023, status:'released',  rating:4.6 },
  { id:4, title:'Dark Horizon',         role:'Villain',   year:2022, status:'released',  rating:4.7 },
];
const statusCfg = { filming:'b-yellow', released:'b-green', 'post-production':'b-blue' };

export function ActorPortalSection({ onNavigate, userId }) {
  const [profile, setProfile] = useState(mockProfile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name:mockProfile.name, bio:mockProfile.bio, experience:mockProfile.experience });
  const [visible, setVisible] = useState(false);
  useEffect(()=>{ setTimeout(()=>setVisible(true),80); },[]);

  const save=()=>{ setProfile(p=>({...p,...form})); setEditing(false); };

  return (
    <div className={`page ${visible?'visible':''}`}>
      <div className="page-inner">
        <div className="ph">
          <div className="ph-left"><h1>My Profile</h1><p>Actor portal — manage your profile and filmography</p></div>
          <div className="ph-right">
            {editing ? (
              <><button className="btn btn-secondary btn-sm" onClick={()=>setEditing(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={save}><Save size={13}/>Save</button></>
            ) : (
              <button className="btn btn-secondary btn-sm" onClick={()=>setEditing(true)}><Edit2 size={13}/>Edit Profile</button>
            )}
          </div>
        </div>

        <div className="ap-layout">
          {/* Profile card */}
          <div className="card ap-profile">
            <div className="ap-avatar-wrap">
              <div className="avatar avatar-xl">{profile.name[0]}</div>
              {editing&&<button className="ap-camera-btn"><Camera size={14}/></button>}
            </div>
            {editing ? (
              <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:16}}>
                <div className="fg"><label className="lbl">Display Name</label><input className="inp" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
                <div className="fg"><label className="lbl">Experience</label><input className="inp" value={form.experience} onChange={e=>setForm(p=>({...p,experience:e.target.value}))}/></div>
                <div className="fg"><label className="lbl">Bio</label><textarea className="inp" rows={4} value={form.bio} onChange={e=>setForm(p=>({...p,bio:e.target.value}))} style={{resize:'vertical'}}/></div>
              </div>
            ) : (
              <>
                <div style={{textAlign:'center',marginTop:14}}>
                  <div style={{fontSize:18,fontWeight:800,color:'#f5f5f5'}}>{profile.name}</div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,.45)',marginTop:4}}>{profile.role} · {profile.experience}</div>
                </div>
                <div className="sect-divider"/>
                <p style={{fontSize:13,color:'rgba(255,255,255,.55)',lineHeight:1.7,textAlign:'center'}}>{profile.bio}</p>
                <div className="sect-divider"/>
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'rgba(255,255,255,.30)',marginBottom:4}}>Languages</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>{profile.languages.map(l=><span key={l} className="badge b-blue" style={{fontSize:11}}>{l}</span>)}</div>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'rgba(255,255,255,.30)',marginTop:6,marginBottom:4}}>Genres</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>{profile.genres.map(g=><span key={g} className="badge b-gray" style={{fontSize:11}}>{g}</span>)}</div>
                </div>
              </>
            )}
          </div>

          {/* Right column */}
          <div style={{display:'flex',flexDirection:'column',gap:18}}>
            {/* Stats */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
              {[
                {label:'Movies',      value:profile.totalMovies, icon:Film},
                {label:'Total Views', value:profile.totalViews,  icon:Eye},
                {label:'Avg Rating',  value:profile.avgRating,   icon:Star},
              ].map(({label,value,icon:Icon},i)=>(
                <div key={i} className="sc">
                  <div className="sc-icon"><Icon size={18}/></div>
                  <div><div className="sc-label">{label}</div><div className="sc-value" style={{fontSize:22}}>{value}</div></div>
                </div>
              ))}
            </div>

            {/* Filmography */}
            <div className="card">
              <div style={{marginBottom:16}}><div className="card-title">Filmography</div><div className="card-sub">Your movie history</div></div>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                {mockMovies.map(m=>(
                  <div key={m.id} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 14px',borderRadius:12,transition:'background .12s',cursor:'default'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.03)'} onMouseLeave={e=>e.currentTarget.style.background=''}>
                    <div style={{width:36,height:36,borderRadius:10,background:'rgba(204,26,26,.10)',border:'1px solid rgba(204,26,26,.18)',color:'#ff6b6b',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Film size={15}/></div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13.5,fontWeight:600,color:'#f5f5f5'}}>{m.title}</div>
                      <div style={{fontSize:11,color:'rgba(255,255,255,.38)',display:'flex',alignItems:'center',gap:8,marginTop:2}}>
                        <span>{m.role}</span><span>·</span><span>{m.year}</span>
                        {m.rating>0&&<span style={{display:'flex',alignItems:'center',gap:3,color:'#fbbf24'}}><Star size={10}/>{m.rating}</span>}
                      </div>
                    </div>
                    <span className={`badge ${statusCfg[m.status]||'b-gray'}`} style={{fontSize:10}}>{m.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`${PAGE_STYLES}
        .ap-layout { display:grid; grid-template-columns:280px 1fr; gap:20px; align-items:start; }
        .ap-profile { display:flex; flex-direction:column; align-items:center; text-align:center; }
        .ap-avatar-wrap { position:relative; }
        .ap-camera-btn { position:absolute; bottom:-4px; right:-4px; width:28px; height:28px; border-radius:9px; background:#cc1a1a; border:2px solid #141414; color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; }
        @media(max-width:900px){ .ap-layout { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}
