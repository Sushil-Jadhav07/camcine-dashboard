import { useEffect, useState } from 'react';
import { Globe, Heart, Mic2, Music2, Play, Search, Upload } from 'lucide-react';

const mockSongs = [
  { id: 1, title: 'Midnight Dreams', artist: 'Luna Sky', duration: '3:45', plays: 125000, likes: 8900, genre: 'Electronic', album: 'Night Sessions', uploaded: '2024-03-15' },
  { id: 2, title: 'Golden Hour', artist: 'Sunset Band', duration: '4:12', plays: 89000, likes: 5600, genre: 'Indie Rock', album: 'Horizon', uploaded: '2024-03-14' },
  { id: 3, title: 'Urban Rhythm', artist: 'City Beats', duration: '3:28', plays: 156000, likes: 12300, genre: 'Hip Hop', album: 'Street Life', uploaded: '2024-03-13' },
  { id: 4, title: 'Ocean Waves', artist: 'Coastal Sound', duration: '5:01', plays: 67000, likes: 4200, genre: 'Ambient', album: 'Nature Sounds', uploaded: '2024-03-12' },
  { id: 5, title: 'Electric Feel', artist: 'Voltage', duration: '3:55', plays: 234000, likes: 18900, genre: 'Synthwave', album: 'Neon Nights', uploaded: '2024-03-11' },
];

const genres = ['All', 'Electronic', 'Indie Rock', 'Hip Hop', 'Ambient', 'Synthwave', 'Pop', 'Rock', 'Jazz'];

const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
};

export function SongsSection() {
  const [songs] = useState(mockSongs);
  const [filteredSongs, setFilteredSongs] = useState(mockSongs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('plays');
  const [activeSongId, setActiveSongId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 120);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = [...songs];

    if (searchQuery) {
      filtered = filtered.filter((song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre !== 'All') {
      filtered = filtered.filter((song) => song.genre === selectedGenre);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'plays') return b.plays - a.plays;
      if (sortBy === 'likes') return b.likes - a.likes;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'artist') return a.artist.localeCompare(b.artist);
      return new Date(b.uploaded) - new Date(a.uploaded);
    });

    setFilteredSongs(filtered);
  }, [searchQuery, selectedGenre, sortBy, songs]);

  const totalPlays = songs.reduce((sum, song) => sum + song.plays, 0);
  const totalLikes = songs.reduce((sum, song) => sum + song.likes, 0);

  return (
    <section className={`dashboard-shell ${isVisible ? 'visible' : ''}`}>
      <div className="shell-container">
        <div className="dashboard-topbar">
          <div className="topbar-title">
            <div className="topbar-icon">
              <Music2 size={18} />
            </div>
            <div>
              <h1>Music Library</h1>
              <p>Manage your music catalog and track performance.</p>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="btn btn-primary">
              <Upload size={16} />
              Upload Song
            </button>
          </div>
        </div>

        <div className="metric-grid">
          <article className="metric-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <span className="metric-label">Total Songs</span>
                <strong className="metric-value">{songs.length}</strong>
              </div>
              <div className="topbar-icon" style={{ width: 32, height: 32, borderRadius: 10 }}>
                <Music2 size={14} />
              </div>
            </div>
          </article>

          <article className="metric-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <span className="metric-label">Total Plays</span>
                <strong className="metric-value">{formatNumber(totalPlays)}</strong>
              </div>
              <div className="topbar-icon" style={{ width: 32, height: 32, borderRadius: 10 }}>
                <Play size={14} />
              </div>
            </div>
          </article>

          <article className="metric-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <span className="metric-label">Total Likes</span>
                <strong className="metric-value">{formatNumber(totalLikes)}</strong>
              </div>
              <div className="topbar-icon" style={{ width: 32, height: 32, borderRadius: 10 }}>
                <Heart size={14} />
              </div>
            </div>
          </article>
        </div>

        <div className="surface-panel">
          <div className="toolbar">
            <div className="toolbar-group" style={{ flex: 1 }}>
              <div className="input-shell" style={{ width: '100%' }}>
                <Search size={16} />
                <input
                  type="text"
                  className="input"
                  placeholder="Search songs, artists, or albums..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
            </div>
            <div className="toolbar-group">
              <select className="select" value={selectedGenre} onChange={(event) => setSelectedGenre(event.target.value)}>
                {genres.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
              </select>
              <select className="select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="plays">Sort by Plays</option>
                <option value="likes">Sort by Likes</option>
                <option value="title">Sort by Title</option>
                <option value="artist">Sort by Artist</option>
                <option value="date">Sort by Date</option>
              </select>
            </div>
          </div>
        </div>

        <div className="list-stack">
          {filteredSongs.map((song) => (
            <div key={song.id} className="list-card" style={{ alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 14,
                    display: 'grid',
                    placeItems: 'center',
                    background: 'var(--accent-soft)',
                    color: 'var(--accent)',
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  <Music2 size={24} />
                  <button
                    className="btn-icon"
                    onClick={() => setActiveSongId(activeSongId === song.id ? null : song.id)}
                    style={{
                      position: 'absolute',
                      right: -8,
                      bottom: -8,
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: 'var(--accent)',
                      color: '#fff',
                      border: '2px solid var(--panel)',
                    }}
                  >
                    <Play size={12} />
                  </button>
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <strong style={{ display: 'block', marginBottom: 4 }}>{song.title}</strong>
                  <div className="subtle" style={{ marginBottom: 8 }}>{song.artist}</div>
                  <div className="inline-meta">
                    <span className="pill">{song.album}</span>
                    <span className="pill">{song.genre}</span>
                    <span className="pill">{song.duration}</span>
                  </div>
                </div>
              </div>

              <div className="inline-meta" style={{ alignItems: 'center', justifyContent: 'flex-end', minWidth: 240 }}>
                <span><Play size={14} /> {formatNumber(song.plays)}</span>
                <span><Heart size={14} /> {formatNumber(song.likes)}</span>
                <button className="btn-icon"><Globe size={14} /></button>
                <button className="btn-icon"><Mic2 size={14} /></button>
              </div>
            </div>
          ))}

          {filteredSongs.length === 0 && (
            <div className="surface-panel">
              <div className="empty-state">
                <div>
                  <h3>No songs found</h3>
                  <p>Try adjusting your search or genre filter.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
