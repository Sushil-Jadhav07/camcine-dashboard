import { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  Settings,
  Share2,
  Heart,
  Bookmark,
  Download,
  Star,
  Calendar,
  Clock,
  Eye,
  Film,
  Music,
  Tv,
  Tag
} from 'lucide-react';
import { UserRole } from '../constants/sections';

const mockContent = {
  id: 1,
  title: 'The Midnight Archive',
  type: 'film',
  genre: 'Thriller',
  duration: '2:45:00',
  rating: 4.8,
  views: 125000,
  likes: 8900,
  description: 'A gripping thriller that keeps you on the edge of your seat from start to finish. When a mysterious archive of midnight recordings is discovered, a team of investigators must unravel the dark secrets hidden within.',
  thumbnail: 'https://via.placeholder.com/800x450',
  videoUrl: 'https://example.com/video.mp4',
  releaseDate: '2024-03-15',
  director: 'Sarah Chen',
  cast: ['Alex Johnson', 'Emma Wilson', 'Michael Brown', 'Lisa Davis'],
  tags: ['thriller', 'mystery', 'suspense', 'dark'],
  relatedContent: [
    { id: 2, title: 'Cyber Chronicles S2', type: 'series', thumbnail: 'https://via.placeholder.com/300x200' },
    { id: 3, title: 'Urban Legends Documentary', type: 'film', thumbnail: 'https://via.placeholder.com/300x200' },
    { id: 4, title: 'Comedy Special: Live Tonight', type: 'special', thumbnail: 'https://via.placeholder.com/300x200' },
  ]
};

