import { useState, useEffect } from 'react';
import { Eye, EyeOff, Film, Lock, Mail, Shield, ArrowRight, ChevronDown, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { UserRole } from '../constants/sections';
import { normalizeRoleFromApi } from '../services/roleMapper.js';

const stats = [
  { value: '2.4M', label: 'Active Users' },
  { value: '18K', label: 'Content' },
  { value: '₹4.8Cr', label: 'Revenue' },
  { value: '99.9%', label: 'Uptime' },
];

const liveActivity = [
  { text: 'New subscription: Premium Plan', time: '2m ago', dot: '#22c55e' },
  { text: 'Content uploaded: "Night Riders"', time: '8m ago', dot: '#cc1a1a' },
  { text: 'Actor approved: Rohan Mehta', time: '15m ago', dot: '#f59e0b' },
];

export function LoginSection({ onLogin }) {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setTimeout(() => setVisible(true), 60);
    setTimeout(() => setStep(1), 150);
    setTimeout(() => setStep(2), 300);
    setTimeout(() => setStep(3), 450);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();
    const result = await login({ email: email.trim(), password });
    if (result?.success) {
      // Role comes from the API response via AuthContext
      // AuthContext sets user with role from /auth/me or login response
      // We read it via the returned data
    }
  };

  // Listen for auth state changes via useAuth
  const { user, isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = normalizeRoleFromApi(user.role) || UserRole.USER;
      onLogin({ role, userId: user.id });
    }
  }, [isAuthenticated, user]);

  return (
    <div className={`ar ${visible ? 'ar--in' : ''}`}>
      <div className="ar-bg" aria-hidden="true" />
      <div className="ar-overlay" aria-hidden="true" />

      {/* LEFT BRAND PANEL */}
      <div className="ar-brand">
        <div className="ar-noise" />
        <div className="ar-deco-tl" /><div className="ar-deco-br" />
        <div className="ar-deco-c1" /><div className="ar-deco-c2" />
        <div className="ar-scanline" />

        <div className={`ar-logo ${step >= 1 ? 'ar-in' : ''}`}>
          <div className="ar-logo-mark"><Film size={20} /></div>
          <span className="ar-logo-name">Camcine</span>
          <span className="ar-logo-badge">Admin</span>
        </div>

        <div className="ar-brand-mid">
          <div className={`ar-hero ${step >= 2 ? 'ar-in' : ''}`}>
            <div className="ar-eyebrow"><Sparkles size={11}/><span>OTT Management Platform</span></div>
            <h1 className="ar-h1">Run your<br/><span className="ar-accent">streaming empire.</span></h1>
            <p className="ar-sub">The complete admin suite for modern OTT platforms. Manage content, users, earnings, and analytics — all in one place.</p>
          </div>
          <div className={`ar-stats ${step >= 3 ? 'ar-in' : ''}`}>
            {stats.map((s,i) => (
              <div key={i} className="ar-stat">
                <div className="ar-stat-v">{s.value}</div>
                <div className="ar-stat-l">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`ar-feed ${step >= 3 ? 'ar-in' : ''}`}>
          <div className="ar-feed-hdr"><div className="ar-live-dot"/><span>Live Activity</span></div>
          {liveActivity.map((a,i) => (
            <div key={i} className="ar-feed-row">
              <div className="ar-feed-dot" style={{background:a.dot}}/>
              <span className="ar-feed-txt">{a.text}</span>
              <span className="ar-feed-time">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="ar-form-side">
        <div className="ar-box">
          <div className="ar-phdr">
            <h2>Welcome back</h2>
            <p>Sign in to access your Camcine dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="ar-form">
            <div className="ar-field">
              <label className="ar-lbl">Email address</label>
              <div className="ar-iw">
                <span className="ar-ico"><Mail size={15}/></span>
                <input
                  type="email"
                  className="ar-inp"
                  placeholder="admin@camcine.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); clearError(); }}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="ar-field">
              <label className="ar-lbl">Password</label>
              <div className="ar-iw">
                <span className="ar-ico"><Lock size={15}/></span>
                <input
                  type={showPw ? 'text' : 'password'}
                  className="ar-inp"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); clearError(); }}
                  required
                  autoComplete="current-password"
                />
                <button type="button" className="ar-eye" onClick={() => setShowPw(o => !o)}>
                  {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>

            {error && (
              <div className="ar-err">
                <Shield size={13}/>{error}
              </div>
            )}

            <button type="submit" className="ar-submit" disabled={isLoading}>
              {isLoading ? <span className="ar-spin"/> : <><span>Sign In</span><ArrowRight size={16}/></>}
            </button>
          </form>

          <p className="ar-hint">Access is granted by your platform administrator.</p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        *{box-sizing:border-box}
        .ar{position:relative;display:flex;min-height:100vh;background:#080808;font-family:'DM Sans',sans-serif;opacity:0;transition:opacity .5s;overflow:hidden}
        .ar--in{opacity:1}
        .ar-in{opacity:1!important;transform:none!important}
        .ar-bg{position:absolute;inset:0;z-index:0;background-image:url('/netflix.jpg');background-size:cover;background-position:center;background-repeat:no-repeat;filter:blur(2px) saturate(1.1);transform:scale(1.03)}
        .ar-overlay{position:absolute;inset:0;z-index:1;background:linear-gradient(135deg,rgba(0,0,0,.80),rgba(8,8,8,.58) 48%,rgba(120,0,0,.30)),rgba(0,0,0,.28);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px)}
        .ar-brand{display:none}
        .ar-noise{position:absolute;inset:0;z-index:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");background-size:256px;pointer-events:none}
        .ar-deco-tl{position:absolute;top:0;left:0;z-index:1;width:100px;height:100px;border-top:1px solid rgba(204,26,26,.20);border-left:1px solid rgba(204,26,26,.20)}
        .ar-deco-br{position:absolute;bottom:0;right:0;z-index:1;width:100px;height:100px;border-bottom:1px solid rgba(204,26,26,.20);border-right:1px solid rgba(204,26,26,.20)}
        .ar-deco-c1{position:absolute;top:-200px;right:-200px;z-index:0;width:560px;height:560px;border-radius:50%;background:radial-gradient(circle,rgba(204,26,26,.10) 0%,transparent 65%);pointer-events:none}
        .ar-deco-c2{position:absolute;bottom:-160px;left:-160px;z-index:0;width:440px;height:440px;border-radius:50%;background:radial-gradient(circle,rgba(204,26,26,.07) 0%,transparent 65%);pointer-events:none}
        .ar-scanline{position:absolute;inset:0;z-index:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,.008) 2px,rgba(255,255,255,.008) 4px)}
        .ar-logo{display:flex;align-items:center;gap:12px;position:relative;z-index:2;opacity:0;transform:translateY(-10px);transition:opacity .5s,transform .5s}
        .ar-logo-mark{width:38px;height:38px;border-radius:10px;background:rgba(204,26,26,.12);border:1px solid rgba(204,26,26,.28);color:#ff6060;display:flex;align-items:center;justify-content:center}
        .ar-logo-name{font-family:'Sora',sans-serif;font-size:19px;font-weight:800;color:#f0f0f0;letter-spacing:-.02em}
        .ar-logo-badge{font-size:10px;font-weight:700;letter-spacing:.10em;text-transform:uppercase;padding:3px 8px;border-radius:20px;background:rgba(204,26,26,.12);border:1px solid rgba(204,26,26,.24);color:#ff8080}
        .ar-brand-mid{flex:1;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:2;padding:36px 0}
        .ar-hero{opacity:0;transform:translateY(18px);transition:opacity .6s,transform .6s}
        .ar-eyebrow{display:flex;align-items:center;gap:7px;font-size:11px;font-weight:600;letter-spacing:.10em;text-transform:uppercase;color:rgba(204,26,26,.75);margin-bottom:18px}
        .ar-h1{font-family:'Sora',sans-serif;font-size:44px;font-weight:800;line-height:1.08;color:#f0f0f0;letter-spacing:-.04em;margin:0 0 16px}
        .ar-accent{background:linear-gradient(135deg,#cc1a1a 0%,#ff6060 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .ar-sub{font-size:13.5px;color:rgba(255,255,255,.36);line-height:1.75;max-width:340px}
        .ar-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.06);border-radius:14px;overflow:hidden;margin-top:32px;opacity:0;transform:translateY(12px);transition:opacity .6s .1s,transform .6s .1s}
        .ar-stat{background:rgba(255,255,255,.02);padding:16px 12px;text-align:center;transition:background .2s}
        .ar-stat:hover{background:rgba(204,26,26,.06)}
        .ar-stat-v{font-family:'Sora',sans-serif;font-size:18px;font-weight:800;color:#f0f0f0;letter-spacing:-.02em}
        .ar-stat-l{font-size:10px;color:rgba(255,255,255,.26);text-transform:uppercase;letter-spacing:.07em;margin-top:4px}
        .ar-feed{position:relative;z-index:2;background:rgba(255,255,255,.022);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:15px 16px;opacity:0;transform:translateY(10px);transition:opacity .5s .2s,transform .5s .2s}
        .ar-feed-hdr{display:flex;align-items:center;gap:8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:rgba(255,255,255,.28);margin-bottom:10px}
        .ar-live-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;animation:live-pulse 2s infinite}
        @keyframes live-pulse{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.5)}50%{box-shadow:0 0 0 5px rgba(34,197,94,0)}}
        .ar-feed-row{display:flex;align-items:center;gap:9px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)}
        .ar-feed-row:last-child{border-bottom:none;padding-bottom:0}
        .ar-feed-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
        .ar-feed-txt{font-size:12px;color:rgba(255,255,255,.46);flex:1}
        .ar-feed-time{font-size:10px;color:rgba(255,255,255,.20);flex-shrink:0}
        .ar-form-side{position:relative;z-index:2;flex:1;display:flex;align-items:center;justify-content:center;width:100%;min-height:100vh;padding:32px 20px;overflow-y:auto}
        .ar-box{width:100%;max-width:420px;padding:36px;background:linear-gradient(145deg,rgba(18,18,18,.72),rgba(18,18,18,.44));border:1px solid rgba(255,255,255,.22);border-radius:18px;box-shadow:0 24px 80px rgba(0,0,0,.56),inset 0 1px 0 rgba(255,255,255,.10);backdrop-filter:blur(22px) saturate(1.2);-webkit-backdrop-filter:blur(22px) saturate(1.2)}
        .ar-box::before{content:'';display:block;height:1px;margin:-1px 10px 28px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.44),transparent)}
        .ar-phdr{margin-bottom:28px}
        .ar-phdr h2{font-family:'Sora',sans-serif;font-size:26px;font-weight:800;color:#f0f0f0;letter-spacing:-.03em;margin:0 0 6px}
        .ar-phdr p{font-size:13px;color:rgba(255,255,255,.44)}
        .ar-form{display:flex;flex-direction:column;gap:16px}
        .ar-field{display:flex;flex-direction:column;gap:7px}
        .ar-lbl{font-size:10.5px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:rgba(255,255,255,.54)}
        .ar-iw{position:relative;display:flex;align-items:center}
        .ar-ico{position:absolute;left:13px;color:rgba(255,255,255,.20);display:flex;align-items:center;pointer-events:none}
        .ar-inp{width:100%;height:46px;padding:0 42px 0 40px;background:rgba(8,8,8,.42);border:1px solid rgba(255,255,255,.16);border-radius:11px;color:#f0f0f0;font-size:14px;font-family:inherit;outline:none;transition:border-color .15s,box-shadow .15s,background .15s}
        .ar-inp:focus{border-color:rgba(204,26,26,.44);box-shadow:0 0 0 3px rgba(204,26,26,.08);background:rgba(8,8,8,.58)}
        .ar-inp::placeholder{color:rgba(255,255,255,.32)}
        .ar-eye{position:absolute;right:10px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:transparent;border:none;cursor:pointer;color:rgba(255,255,255,.26);border-radius:7px;transition:color .15s}
        .ar-eye:hover{color:rgba(255,255,255,.65)}
        .ar-err{display:flex;align-items:center;gap:8px;padding:10px 13px;background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.17);border-radius:10px;color:#fca5a5;font-size:13px;font-weight:600}
        .ar-submit{width:100%;height:50px;display:flex;align-items:center;justify-content:center;gap:9px;background:#cc1a1a;color:#fff;font-size:15px;font-weight:700;font-family:inherit;border:none;border-radius:12px;cursor:pointer;box-shadow:0 4px 20px rgba(204,26,26,.30);transition:all .18s;margin-top:4px}
        .ar-submit:hover{background:#e01f1f;box-shadow:0 6px 28px rgba(204,26,26,.44);transform:translateY(-1px)}
        .ar-submit:disabled{opacity:.5;cursor:not-allowed;transform:none}
        .ar-spin{width:19px;height:19px;border-radius:50%;border:2px solid rgba(255,255,255,.22);border-top-color:#fff;animation:spin .65s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .ar-hint{text-align:center;margin-top:20px;font-size:12px;color:rgba(255,255,255,.28)}
        @media(max-width:900px){.ar-form-side{padding:24px 16px}.ar-box{max-width:400px;padding:28px}}
        @media(max-height:760px){.ar-form-side{align-items:flex-start}.ar-box{margin:18px 0}}
      `}</style>
    </div>
  );
}
