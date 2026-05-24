import { useEffect, useMemo, useState } from 'react';
import { Bookmark, Calendar, Clapperboard, Mail, Search, Trash2, UserRound } from 'lucide-react';
import { PAGE_STYLES } from '../lib/pageStyles.js';
import { userService } from '../services/users.js';
import { watchlistService } from '../services/watchlists.js';

const fullName = user => `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email || 'Unnamed user';
const initials = user => fullName(user).split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'U';
const getItemId = item => item.content_id || item.id;
const getThumb = item => item.thumbnail_url || item.poster_url || item.poster || item.thumbnail || '';

export function WatchlistSection() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingUsers(true);
    userService.getAllUsers({ search, limit: 12 })
      .then(response => {
        if (cancelled) return;
        const rows = response.data?.users || [];
        setUsers(rows);
        if (!selected && rows[0]) setSelected(rows[0]);
      })
      .catch(error => setError(error.message || 'Failed to load users'))
      .finally(() => !cancelled && setLoadingUsers(false));
    return () => { cancelled = true; };
  }, [search]);

  useEffect(() => {
    if (!selected?.id) return;
    let cancelled = false;
    setLoadingItems(true);
    setError('');
    watchlistService.get(selected.id)
      .then(response => {
        if (cancelled) return;
        setItems(response.data?.items || response.data?.watchlist || []);
      })
      .catch(error => setError(error.message || 'Failed to load watchlist'))
      .finally(() => !cancelled && setLoadingItems(false));
    return () => { cancelled = true; };
  }, [selected?.id]);

  const stats = useMemo(() => ({
    users: users.length,
    items: items.length,
    movies: items.filter(item => item.type === 'movie').length,
    shows: items.filter(item => ['show', 'series'].includes(item.type)).length,
  }), [users.length, items]);

  const remove = async (contentId) => {
    await watchlistService.remove(selected.id, contentId);
    setItems(current => current.filter(item => getItemId(item) !== contentId));
  };

  return (
    <div className={`page watchlists-page ${visible ? 'visible' : ''}`}>
      <div className="page-inner watchlists-shell">
        <div className="watchlists-hero">
          <div>
            <div className="watchlists-eyebrow"><Bookmark size={14}/> Saved Lists</div>
            <h1>Watchlists</h1>
            <p>Search a member, inspect their saved titles, and remove stale items without leaving the admin workspace.</p>
          </div>
          <div className="watchlists-hero-metric">
            <strong>{stats.items}</strong>
            <span>saved titles</span>
          </div>
        </div>

        <div className="watchlists-stats">
          {[
            ['Visible Users', stats.users, UserRound],
            ['Saved Titles', stats.items, Bookmark],
            ['Movies', stats.movies, Clapperboard],
            ['Shows', stats.shows, Calendar],
          ].map(([label, value, Icon]) => (
            <div className="wl-stat" key={label}>
              <div className="wl-stat-icon"><Icon size={18}/></div>
              <div><span>{label}</span><strong>{value}</strong></div>
            </div>
          ))}
        </div>

        {error && <div className="wl-error">{error}</div>}

        <div className="watchlists-workspace">
          <aside className="user-browser">
            <div className="user-browser-head">
              <h2>Members</h2>
              <span>{users.length}</span>
            </div>
            <div className="fsearch user-search">
              <Search size={15}/>
              <input placeholder="Search name or email..." value={search} onChange={event => setSearch(event.target.value)} />
            </div>
            <div className="user-list">
              {loadingUsers ? (
                <div className="wl-loader"><span className="spin"/>Loading users...</div>
              ) : users.length ? users.map(user => (
                <button
                  key={user.id}
                  type="button"
                  className={`user-row ${selected?.id === user.id ? 'active' : ''}`}
                  onClick={() => setSelected(user)}
                  title={`${fullName(user)} ${user.email || ''}`}
                >
                  <span className="user-avatar">{initials(user)}</span>
                  <span className="user-copy">
                    <strong>{fullName(user)}</strong>
                    <small><Mail size={11}/>{user.email || 'No email'}</small>
                  </span>
                </button>
              )) : (
                <div className="empty compact"><UserRound size={30}/><p>No users found</p></div>
              )}
            </div>
          </aside>

          <section className="watchlist-panel">
            <div className="watchlist-panel-head">
              <div className="selected-user">
                <span className="user-avatar large">{selected ? initials(selected) : 'U'}</span>
                <span>
                  <h2>{selected ? fullName(selected) : 'Select a user'}</h2>
                  <p>{selected?.email || 'Choose a member to inspect their saved titles'}</p>
                </span>
              </div>
              {selected && <span className="badge b-accent">{items.length} saved</span>}
            </div>

            {!selected ? (
              <div className="empty watchlist-empty"><Bookmark size={38}/><p>Select a user to view their watchlist</p></div>
            ) : loadingItems ? (
              <div className="wl-loader panel"><span className="spin"/>Loading watchlist...</div>
            ) : items.length ? (
              <div className="watchlist-table">
                <div className="watchlist-table-head">
                  <span>Content</span>
                  <span>Type</span>
                  <span>Added</span>
                  <span></span>
                </div>
                {items.map(item => {
                  const id = getItemId(item);
                  return (
                    <div className="watchlist-row" key={id}>
                      <div className="content-cell">
                        <span className="content-thumb">
                          {getThumb(item) ? <img src={getThumb(item)} alt="" /> : <Clapperboard size={17}/>}
                        </span>
                        <span className="content-copy">
                          <strong>{item.title || 'Untitled content'}</strong>
                          <small>{item.language || item.region || item.description || 'Saved content'}</small>
                        </span>
                      </div>
                      <span><span className="badge b-gray">{item.type || 'content'}</span></span>
                      <span className="added-date"><Calendar size={12}/>{item.added_at ? new Date(item.added_at).toLocaleDateString() : '-'}</span>
                      <span className="row-actions">
                        <button className="btn btn-danger btn-sm" onClick={() => remove(id)}><Trash2 size={13}/>Remove</button>
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty watchlist-empty">
                <Bookmark size={38}/>
                <p>This user has no saved titles yet</p>
              </div>
            )}
          </section>
        </div>
      </div>
      <style>{`${PAGE_STYLES}
        .watchlists-page { padding-top:28px; }
        .watchlists-shell { max-width:1520px; gap:18px; }
        .watchlists-hero {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:20px;
          min-height:142px;
          padding:28px 32px;
          border-radius:8px;
          border:1px solid rgba(255,255,255,.08);
          background:
            linear-gradient(90deg, rgba(204,26,26,.16), rgba(204,26,26,0) 46%),
            #141414;
        }
        .watchlists-eyebrow { display:inline-flex; align-items:center; gap:8px; margin-bottom:10px; color:#ff8a8a; font-size:11px; font-weight:900; letter-spacing:.12em; text-transform:uppercase; }
        .watchlists-hero h1 { margin:0; color:#fff; font-size:34px; font-weight:900; letter-spacing:-.03em; }
        .watchlists-hero p { max-width:680px; margin:7px 0 0; color:rgba(255,255,255,.48); font-size:14px; line-height:1.6; }
        .watchlists-hero-metric { min-width:132px; padding:18px; border-radius:8px; border:1px solid rgba(204,26,26,.25); background:rgba(204,26,26,.10); text-align:center; }
        .watchlists-hero-metric strong { display:block; color:#fff; font-size:32px; line-height:1; }
        .watchlists-hero-metric span { display:block; margin-top:6px; color:#ff9a9a; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.1em; }
        .watchlists-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
        .wl-stat { display:flex; align-items:center; gap:13px; min-height:78px; padding:16px; border-radius:8px; border:1px solid rgba(255,255,255,.07); background:#141414; }
        .wl-stat-icon { width:42px; height:42px; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#ff6b6b; background:rgba(204,26,26,.12); border:1px solid rgba(204,26,26,.22); }
        .wl-stat span { display:block; color:rgba(255,255,255,.38); font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:.1em; margin-bottom:5px; }
        .wl-stat strong { display:block; color:#fff; font-size:23px; line-height:1; }
        .wl-error { padding:11px 14px; border-radius:8px; border:1px solid rgba(239,68,68,.18); color:#fca5a5; background:rgba(239,68,68,.08); font-size:13px; }
        .watchlists-workspace { display:grid; grid-template-columns:360px minmax(0,1fr); gap:18px; align-items:start; }
        .user-browser, .watchlist-panel { border:1px solid rgba(255,255,255,.07); border-radius:8px; background:#141414; overflow:hidden; }
        .user-browser { padding:18px; }
        .user-browser-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
        .user-browser-head h2 { margin:0; color:#fff; font-size:16px; font-weight:800; }
        .user-browser-head span { color:rgba(255,255,255,.42); font-size:12px; font-weight:800; }
        .user-search { width:100%; min-width:0; margin-bottom:14px; }
        .user-list { display:flex; flex-direction:column; gap:8px; max-height:560px; overflow:auto; padding-right:2px; }
        .user-row {
          width:100%;
          display:flex;
          align-items:center;
          gap:12px;
          min-height:58px;
          padding:10px;
          border-radius:8px;
          border:1px solid rgba(255,255,255,.08);
          background:rgba(255,255,255,.035);
          color:inherit;
          text-align:left;
          cursor:pointer;
          font-family:inherit;
          transition:background .15s, border-color .15s, box-shadow .15s;
        }
        .user-row:hover { background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.14); }
        .user-row.active { background:rgba(204,26,26,.16); border-color:rgba(204,26,26,.35); box-shadow:inset 3px 0 0 #cc1a1a; }
        .user-avatar { width:38px; height:38px; flex:0 0 38px; border-radius:8px; display:flex; align-items:center; justify-content:center; background:rgba(204,26,26,.12); border:1px solid rgba(204,26,26,.22); color:#ff7777; font-weight:900; font-size:12px; }
        .user-avatar.large { width:48px; height:48px; flex-basis:48px; font-size:15px; }
        .user-copy { min-width:0; flex:1; display:block; }
        .user-copy strong { display:block; color:#fff; font-size:13px; line-height:1.25; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .user-copy small { display:flex; align-items:center; gap:5px; min-width:0; margin-top:5px; color:rgba(255,255,255,.42); font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .watchlist-panel { min-height:640px; }
        .watchlist-panel-head { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:18px 20px; border-bottom:1px solid rgba(255,255,255,.07); }
        .selected-user { display:flex; align-items:center; gap:13px; min-width:0; }
        .selected-user h2 { margin:0; color:#fff; font-size:17px; font-weight:850; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .selected-user p { margin:4px 0 0; color:rgba(255,255,255,.42); font-size:12.5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .watchlist-table { display:flex; flex-direction:column; }
        .watchlist-table-head, .watchlist-row { display:grid; grid-template-columns:minmax(320px,1fr) 130px 150px 120px; align-items:center; gap:14px; }
        .watchlist-table-head { padding:12px 20px; background:#111; color:rgba(255,255,255,.30); font-size:10px; font-weight:900; letter-spacing:.1em; text-transform:uppercase; border-bottom:1px solid rgba(255,255,255,.06); }
        .watchlist-row { padding:14px 20px; border-bottom:1px solid rgba(255,255,255,.06); }
        .watchlist-row:last-child { border-bottom:0; }
        .watchlist-row:hover { background:rgba(255,255,255,.025); }
        .content-cell { display:flex; align-items:center; gap:12px; min-width:0; }
        .content-thumb { width:54px; height:70px; flex:0 0 54px; border-radius:7px; overflow:hidden; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,.05); color:rgba(255,255,255,.24); border:1px solid rgba(255,255,255,.07); }
        .content-thumb img { width:100%; height:100%; object-fit:cover; }
        .content-copy { min-width:0; }
        .content-copy strong { display:block; color:#fff; font-size:13.5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-bottom:5px; }
        .content-copy small { display:block; color:rgba(255,255,255,.40); font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .added-date { display:flex; align-items:center; gap:6px; color:rgba(255,255,255,.42); font-size:12px; }
        .row-actions { display:flex; justify-content:flex-end; }
        .wl-loader { display:flex; align-items:center; justify-content:center; gap:10px; padding:34px; color:rgba(255,255,255,.35); font-size:13px; }
        .wl-loader.panel { min-height:420px; }
        .empty.compact { padding:36px 12px; }
        .watchlist-empty { min-height:420px; }
        @media(max-width:1180px){
          .watchlists-workspace{grid-template-columns:1fr}
          .user-list{max-height:360px}
        }
        @media(max-width:900px){
          .watchlists-hero{align-items:stretch; flex-direction:column}
          .watchlists-hero-metric{text-align:left}
          .watchlists-stats{grid-template-columns:repeat(2,1fr)}
          .watchlist-table-head{display:none}
          .watchlist-row{grid-template-columns:1fr; gap:10px}
          .row-actions{justify-content:flex-start}
        }
        @media(max-width:560px){
          .watchlists-stats{grid-template-columns:1fr}
          .watchlists-hero h1{font-size:28px}
          .watchlist-panel-head{align-items:flex-start; flex-direction:column}
        }
      `}</style>
    </div>
  );
}
