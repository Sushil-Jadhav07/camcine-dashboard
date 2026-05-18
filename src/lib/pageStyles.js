// Shared inline style strings injected into each page's <style> block
export const PAGE_STYLES = `
  /* ── shared page shell ── */
  .page { min-height:100vh; padding:32px 32px 64px; opacity:0; transform:translateY(14px); transition:opacity .35s ease, transform .35s ease; }
  .page.visible { opacity:1; transform:none; }
  .page-inner { max-width:1380px; margin:0 auto; display:flex; flex-direction:column; gap:24px; }

  /* ── page header bar ── */
  .ph { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:22px 28px; background:#141414; border:1px solid rgba(255,255,255,0.07); border-radius:18px; }
  .ph-left h1 { font-size:24px; font-weight:800; color:#f5f5f5; letter-spacing:-.02em; }
  .ph-left p  { font-size:13px; color:rgba(255,255,255,.38); margin-top:3px; }
  .ph-right   { display:flex; align-items:center; gap:10px; flex-shrink:0; }

  /* ── cards ── */
  .card  { background:#141414; border:1px solid rgba(255,255,255,.07); border-radius:18px; padding:22px; }
  .card-title { font-size:15px; font-weight:700; color:#f5f5f5; margin-bottom:4px; }
  .card-sub   { font-size:12px; color:rgba(255,255,255,.35); }

  /* ── stat cards ── */
  .stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
  .sc { background:#141414; border:1px solid rgba(255,255,255,.07); border-radius:16px; padding:20px; display:flex; gap:16px; align-items:center; transition:border-color .2s, box-shadow .2s, transform .2s; position:relative; overflow:hidden; }
  .sc::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#cc1a1a,transparent); opacity:0; transition:opacity .2s; }
  .sc:hover { border-color:rgba(204,26,26,.28); box-shadow:0 4px 20px rgba(0,0,0,.35); transform:translateY(-2px); }
  .sc:hover::after { opacity:1; }
  .sc-icon { width:46px; height:46px; border-radius:13px; background:rgba(204,26,26,.10); color:#ff6b6b; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .sc-label { font-size:10px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.35); margin-bottom:4px; }
  .sc-value { font-size:26px; font-weight:800; color:#f5f5f5; letter-spacing:-.03em; line-height:1; margin-bottom:4px; }
  .sc-change { display:flex; align-items:center; gap:4px; font-size:12px; font-weight:600; }
  .sc-change.up   { color:#4ade80; }
  .sc-change.down { color:#f87171; }

  /* ── filter bar ── */
  .fbar { display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:14px 18px; background:#141414; border:1px solid rgba(255,255,255,.07); border-radius:14px; }
  .fsearch { flex:1; min-width:200px; display:flex; align-items:center; gap:10px; padding:9px 14px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:10px; }
  .fsearch input { flex:1; background:transparent; border:none; outline:none; color:#f5f5f5; font-size:13px; font-family:inherit; }
  .fsearch input::placeholder { color:rgba(255,255,255,.3); }
  .fselect { padding:9px 12px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:10px; color:#f5f5f5; font-size:13px; font-family:inherit; cursor:pointer; outline:none; }
  .fselect:focus { border-color:rgba(204,26,26,.4); }

  /* ── table ── */
  .tbl-wrap { overflow-x:auto; border-radius:14px; border:1px solid rgba(255,255,255,.07); }
  .tbl { width:100%; border-collapse:collapse; }
  .tbl th { padding:11px 16px; font-size:10px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.30); background:#111; border-bottom:1px solid rgba(255,255,255,.06); text-align:left; white-space:nowrap; }
  .tbl td { padding:14px 16px; border-bottom:1px solid rgba(255,255,255,.05); color:#f5f5f5; font-size:13.5px; vertical-align:middle; }
  .tbl tr:last-child td { border-bottom:none; }
  .tbl tr:hover td { background:rgba(255,255,255,.02); }

  /* ── badges ── */
  .badge { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:999px; font-size:11px; font-weight:700; border:1px solid transparent; }
  .b-green  { background:rgba(34,197,94,.10);   color:#4ade80; border-color:rgba(34,197,94,.18); }
  .b-yellow { background:rgba(245,158,11,.10);  color:#fbbf24; border-color:rgba(245,158,11,.18); }
  .b-red    { background:rgba(239,68,68,.10);   color:#f87171; border-color:rgba(239,68,68,.18); }
  .b-gray   { background:rgba(255,255,255,.06); color:rgba(255,255,255,.50); border-color:rgba(255,255,255,.10); }
  .b-accent { background:rgba(204,26,26,.12);   color:#ff6b6b; border-color:rgba(204,26,26,.22); }
  .b-blue   { background:rgba(59,130,246,.10);  color:#60a5fa; border-color:rgba(59,130,246,.18); }
  .b-purple { background:rgba(139,92,246,.10);  color:#a78bfa; border-color:rgba(139,92,246,.18); }

  /* ── buttons ── */
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:7px; padding:9px 18px; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; border:1px solid transparent; transition:all .15s ease; outline:none; font-family:inherit; white-space:nowrap; }
  .btn svg { width:15px; height:15px; }
  .btn-primary { background:#cc1a1a; color:#fff; border-color:#cc1a1a; box-shadow:0 3px 12px rgba(204,26,26,.28); }
  .btn-primary:hover { background:#e01f1f; box-shadow:0 4px 16px rgba(204,26,26,.38); transform:translateY(-1px); }
  .btn-secondary { background:rgba(255,255,255,.05); color:#f5f5f5; border-color:rgba(255,255,255,.10); }
  .btn-secondary:hover { background:rgba(255,255,255,.09); border-color:rgba(255,255,255,.16); }
  .btn-ghost { background:transparent; color:rgba(255,255,255,.50); border-color:transparent; }
  .btn-ghost:hover { background:rgba(255,255,255,.04); color:#f5f5f5; }
  .btn-danger { background:rgba(239,68,68,.10); color:#f87171; border-color:rgba(239,68,68,.20); }
  .btn-danger:hover { background:rgba(239,68,68,.18); }
  .btn-sm { padding:6px 13px; font-size:12px; border-radius:8px; }
  .btn-icon { width:34px; height:34px; padding:0; border-radius:9px; }
  .btn:disabled { opacity:.45; cursor:not-allowed; transform:none !important; }

  /* ── inputs ── */
  .inp { width:100%; padding:10px 14px; background:#1a1a1a; border:1px solid rgba(255,255,255,.09); border-radius:10px; color:#f5f5f5; font-size:13.5px; font-family:inherit; outline:none; transition:border-color .15s, box-shadow .15s; }
  .inp:focus { border-color:#cc1a1a; box-shadow:0 0 0 3px rgba(204,26,26,.10); }
  .inp::placeholder { color:rgba(255,255,255,.25); }
  .lbl { font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,.35); margin-bottom:6px; display:block; }

  /* ── form group ── */
  .fg { display:flex; flex-direction:column; gap:6px; }
  .form-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .form-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }

  /* ── modal ── */
  .modal-bg { position:fixed; inset:0; background:rgba(0,0,0,.70); backdrop-filter:blur(6px); z-index:2000; display:flex; align-items:center; justify-content:center; padding:20px; }
  .modal-box { background:#141414; border:1px solid rgba(255,255,255,.09); border-radius:22px; width:100%; max-width:560px; max-height:90vh; overflow-y:auto; padding:30px; box-shadow:0 24px 64px rgba(0,0,0,.6); }
  .modal-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
  .modal-hdr h3 { font-size:18px; font-weight:800; color:#f5f5f5; }
  .modal-close { width:32px; height:32px; border-radius:9px; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.09); color:rgba(255,255,255,.50); cursor:pointer; display:flex; align-items:center; justify-content:center; }
  .modal-close:hover { background:rgba(255,255,255,.09); color:#f5f5f5; }
  .modal-footer { display:flex; justify-content:flex-end; gap:10px; margin-top:24px; padding-top:20px; border-top:1px solid rgba(255,255,255,.07); }

  /* ── pagination ── */
  .pgn { display:flex; align-items:center; gap:8px; }
  .pgn-info { font-size:12px; color:rgba(255,255,255,.35); }

  /* ── empty state ── */
  .empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; gap:12px; color:rgba(255,255,255,.25); }
  .empty svg { color:rgba(255,255,255,.12); }
  .empty p { font-size:14px; }

  /* ── loading ── */
  .spin { width:20px; height:20px; border:2px solid rgba(255,255,255,.15); border-top-color:#cc1a1a; border-radius:50%; animation:spin .7s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }

  /* ── tabs ── */
  .tabs { display:flex; gap:4px; padding:4px; background:#111; border:1px solid rgba(255,255,255,.07); border-radius:12px; width:fit-content; }
  .tab { padding:8px 16px; border-radius:9px; font-size:13px; font-weight:600; color:rgba(255,255,255,.40); background:transparent; border:none; cursor:pointer; transition:all .15s; font-family:inherit; }
  .tab.active { background:rgba(204,26,26,.15); color:#ff9999; border:1px solid rgba(204,26,26,.22); }
  .tab:hover:not(.active) { color:rgba(255,255,255,.70); background:rgba(255,255,255,.04); }

  /* ── input with icon ── */
  .inp-wrap { position:relative; display:flex; align-items:center; }
  .inp-icon { position:absolute; left:12px; color:rgba(255,255,255,.30); pointer-events:none; }
  .inp-wrap .inp { padding-left:38px; }
  .inp-end { position:absolute; right:10px; }

  .custom-select { position:relative; min-width:120px; }
  .custom-select-trigger { width:100%; min-height:42px; display:flex; align-items:center; justify-content:space-between; gap:12px; padding:0 14px; border-radius:10px; border:1px solid rgba(255,255,255,.10); background:#1a1a1a; color:#f5f5f5; font-family:inherit; font-size:13px; font-weight:700; cursor:pointer; transition:border-color .15s, background .15s; }
  .custom-select.open .custom-select-trigger,
  .custom-select-trigger:hover { border-color:rgba(204,26,26,.45); background:#181818; }
  .custom-select-trigger svg { color:rgba(255,255,255,.58); flex-shrink:0; }
  .custom-select-menu { position:absolute; top:calc(100% + 6px); left:0; right:0; z-index:3000; display:flex; flex-direction:column; min-width:100%; padding:6px; border-radius:12px; background:#101010; border:1px solid rgba(255,255,255,.12); box-shadow:0 18px 48px rgba(0,0,0,.55); }
  .custom-select-option { width:100%; display:flex; align-items:center; min-height:34px; padding:0 10px; border:0; border-radius:8px; background:transparent; color:rgba(255,255,255,.72); font-family:inherit; font-size:13px; text-align:left; cursor:pointer; }
  .custom-select-option:hover { background:rgba(255,255,255,.07); color:#fff; }
  .custom-select-option.selected { background:rgba(204,26,26,.22); color:#ff9a9a; font-weight:800; }
  .custom-select-option:disabled { opacity:.35; cursor:not-allowed; }
  .inp.custom-select { padding:0; border:0; background:transparent; }
  .inp.custom-select .custom-select-trigger { min-height:48px; border-color:rgba(255,255,255,.10); }

  /* ── section divider ── */
  .sect-divider { height:1px; background:rgba(255,255,255,.06); margin:4px 0; }

  /* ── avatar ── */
  .avatar { width:36px; height:36px; border-radius:10px; background:rgba(204,26,26,.12); border:1px solid rgba(204,26,26,.20); color:#ff6b6b; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; flex-shrink:0; overflow:hidden; }
  .avatar img { width:100%; height:100%; object-fit:cover; }
  .avatar-lg { width:52px; height:52px; border-radius:14px; font-size:18px; }
  .avatar-xl { width:72px; height:72px; border-radius:18px; font-size:24px; }

  /* ── toggle switch ── */
  .toggle { position:relative; width:40px; height:22px; flex-shrink:0; }
  .toggle input { opacity:0; width:0; height:0; }
  .toggle-slider { position:absolute; inset:0; background:rgba(255,255,255,.12); border-radius:999px; cursor:pointer; transition:background .2s; }
  .toggle-slider::before { content:''; position:absolute; width:16px; height:16px; left:3px; top:3px; background:#fff; border-radius:50%; transition:transform .2s; }
  .toggle input:checked + .toggle-slider { background:#cc1a1a; }
  .toggle input:checked + .toggle-slider::before { transform:translateX(18px); }

  /* ── responsive ── */
  @media (max-width:1100px) { .stats-row { grid-template-columns:repeat(2,1fr); } }
  @media (max-width:768px)  { .page { padding:20px 16px 48px; } .stats-row { grid-template-columns:1fr; } .form-grid-2,.form-grid-3 { grid-template-columns:1fr; } .ph { flex-direction:column; align-items:stretch; } }
`;
