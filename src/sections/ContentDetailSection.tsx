import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Edit2, 
  Play, 
  Save, 
  X,
  Calendar,
  Globe,
  Star,
  Film,
  Users,
  Tag
} from 'lucide-react';
import type { Section } from '../App';

interface ContentDetailSectionProps {
  onNavigate: (section: Section) => void;
}

export function ContentDetailSection({ onNavigate }: ContentDetailSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState({
    title: 'The Midnight Archive',
    type: 'movie',
    year: '2024',
    duration: '2h 14m',
    genre: 'Thriller',
    rating: '8.4',
    language: 'English',
    description: 'A curator discovers a hidden signal buried in forgotten broadcasts—one that changes the past. As she delves deeper into the archives, she uncovers a conspiracy that spans decades and threatens to rewrite history itself.',
    director: 'Sarah Chen',
    cast: 'Emma Watson, Michael B. Jordan, Tilda Swinton',
    status: 'published',
    releaseDate: '2024-03-15',
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    // Save logic would go here
  };

  return (
    <section className="content-detail-section">
      {/* Background */}
      <div 
        className="detail-bg"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(1.06)',
          transition: 'opacity 0.9s ease, transform 0.9s ease'
        }}
      />
      <div className="detail-overlay" />

      {/* Content */}
      <div className="detail-content">
        {/* Back Button */}
        <button 
          className="back-btn"
          onClick={() => onNavigate('content')}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease'
          }}
        >
          <ArrowLeft /> Back to Library
        </button>

        {/* Main Card */}
        <div 
          className="detail-card"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s'
          }}
        >
          {/* Preview Section */}
          <div className="preview-section">
            <div className="preview-thumbnail">
              <img 
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=450&fit=crop" 
                alt={content.title}
              />
              <div className="preview-play-overlay">
                <button className="play-btn">
                  <Play />
                </button>
              </div>
              <div className="preview-label">Now Previewing</div>
            </div>

            <div className="preview-info">
              <div className="preview-header">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      className="title-input"
                      value={content.title}
                      onChange={(e) => setContent({...content, title: e.target.value})}
                    />
                  ) : (
                    <h1>{content.title}</h1>
                  )}
                  <div className="preview-meta">
                    <span>{content.year}</span>
                    <span>•</span>
                    <span>{content.genre}</span>
                    <span>•</span>
                    <span>{content.duration}</span>
                  </div>
                </div>
                <div className="preview-actions">
                  {isEditing ? (
                    <>
                      <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                        <X /> Cancel
                      </button>
                      <button className="btn btn-primary" onClick={handleSave}>
                        <Save /> Save
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                        <Edit2 /> Edit Metadata
                      </button>
                      <button className="btn btn-primary">
                        Publish
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="preview-rating">
                <Star className="star-icon" />
                <span className="rating-value">{content.rating}</span>
                <span className="rating-count">/10</span>
              </div>

              {isEditing ? (
                <textarea
                  className="description-input"
                  value={content.description}
                  onChange={(e) => setContent({...content, description: e.target.value})}
                  rows={4}
                />
              ) : (
                <p className="preview-description">{content.description}</p>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-icon">
                <Film />
              </div>
              <div className="detail-content">
                <span className="detail-label">Type</span>
                <span className="detail-value capitalize">{content.type}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Calendar />
              </div>
              <div className="detail-content">
                <span className="detail-label">Release Date</span>
                <span className="detail-value">{content.releaseDate}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Globe />
              </div>
              <div className="detail-content">
                <span className="detail-label">Language</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="detail-input"
                    value={content.language}
                    onChange={(e) => setContent({...content, language: e.target.value})}
                  />
                ) : (
                  <span className="detail-value">{content.language}</span>
                )}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Users />
              </div>
              <div className="detail-content">
                <span className="detail-label">Director</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="detail-input"
                    value={content.director}
                    onChange={(e) => setContent({...content, director: e.target.value})}
                  />
                ) : (
                  <span className="detail-value">{content.director}</span>
                )}
              </div>
            </div>

            <div className="detail-item full-width">
              <div className="detail-icon">
                <Tag />
              </div>
              <div className="detail-content">
                <span className="detail-label">Cast</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="detail-input"
                    value={content.cast}
                    onChange={(e) => setContent({...content, cast: e.target.value})}
                  />
                ) : (
                  <span className="detail-value">{content.cast}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .content-detail-section {
          position: relative;
          min-height: 100vh;
          padding: 28px 0 56px;
        }

        .detail-bg {
          position: fixed;
          inset: 0;
          background-image: url('/content_preview_bg.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .detail-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(22, 7, 9, 0.88) 0%,
            rgba(22, 7, 9, 0.94) 50%,
            rgba(22, 7, 9, 0.98) 100%
          );
        }

        .detail-content {
          position: relative;
          z-index: 10;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          padding: 12px 18px;
          background: rgba(255,255,255,0.06);
          border: 1px solid var(--border);
          border-radius: 16px;
          color: var(--text-secondary);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(18px);
        }

        .back-btn:hover {
          border-color: var(--accent);
          color: var(--text-primary);
        }

        .back-btn svg {
          width: 18px;
          height: 18px;
        }

        .detail-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), rgba(50, 18, 23, 0.6);
          border: 1px solid var(--border);
          border-radius: 30px;
          overflow: hidden;
          backdrop-filter: blur(28px);
          box-shadow: var(--shadow-soft);
        }

        .preview-section {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 0;
        }

        .preview-thumbnail {
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
        }

        .preview-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-play-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(7,2,3,0.18), rgba(7,2,3,0.5));
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .preview-thumbnail:hover .preview-play-overlay {
          opacity: 1;
        }

        .play-btn {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--accent-hover), var(--accent));
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .play-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 10px 30px rgba(128, 0, 32, 0.4);
        }

        .play-btn svg {
          width: 32px;
          height: 32px;
          margin-left: 4px;
        }

        .preview-label {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 6px 12px;
          background: rgba(22, 7, 9, 0.7);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: white;
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
        }

        .preview-info {
          padding: 34px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .preview-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .preview-header h1 {
          font-size: 28px;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .title-input {
          font-size: 28px;
          font-weight: 700;
          font-family: 'Sora', sans-serif;
          color: var(--text-primary);
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 8px 12px;
          width: 100%;
          outline: none;
        }

        .title-input:focus {
          border-color: var(--accent);
        }

        .preview-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .preview-actions {
          display: flex;
          gap: 12px;
        }

        .preview-actions .btn {
          gap: 8px;
        }

        .preview-rating {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .star-icon {
          width: 24px;
          height: 24px;
          color: #f59e0b;
          fill: #f59e0b;
        }

        .rating-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .rating-count {
          font-size: 16px;
          color: var(--text-secondary);
        }

        .preview-description {
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-secondary);
        }

        .description-input {
          width: 100%;
          padding: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: 16px;
          color: var(--text-primary);
          font-size: 15px;
          line-height: 1.7;
          resize: vertical;
          outline: none;
        }

        .description-input:focus {
          border-color: var(--accent);
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: var(--border);
          border-top: 1px solid var(--border);
        }

        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 24px;
          background: rgba(255,255,255,0.03);
        }

        .detail-item.full-width {
          grid-column: span 2;
        }

        .detail-icon {
          width: 48px;
          height: 48px;
          background: rgba(128, 0, 32, 0.12);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .detail-icon svg {
          width: 20px;
          height: 20px;
        }

        .detail-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .detail-label {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .detail-value {
          font-size: 15px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .detail-value.capitalize {
          text-transform: capitalize;
        }

        .detail-input {
          padding: 8px 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: 14px;
          color: var(--text-primary);
          font-size: 15px;
          outline: none;
        }

        .detail-input:focus {
          border-color: var(--accent);
        }

        @media (max-width: 900px) {
          .preview-section {
            grid-template-columns: 1fr;
          }

          .preview-thumbnail {
            aspect-ratio: 16/9;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .detail-item.full-width {
            grid-column: span 1;
          }

          .preview-header {
            flex-direction: column;
          }

          .preview-actions {
            width: 100%;
          }

          .preview-actions .btn {
            flex: 1;
          }
        }
      `}</style>
    </section>
  );
}
