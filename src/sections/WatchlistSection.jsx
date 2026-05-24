import { useEffect, useState } from 'react';
import { Bookmark, Search, Trash2 } from 'lucide-react';
import { PAGE_STYLES } from '../lib/pageStyles.js';
import { userService } from '../services/users.js';
import { watchlistService } from '../services/watchlists.js';

export function WatchlistSection() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
  useEffect(() => {
    userService.getAllUsers({ search, limit: 8 }).then(response => setUsers(response.data?.users || [])).catch(console.error);
  }, [search]);
  useEffect(() => {
    if (!selected) return;
    watchlistService.get(selected).then(response => setItems(response.data?.items || response.data?.watchlist || [])).catch(console.error);
  }, [selected]);

  const remove = async (contentId) => {
    await watchlistService.remove(selected, contentId);
    setItems(items.filter(item => item.content_id !== contentId && item.id !== contentId));
  };

  return (
    <div className={`page ${visible ? 'visible' : ''}`}>
      <div className="page-inner">
        <div className="ph"><div className="ph-left"><h1>Watchlists</h1><p>Inspect and manage saved user lists</p></div></div>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 18 }}>
          <div className="card">
            <div className="fsearch" style={{ marginBottom: 14 }}><Search size={15}/><input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {users.map(user => <button key={user.id} className={`btn ${selected === user.id ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelected(user.id)} style={{ justifyContent: 'flex-start' }}>{user.first_name} {user.last_name}<span style={{ color: 'rgba(255,255,255,.45)' }}>{user.email}</span></button>)}
            </div>
          </div>
          <div className="card">
            {!selected ? <div className="empty"><Bookmark size={36}/><p>Select a user to view their list</p></div> : (
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead><tr><th>Content</th><th>Type</th><th>Added</th><th></th></tr></thead>
                  <tbody>{items.map(item => {
                    const id = item.content_id || item.id;
                    return <tr key={id}>
                      <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><img src={item.thumbnail_url || item.poster_url} alt="" style={{ width: 42, height: 56, objectFit: 'cover', borderRadius: 6 }}/><span>{item.title}</span></div></td>
                      <td><span className="badge b-gray">{item.type}</span></td>
                      <td>{item.added_at ? new Date(item.added_at).toLocaleDateString() : '-'}</td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => remove(id)}><Trash2 size={13}/>Remove</button></td>
                    </tr>;
                  })}</tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{PAGE_STYLES}</style>
    </div>
  );
}