export function ContentDetailSection({ contentId, onNavigate }) {
  const [content, setContent] = useState(mockContent);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('02:45:00');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: content.title,
        text: content.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownload = () => {
    // Simulate download
    const link = document.createElement('a');
    link.href = content.videoUrl;
    link.download = `${content.title}.mp4`;
    link.click();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'film': return <Film size={16} />;
      case 'series': return <Tv size={16} />;
      case 'music': return <Music size={16} />;
      case 'special': return <Star size={16} />;
      default: return <Film size={16} />;
    }
  };

  return (
    <div className={`content-detail-section ${isVisible ? 'visible' : ''}`}>
      <div className="content-detail-container">
        {/* Video Player */}
        <div className="video-player">
          <div className="video-container">
            <img src={content.thumbnail} alt={content.title} className="video-thumbnail" />
            
            <div className="video-overlay">
              <button className="play-button-large" onClick={handlePlayPause}>
                {isPlaying ? <Pause size={48} /> : <Play size={48} />}
              </button>
            </div>

            {/* Video Controls */}
            <div className="video-controls">
              <div className="controls-left">
                <button className="control-btn" onClick={handlePlayPause}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                
                <div className="time-display">
                  <span>{currentTime}</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '35%' }} />
                  </div>
                  <span>{duration}</span>
                </div>
              </div>

              <div className="controls-right">
                <div className="volume-control">
                  <Volume2 size={20} />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="volume-slider"
                  />
                </div>

                <button className="control-btn" onClick={() => setShowSettings(!showSettings)}>
                  <Settings size={20} />
                </button>
                
                <button className="control-btn">
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Info */}
        <div className="content-info">
          <div className="info-header">
            <div className="title-section">
              <h1>{content.title}</h1>
              <div className="content-meta">
                <div className="meta-item">
                  {getTypeIcon(content.type)}
                  <span>{content.type}</span>
                </div>
                <div className="meta-item">
                  <Tag size={16} />
                  <span>{content.genre}</span>
                </div>
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{content.duration}</span>
                </div>
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>{content.releaseDate}</span>
                </div>
              </div>
            </div>

            <div className="stats-section">
              <div className="stat-item">
                <Star size={16} />
                <span>{content.rating}</span>
              </div>
              <div className="stat-item">
                <Eye size={16} />
                <span>{content.views.toLocaleString()} views</span>
              </div>
              <div className="stat-item">
                <Heart size={16} />
                <span>{content.likes.toLocaleString()} likes</span>
              </div>
            </div>
          </div>

          <p className="content-description">{content.description}</p>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className={`btn btn-secondary ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              {isLiked ? 'Liked' : 'Like'}
            </button>
            
            <button 
              className={`btn btn-secondary ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={handleBookmark}
            >
              <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
              {isBookmarked ? 'Saved' : 'Save'}
            </button>
            
            <button className="btn btn-secondary" onClick={handleShare}>
              <Share2 size={16} />
              Share
            </button>
            
            <button className="btn btn-secondary" onClick={handleDownload}>
              <Download size={16} />
              Download
            </button>
          </div>

          {/* Cast & Crew */}
          <div className="cast-section">
            <h3>Cast & Crew</h3>
            <div className="cast-info">
              <div className="cast-item">
                <span className="role">Director:</span>
                <span className="name">{content.director}</span>
              </div>
              <div className="cast-item">
                <span className="role">Cast:</span>
                <span className="name">{content.cast.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="tags-section">
            <h3>Tags</h3>
            <div className="tags-list">
              {content.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Related Content */}
        <div className="related-content">
          <h3>Related Content</h3>
          <div className="related-grid">
            {content.relatedContent.map((item) => (
              <div key={item.id} className="related-card">
                <div className="related-thumbnail">
                  <img src={item.thumbnail} alt={item.title} />
                </div>
                <div className="related-info">
                  <h4>{item.title}</h4>
                  <span className="related-type">{item.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="settings-panel">
            <div className="panel-header">
              <h3>Video Settings</h3>
              <button className="btn-icon" onClick={() => setShowSettings(false)}>
                ×
              </button>
            </div>
            <div className="panel-content">
              <div className="setting-item">
                <label>Playback Speed</label>
                <select className="setting-select" defaultValue="1">
                  <option value="0.5">0.5x</option>
                  <option value="0.75">0.75x</option>
                  <option value="1">1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Quality</label>
                <select className="setting-select">
                  <option value="auto">Auto</option>
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                  <option value="360p">360p</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Subtitles</label>
                <select className="setting-select">
                  <option value="off">Off</option>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .content-detail-section {
          min-height: 100vh;
          padding: 28px 0 56px;
          background: var(--bg-primary);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .content-detail-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .content-detail-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .video-player {
          margin-bottom: 32px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow-soft);
        }

        .video-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          background: #000;
        }

        .video-thumbnail {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.3);
          transition: opacity 0.3s ease;
        }

        .video-overlay:hover {
          background: rgba(0, 0, 0, 0.5);
        }

        .play-button-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(128, 0, 32, 0.9);
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .play-button-large:hover {
          background: var(--accent);
          transform: scale(1.1);
        }

        .video-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .controls-left,
        .controls-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .control-btn {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: background 0.2s ease;
        }

        .control-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .time-display {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          font-size: 14px;
        }

        .progress-bar {
          width: 200px;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--accent);
          border-radius: 2px;
        }

        .volume-control {
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
        }

        .volume-slider {
          width: 80px;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }

        .content-info {
          background: var(--panel-glass);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 32px;
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-soft);
          margin-bottom: 32px;
        }

        .info-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .title-section h1 {
          color: var(--text-primary);
          font-size: 32px;
          margin-bottom: 16px;
        }

        .content-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .stats-section {
          display: flex;
          gap: 24px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .stat-item:first-child {
          color: #f59e0b;
        }

        .content-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 24px;
          font-size: 16px;
        }

        .action-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          border: 1px solid var(--border);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .btn-secondary.liked,
        .btn-secondary.bookmarked {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }

        .cast-section,
        .tags-section {
          margin-bottom: 24px;
        }

        .cast-section h3,
        .tags-section h3 {
          color: var(--text-primary);
          font-size: 18px;
          margin-bottom: 12px;
        }

        .cast-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cast-item {
          display: flex;
          gap: 12px;
        }

        .cast-item .role {
          color: var(--text-secondary);
          font-weight: 500;
          min-width: 80px;
        }

        .cast-item .name {
          color: var(--text-primary);
        }

        .tags-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .tag {
          padding: 6px 12px;
          background: rgba(128, 0, 32, 0.1);
          color: var(--accent);
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .related-content {
          background: var(--panel-glass);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 32px;
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-soft);
        }

        .related-content h3 {
          color: var(--text-primary);
          font-size: 20px;
          margin-bottom: 20px;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .related-card {
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .related-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .related-thumbnail {
          width: 100%;
          height: 140px;
          overflow: hidden;
        }

        .related-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .related-info {
          padding: 12px;
        }

        .related-info h4 {
          color: var(--text-primary);
          font-size: 14px;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .related-type {
          color: var(--text-secondary);
          font-size: 12px;
        }

        .settings-panel {
          position: fixed;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(19, 23, 30, 0.98);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-soft);
          z-index: 1000;
          min-width: 280px;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .panel-header h3 {
          color: var(--text-primary);
          font-size: 16px;
        }

        .btn-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 16px;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.2s ease;
        }

        .btn-icon:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }

        .panel-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .setting-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .setting-item label {
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 500;
        }

        .setting-select {
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 14px;
          cursor: pointer;
          outline: none;
        }

        .setting-select:focus {
          border-color: var(--accent);
        }

        @media (max-width: 768px) {
          .info-header {
            flex-direction: column;
            gap: 16px;
          }

          .stats-section {
            flex-wrap: wrap;
            gap: 12px;
          }

          .action-buttons {
            justify-content: center;
          }

          .related-grid {
            grid-template-columns: 1fr;
          }

          .settings-panel {
            right: 12px;
            left: 12px;
            top: auto;
            bottom: 20px;
            transform: none;
          }

          .time-display .progress-bar {
            width: 100px;
          }

          .volume-slider {
            width: 60px;
          }
        }
      `}</style>
    </div>
  );
}
