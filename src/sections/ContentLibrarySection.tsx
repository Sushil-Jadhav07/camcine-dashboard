import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Film,
  Music,
  Radio,
  Tv,
  CheckCircle,
  Clock
} from 'lucide-react';
import type { Section, UserRole } from '../App';

interface ContentLibrarySectionProps {
  onNavigate: (section: Section) => void;
  userRole: UserRole;
  userId: string;
}

interface ContentItem {
  id: number;
  title: string;
  type: 'movie' | 'series' | 'short' | 'song' | 'news-clip';
  genre: string;
  status: 'published' | 'draft' | 'processing';
  updated: string;
  thumbnail: string;
  manager_id: string;
  episodes?: number;
  duration?: string;
  artist?: string;
  isLive?: boolean;
}

const mockContent: ContentItem[] = [
  { id: 1, title: 'The Midnight Archive', type: 'movie', genre: 'Thriller', status: 'published', updated: '2 hours ago', manager_id: 'manager001', thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=300&fit=crop' },
  { id: 2, title: 'Cyber Chronicles', type: 'series', genre: 'Sci-Fi', status: 'published', updated: '5 hours ago', manager_id: 'manager001', episodes: 12, thumbnail: 'https://images.unsplash.com/photo-1515630278258-407f66498911?w=200&h=300&fit=crop' },
  { id: 3, title: 'Echoes of Tomorrow', type: 'movie', genre: 'Drama', status: 'draft', updated: '1 day ago', manager_id: 'manager002', thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=300&fit=crop' },
  { id: 4, title: 'Neon Dreams', type: 'series', genre: 'Crime', status: 'processing', updated: '2 days ago', manager_id: 'manager002', episodes: 8, thumbnail: 'https://images.unsplash.com/photo-1594909122849-11daa2a0cf2b?w=200&h=300&fit=crop' },
  { id: 5, title: 'The Last Horizon', type: 'movie', genre: 'Adventure', status: 'published', updated: '3 days ago', manager_id: 'manager003', thumbnail: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&h=300&fit=crop' },
  { id: 6, title: 'Shadow Protocol', type: 'series', genre: 'Action', status: 'draft', updated: '4 days ago', manager_id: 'manager001', episodes: 10, thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=200&h=300&fit=crop' },
  { id: 7, title: 'Silent Waters', type: 'movie', genre: 'Mystery', status: 'published', updated: '5 days ago', manager_id: 'manager004', thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&h=300&fit=crop' },
  { id: 8, title: 'Urban Legends', type: 'series', genre: 'Horror', status: 'processing', updated: '1 week ago', manager_id: 'manager003', episodes: 6, thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=200&h=300&fit=crop' },
  { id: 9, title: 'Glass House', type: 'short', genre: 'Drama', status: 'published', updated: '1 week ago', manager_id: 'manager001', duration: '18 min', thumbnail: 'https://images.unsplash.com/photo-1497015289639-54688650d173?w=200&h=300&fit=crop' },
  { id: 10, title: 'Kesariya Dhun', type: 'song', genre: 'Film Song', status: 'published', updated: '2 days ago', manager_id: 'manager001', artist: 'Aarav Mehta', duration: '4:23', thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
  { id: 11, title: 'Kaveri Raagam', type: 'song', genre: 'Classical', status: 'draft', updated: '3 days ago', manager_id: 'manager002', artist: 'Nila Subramaniam', duration: '6:12', thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop' },
  { id: 12, title: 'Mumbai Rain Alert', type: 'news-clip', genre: 'News', status: 'published', updated: '45 min ago', manager_id: 'manager001', duration: '3:12', isLive: true, thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=300&h=300&fit=crop' },
  { id: 13, title: 'Delhi Policy Brief', type: 'news-clip', genre: 'News', status: 'published', updated: '2 hours ago', manager_id: 'manager002', duration: '6:40', isLive: false, thumbnail: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=300&h=300&fit=crop' },
];

const genres = ['All', 'Action', 'Adventure', 'Crime', 'Drama', 'Horror', 'Mystery', 'Sci-Fi', 'Thriller', 'Film Song', 'Classical', 'News'];
const types = ['All', 'Movie', 'Series', 'Short', 'Song', 'News Clip'];
const statuses = ['All', 'Published', 'Draft', 'Processing'];
const contentTabs = [
  { label: 'All', value: 'All' },
  { label: 'Movies', value: 'movie' },
  { label: 'TV Shows', value: 'series' },
  { label: 'Short Films', value: 'short' },
  { label: 'Songs', value: 'song' },
  { label: 'News Clips', value: 'news-clip' },
] as const;

export function ContentLibrarySection({ onNavigate, userRole, userId }: ContentLibrarySectionProps) {
  const [content] = useState<ContentItem[]>(mockContent);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>(mockContent);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedContentTab, setSelectedContentTab] = useState<(typeof contentTabs)[number]['value']>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = userRole === 'manager'
      ? content.filter(item => item.manager_id === userId)
      : content;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        `${item.title} ${item.artist || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre !== 'All') {
      filtered = filtered.filter(item => item.genre === selectedGenre);
    }

    if (selectedType !== 'All') {
      const typeMap: Record<string, ContentItem['type']> = {
        Movie: 'movie',
        Series: 'series',
        Short: 'short',
        Song: 'song',
        'News Clip': 'news-clip',
      };
      filtered = filtered.filter(item => item.type === typeMap[selectedType]);
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter(item => 
        item.status === selectedStatus.toLowerCase()
      );
    }

    if (selectedContentTab !== 'All') {
      filtered = filtered.filter(item => item.type === selectedContentTab);
    }

    setFilteredContent(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, selectedType, selectedStatus, selectedContentTab, content, userRole, userId]);

  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
  const paginatedContent = filteredContent.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="badge badge-success"><CheckCircle /> Published</span>;
      case 'draft':
        return <span className="badge badge-neutral"><Clock /> Draft</span>;
      case 'processing':
        return <span className="badge badge-warning"><Clock /> Processing</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === 'song') return <Music className="type-icon" />;
    if (type === 'news-clip') return <Radio className="type-icon" />;
    if (type === 'series') return <Tv className="type-icon" />;
    return <Film className="type-icon" />;
  };

  const getTypeLabel = (type: ContentItem['type']) => {
    const labels: Record<ContentItem['type'], string> = {
      movie: 'Movie',
      series: 'TV Show',
      short: 'Short Film',
      song: 'Song',
      'news-clip': 'News Clip',
    };
    return labels[type];
  };

  return (
    <section className="content-library-section">
      <div className="content-container">
        {/* Header */}
        <div 
          className="content-header"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease'
          }}
        >
          <div>
            <h1>{userRole === 'manager' ? 'My Content' : 'Content Library'}</h1>
            <p>Search, filter, and update metadata in bulk.</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => onNavigate('add-title-type')}
          >
            <Plus /> Upload New
          </button>
        </div>

        {/* Filters */}
        <div 
          className="filters-bar"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s'
          }}
        >
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              className="input"
              placeholder="Search titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <Filter className="filter-icon" />
            <select 
              className="filter-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select 
              className="filter-select"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>

            <select 
              className="filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="content-type-tabs"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s'
          }}
        >
          {contentTabs.map(tab => (
            <button
              key={tab.value}
              className={selectedContentTab === tab.value ? 'active' : ''}
              onClick={() => setSelectedContentTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div 
          className="content-grid"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s'
          }}
        >
          {paginatedContent.map((item, index) => (
            <div 
              key={item.id} 
              className={`content-card ${item.type === 'song' ? 'song-card' : ''} ${item.type === 'news-clip' ? 'news-card' : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="content-thumbnail">
                <img src={item.thumbnail} alt={item.title} />
                <div className="content-type-badge">
                  {getTypeIcon(item.type)}
                </div>
                {item.type === 'song' && (
                  <div className="song-overlay-icon">
                    <Music />
                  </div>
                )}
                {item.type === 'news-clip' && item.isLive && (
                  <div className="live-badge">
                    LIVE
                  </div>
                )}
                {item.episodes && (
                  <div className="content-episodes">
                    {item.episodes} EP
                  </div>
                )}
              </div>

              <div className="content-info">
                <h3 className="content-title">{item.title}</h3>
                <div className="content-meta">
                  <span className="content-genre">{item.type === 'song' ? item.artist : item.genre}</span>
                  <span className="content-divider">•</span>
                  <span className="content-updated">{item.duration || item.updated}</span>
                </div>
                <div className="content-kind">
                  {getTypeLabel(item.type)}
                </div>
                <div className="content-status">
                  {getStatusBadge(item.status)}
                </div>
                {expandedItemId === item.id && (
                  <div className="expanded-detail">
                    <span>manager: {item.manager_id}</span>
                    <span>Updated: {item.updated}</span>
                    {item.type === 'series' && (
                      <strong className="episode-pricing">Episode Pricing: ₹5/ep</strong>
                    )}
                    <button onClick={() => onNavigate('content-detail')}>
                      Open full details <ChevronRight />
                    </button>
                  </div>
                )}
              </div>

              <div className="content-actions">
                <button 
                  className="action-btn"
                  onClick={() => setExpandedItemId(expandedItemId === item.id ? null : item.id)}
                  title="View"
                >
                  <Eye />
                </button>
                <button className="action-btn" title="Edit">
                  <Edit2 />
                </button>
                {(userRole === 'admin' || item.manager_id === userId) && (
                  <button className="action-btn danger" title="Delete">
                    <Trash2 />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .content-library-section {
          min-height: 100vh;
          padding: 28px 0 56px;
          background: var(--bg-primary);
        }

        .content-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .content-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 26px;
          padding: 26px 30px;
          border-radius: 28px;
          border: 1px solid var(--border);
          background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(19, 23, 30, 0.84);
          backdrop-filter: blur(26px);
          box-shadow: var(--shadow-soft);
        }

        .content-header h1 {
          font-size: 36px;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .content-header p {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .content-header .btn {
          gap: 8px;
        }

        .filters-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 30px;
          flex-wrap: wrap;
          padding: 18px;
          border-radius: 24px;
          border: 1px solid var(--border);
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(19, 23, 30, 0.82);
          backdrop-filter: blur(24px);
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 280px;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: var(--text-secondary);
        }

        .search-box .input {
          padding-left: 44px;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .filter-icon {
          width: 18px;
          height: 18px;
          color: var(--text-secondary);
        }

        .filter-select {
          padding: 10px 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text-primary);
          font-size: 14px;
          cursor: pointer;
          outline: none;
          transition: all 0.2s ease;
        }

        .filter-select:focus {
          border-color: var(--accent);
        }

        .filter-select option {
          background: var(--bg-secondary);
        }

        .content-type-tabs {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          padding: 10px;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(19, 23, 30, 0.82);
          backdrop-filter: blur(24px);
          overflow-x: auto;
        }

        .content-type-tabs button {
          min-height: 38px;
          padding: 8px 13px;
          border: 1px solid transparent;
          border-radius: 10px;
          background: transparent;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .content-type-tabs button:hover,
        .content-type-tabs button.active {
          color: var(--text-primary);
          background: rgba(128, 0, 32, 0.16);
          border-color: rgba(128, 0, 32, 0.3);
        }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .content-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(19, 23, 30, 0.84);
          border: 1px solid var(--border);
          border-radius: 26px;
          overflow: hidden;
          transition: all 0.3s ease;
          backdrop-filter: blur(26px);
          box-shadow: var(--shadow-soft);
        }

        .content-card:hover {
          border-color: var(--accent);
          transform: translateY(-8px);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
        }

        .content-thumbnail {
          position: relative;
          aspect-ratio: 2/3;
          overflow: hidden;
        }

        .song-card .content-thumbnail,
        .news-card .content-thumbnail {
          aspect-ratio: 1/1;
        }

        .content-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .content-card:hover .content-thumbnail img {
          transform: scale(1.05);
        }

        .content-type-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 36px;
          height: 36px;
          background: rgba(22, 7, 9, 0.74);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
        }

        .type-icon {
          width: 16px;
          height: 16px;
        }

        .content-episodes {
          position: absolute;
          bottom: 12px;
          right: 12px;
          padding: 4px 10px;
          background: rgba(22, 7, 9, 0.74);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-primary);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(14px);
        }

        .song-overlay-icon {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.82);
          background: linear-gradient(180deg, transparent, rgba(22, 7, 9, 0.44));
          pointer-events: none;
        }

        .song-overlay-icon svg {
          width: 42px;
          height: 42px;
          filter: drop-shadow(0 8px 18px rgba(0,0,0,0.35));
        }

        .live-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 5px 9px;
          border-radius: 999px;
          color: #ffffff;
          background: rgba(239, 68, 68, 0.92);
          border: 1px solid rgba(255,255,255,0.16);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          animation: livePulse 1.4s ease infinite;
        }

        .content-info {
          padding: 18px 18px 16px;
        }

        .content-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .content-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .content-kind {
          display: inline-flex;
          width: fit-content;
          margin-bottom: 12px;
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid rgba(128, 0, 32, 0.24);
          background: rgba(128, 0, 32, 0.12);
          color: var(--text-primary);
          font-size: 11px;
          font-weight: 700;
        }

        .content-divider {
          opacity: 0.5;
        }

        .content-status .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .content-status .badge svg {
          width: 12px;
          height: 12px;
        }

        .expanded-detail {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 14px;
          padding: 12px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: var(--text-secondary);
          font-size: 12px;
        }

        .episode-pricing {
          width: fit-content;
          padding: 5px 9px;
          border-radius: 999px;
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.24);
        }

        .expanded-detail button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          width: fit-content;
          padding: 7px 9px;
          border: 1px solid rgba(128, 0, 32, 0.24);
          border-radius: 8px;
          background: rgba(128, 0, 32, 0.14);
          color: var(--text-primary);
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
        }

        .expanded-detail button svg {
          width: 14px;
          height: 14px;
        }

        .content-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 18px 18px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .action-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: rgba(247, 237, 239, 0.05);
          color: var(--text-primary);
        }

        .action-btn.danger:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }

        .action-btn svg {
          width: 16px;
          height: 16px;
        }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 32px;
        }

        .pagination-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: 14px;
          color: var(--text-primary);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          border-color: var(--accent);
          color: var(--accent);
        }

        .pagination-btn.active {
          background: linear-gradient(135deg, var(--accent-hover), var(--accent));
          border-color: var(--accent);
          color: white;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-btn svg {
          width: 18px;
          height: 18px;
        }

        @keyframes livePulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.42);
          }
          50% {
            box-shadow: 0 0 0 9px rgba(239, 68, 68, 0);
          }
        }

        @media (max-width: 1200px) {
          .content-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 900px) {
          .content-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .content-grid {
            grid-template-columns: 1fr;
          }

          .content-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            padding: 22px;
          }

          .filters-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-group {
            flex-wrap: wrap;
          }

          .filter-select {
            flex: 1;
          }
        }
      `}</style>
    </section>
  );
}
