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
  Tv,
  CheckCircle,
  Clock
} from 'lucide-react';
import type { Section } from '../App';

interface ContentLibrarySectionProps {
  onNavigate: (section: Section) => void;
}

interface ContentItem {
  id: number;
  title: string;
  type: 'movie' | 'series';
  genre: string;
  status: 'published' | 'draft' | 'processing';
  updated: string;
  thumbnail: string;
  episodes?: number;
}

const mockContent: ContentItem[] = [
  { id: 1, title: 'The Midnight Archive', type: 'movie', genre: 'Thriller', status: 'published', updated: '2 hours ago', thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=300&fit=crop' },
  { id: 2, title: 'Cyber Chronicles', type: 'series', genre: 'Sci-Fi', status: 'published', updated: '5 hours ago', episodes: 12, thumbnail: 'https://images.unsplash.com/photo-1515630278258-407f66498911?w=200&h=300&fit=crop' },
  { id: 3, title: 'Echoes of Tomorrow', type: 'movie', genre: 'Drama', status: 'draft', updated: '1 day ago', thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=300&fit=crop' },
  { id: 4, title: 'Neon Dreams', type: 'series', genre: 'Crime', status: 'processing', updated: '2 days ago', episodes: 8, thumbnail: 'https://images.unsplash.com/photo-1594909122849-11daa2a0cf2b?w=200&h=300&fit=crop' },
  { id: 5, title: 'The Last Horizon', type: 'movie', genre: 'Adventure', status: 'published', updated: '3 days ago', thumbnail: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&h=300&fit=crop' },
  { id: 6, title: 'Shadow Protocol', type: 'series', genre: 'Action', status: 'draft', updated: '4 days ago', episodes: 10, thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=200&h=300&fit=crop' },
  { id: 7, title: 'Silent Waters', type: 'movie', genre: 'Mystery', status: 'published', updated: '5 days ago', thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&h=300&fit=crop' },
  { id: 8, title: 'Urban Legends', type: 'series', genre: 'Horror', status: 'processing', updated: '1 week ago', episodes: 6, thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=200&h=300&fit=crop' },
];

const genres = ['All', 'Action', 'Adventure', 'Crime', 'Drama', 'Horror', 'Mystery', 'Sci-Fi', 'Thriller'];
const types = ['All', 'Movie', 'Series'];
const statuses = ['All', 'Published', 'Draft', 'Processing'];

export function ContentLibrarySection({ onNavigate }: ContentLibrarySectionProps) {
  const [content] = useState<ContentItem[]>(mockContent);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>(mockContent);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = content;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre !== 'All') {
      filtered = filtered.filter(item => item.genre === selectedGenre);
    }

    if (selectedType !== 'All') {
      filtered = filtered.filter(item => 
        item.type === selectedType.toLowerCase()
      );
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter(item => 
        item.status === selectedStatus.toLowerCase()
      );
    }

    setFilteredContent(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, selectedType, selectedStatus, content]);

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
    return type === 'movie' ? <Film className="type-icon" /> : <Tv className="type-icon" />;
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
            <h1>Content Library</h1>
            <p>Search, filter, and update metadata in bulk.</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => onNavigate('add-title-type')}
          >
            <Plus /> Add Title
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
              className="content-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="content-thumbnail">
                <img src={item.thumbnail} alt={item.title} />
                <div className="content-type-badge">
                  {getTypeIcon(item.type)}
                </div>
                {item.episodes && (
                  <div className="content-episodes">
                    {item.episodes} EP
                  </div>
                )}
              </div>

              <div className="content-info">
                <h3 className="content-title">{item.title}</h3>
                <div className="content-meta">
                  <span className="content-genre">{item.genre}</span>
                  <span className="content-divider">•</span>
                  <span className="content-updated">{item.updated}</span>
                </div>
                <div className="content-status">
                  {getStatusBadge(item.status)}
                </div>
              </div>

              <div className="content-actions">
                <button 
                  className="action-btn"
                  onClick={() => onNavigate('content-detail')}
                  title="View"
                >
                  <Eye />
                </button>
                <button className="action-btn" title="Edit">
                  <Edit2 />
                </button>
                <button className="action-btn danger" title="Delete">
                  <Trash2 />
                </button>
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
