import { useEffect, useState } from 'react';
import { Eye, Film, Filter, Grid2X2, List, Music, Play, Search, Star, Tv } from 'lucide-react';

const mockContent = [
  { id: 1, title: 'The Midnight Archive', type: 'film', genre: 'Thriller', duration: '2:45', rating: 4.8, views: 125000, status: 'published', date: '2024-03-15', thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80' },
  { id: 2, title: 'Cyber Chronicles S2', type: 'series', genre: 'Sci-Fi', duration: '45:12', rating: 4.6, views: 98000, status: 'published', date: '2024-03-14', thumbnail: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80' },
  { id: 3, title: 'Urban Legends Documentary', type: 'film', genre: 'Documentary', duration: '1:32:45', rating: 4.7, views: 87000, status: 'published', date: '2024-03-13', thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80' },
  { id: 4, title: 'Comedy Special: Live Tonight', type: 'special', genre: 'Comedy', duration: '58:30', rating: 4.5, views: 76000, status: 'published', date: '2024-03-12', thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80' },
  { id: 5, title: 'Science Explained: Space', type: 'educational', genre: 'Educational', duration: '28:15', rating: 4.9, views: 65000, status: 'published', date: '2024-03-11', thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80' },
  { id: 6, title: 'Indie Music Festival 2024', type: 'music', genre: 'Music', duration: '2:15:30', rating: 4.4, views: 54000, status: 'published', date: '2024-03-10', thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80' },
];

const contentTypes = ['All', 'film', 'series', 'special', 'educational', 'music'];
const genres = ['All', 'Thriller', 'Sci-Fi', 'Documentary', 'Comedy', 'Educational', 'Music'];
const statusOptions = ['All', 'published', 'draft', 'scheduled', 'archived'];

const typeIcons = {
  film: Film,
  series: Tv,
  music: Music,
  special: Star,
  educational: Play,
};

const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
};

export function ContentLibrarySection() {
  const [content] = useState(mockContent);
  const [filteredContent, setFilteredContent] = useState(mockContent);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    let filtered = [...content];
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedType !== 'All') filtered = filtered.filter((item) => item.type === selectedType);
    if (selectedGenre !== 'All') filtered = filtered.filter((item) => item.genre === selectedGenre);
    if (selectedStatus !== 'All') filtered = filtered.filter((item) => item.status === selectedStatus);
    filtered.sort((a, b) => {
      if (sortBy === 'views') return b.views - a.views;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(b.date) - new Date(a.date);
    });
    setFilteredContent(filtered);
  }, [content, searchQuery, selectedGenre, selectedStatus, selectedType, sortBy]);

  return (
    <section className="dashboard-shell">
      <div className="shell-container">
        <div className="hero-panel compact">
          <div className="hero-content hero-grid">
            <div className="hero-copy">
              <span className="hero-topline">Content library</span>
              <h1>Rebuilt as a red-led catalog floor for titles, media, and metadata.</h1>
              <p>Search, filter, and browse the same items as before, now with a poster-led layout and cleaner scan paths.</p>
            </div>
            <div className="hero-side">
              <div className="hero-stat">
                <div className="hero-kicker">Library size</div>
                <strong>{content.length}</strong>
                <span>Active titles in the current showcase</span>
              </div>
            </div>
          </div>
        </div>

        <div className="surface-panel">
          <div className="surface-content toolbar">
            <div className="toolbar-group">
              <div className="input-shell">
                <Search size={16} />
                <input className="input" placeholder="Search content..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
              </div>
              <select className="select" value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
                {contentTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <select className="select" value={selectedGenre} onChange={(event) => setSelectedGenre(event.target.value)}>
                {genres.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
              </select>
              <select className="select" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
                {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <select className="select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="date">Newest</option>
                <option value="views">Most viewed</option>
                <option value="rating">Top rated</option>
                <option value="title">Title</option>
              </select>
            </div>
            <div className="toolbar-actions">
              <button className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('grid')}>
                <Grid2X2 size={16} />
                Grid
              </button>
              <button className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('list')}>
                <List size={16} />
                List
              </button>
            </div>
          </div>
        </div>

        {filteredContent.length === 0 ? (
          <div className="surface-panel">
            <div className="empty-state">
              <div>
                <h3>No content found</h3>
                <p>Try different filters or a broader search query.</p>
              </div>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="poster-grid">
            {filteredContent.map((item) => {
              const Icon = typeIcons[item.type] ?? Film;
              return (
                <article key={item.id} className="poster-card">
                  <div className="poster-media">
                    <img src={item.thumbnail} alt={item.title} />
                    <div className="poster-overlay">
                      <span className="status-pill success">{item.status}</span>
                      <button className="btn-icon">
                        <Play size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="poster-body">
                    <div className="inline-meta">
                      <span className="pill"><Icon size={14} /> {item.type}</span>
                      <span className="pill">{item.genre}</span>
                    </div>
                    <h3 style={{ marginBottom: 8 }}>{item.title}</h3>
                    <div className="inline-meta" style={{ marginBottom: 10 }}>
                      <span>{item.duration}</span>
                      <span>{item.date}</span>
                    </div>
                    <div className="toolbar">
                      <div className="inline-meta">
                        <span><Star size={14} /> {item.rating}</span>
                        <span><Eye size={14} /> {formatNumber(item.views)}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="table-panel">
            <div className="table-shell">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Genre</th>
                    <th>Duration</th>
                    <th>Rating</th>
                    <th>Views</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContent.map((item) => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{item.type}</td>
                      <td>{item.genre}</td>
                      <td>{item.duration}</td>
                      <td>{item.rating}</td>
                      <td>{formatNumber(item.views)}</td>
                      <td>{item.status}</td>
                      <td>{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-icon"><Film size={22} /></div>
            <span className="eyebrow">Titles</span>
            <strong>{content.length}</strong>
          </div>
          <div className="metric-card">
            <div className="metric-icon"><Eye size={22} /></div>
            <span className="eyebrow">Total Views</span>
            <strong>{formatNumber(content.reduce((sum, item) => sum + item.views, 0))}</strong>
          </div>
          <div className="metric-card">
            <div className="metric-icon"><Filter size={22} /></div>
            <span className="eyebrow">Filtered Results</span>
            <strong>{filteredContent.length}</strong>
          </div>
          <div className="metric-card">
            <div className="metric-icon"><Star size={22} /></div>
            <span className="eyebrow">Average Rating</span>
            <strong>{(content.reduce((sum, item) => sum + item.rating, 0) / content.length).toFixed(1)}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
