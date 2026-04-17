import { useEffect, useState } from 'react';
import { ArrowLeft, Film, Music, Radio, Tv } from 'lucide-react';
import { UserRole } from '../constants/sections';

const titleTypes = [
  { id: 'film', name: 'Film', icon: Film, description: 'Feature films, documentaries, and movies', color: '#ef4444' },
  { id: 'series', name: 'TV Series', icon: Tv, description: 'Television series and episodic content', color: '#3b82f6' },
  { id: 'music', name: 'Music Video', icon: Music, description: 'Music videos, concerts, and performances', color: '#22c55e' },
  { id: 'podcast', name: 'Podcast', icon: Radio, description: 'Audio podcasts and radio shows', color: '#f59e0b' }
];

export function AddTitleTypeSection({ onNavigate, onSelectType }) {
  const [selectedType, setSelectedType] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    if (onSelectType) {
      onSelectType(typeId);
    }
    // Navigate to the appropriate add form
    setTimeout(() => {
      onNavigate('add-title');
    }, 300);
  };

  const handleBack = () => {
    onNavigate('content');
  };

  return (
    <div className={`add-title-type-section ${isVisible ? 'visible' : ''}`}>
      <div className="add-title-type-container">
        {/* Header */}
        <div className="section-header">
          <button className="btn btn-secondary" onClick={handleBack}>
            <ArrowLeft size={16} />
            Back to Content
          </button>
          <div>
            <h1>Choose Content Type</h1>
            <p>Select the type of content you want to add to your library.</p>
          </div>
        </div>

        {/* Type Selection Grid */}
        <div className="type-selection-grid">
          {titleTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                className={`type-card ${selectedType === type.id ? 'selected' : ''}`}
                onClick={() => handleTypeSelect(type.id)}
                style={{ borderColor: type.color }}
              >
                <div className="type-icon" style={{ backgroundColor: type.color }}>
                  <Icon size={32} />
                </div>
                <h3>{type.name}</h3>
                <p>{type.description}</p>
                <div className="type-arrow">
                  <ArrowLeft size={20} style={{ transform: 'rotate(-135deg)' }} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Additional Options */}
        <div className="additional-options">
          <div className="options-header">
            <h2>Need Help?</h2>
            <p>Learn more about our content types and requirements.</p>
          </div>
          
          <div className="options-grid">
            <div className="option-card">
              <div className="option-icon">
                <Film size={24} />
              </div>
              <h3>Content Guidelines</h3>
              <p>Review our content requirements and quality standards.</p>
              <button className="btn btn-secondary">View Guidelines</button>
            </div>

            <div className="option-card">
              <div className="option-icon">
                <Music size={24} />
              </div>
              <h3>Upload Requirements</h3>
              <p>Technical specifications for video and audio files.</p>
              <button className="btn btn-secondary">View Requirements</button>
            </div>

            <div className="option-card">
              <div className="option-icon">
                <Tv size={24} />
              </div>
              <h3>Best Practices</h3>
              <p>Tips for creating engaging and high-quality content.</p>
              <button className="btn btn-secondary">Learn More</button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-number">4</span>
            <span className="stat-label">Content Types</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1,248</span>
            <span className="stat-label">Total Titles</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">42.3K</span>
            <span className="stat-label">Active Users</span>
          </div>
        </div>
      </div>

      <style>{`
        .add-title-type-section {
          min-height: 100vh;
          padding: 28px 0 56px;
          background: var(--bg-primary);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .add-title-type-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .add-title-type-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 40px;
          padding: 26px 30px;
          border-radius: 28px;
          border: 1px solid var(--border);
          background: var(--panel-glass-hero);
          backdrop-filter: blur(26px);
          box-shadow: var(--shadow-soft);
        }

        .section-header h1 {
          font-size: 36px;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .section-header p {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .type-selection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }

        .type-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 40px 32px;
          border: 2px solid var(--border);
          border-radius: 24px;
          background: var(--panel-glass);
          backdrop-filter: blur(24px);
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .type-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
        }

        .type-card.selected {
          background: var(--panel-glass-active);
          transform: translateY(-8px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
        }

        .type-icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          color: white;
          transition: all 0.3s ease;
        }

        .type-card:hover .type-icon {
          transform: scale(1.1);
        }

        .type-card h3 {
          color: var(--text-primary);
          font-size: 24px;
          margin: 0;
          font-weight: 600;
        }

        .type-card p {
          color: var(--text-secondary);
          font-size: 16px;
          line-height: 1.5;
          margin: 0;
        }

        .type-arrow {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .type-card:hover .type-arrow,
        .type-card.selected .type-arrow {
          opacity: 1;
        }

        .additional-options {
          margin-bottom: 48px;
        }

        .options-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .options-header h2 {
          color: var(--text-primary);
          font-size: 28px;
          margin-bottom: 8px;
        }

        .options-header p {
          color: var(--text-secondary);
          font-size: 16px;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .option-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 32px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: var(--panel-glass);
          backdrop-filter: blur(24px);
          text-align: center;
          transition: all 0.3s ease;
        }

        .option-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .option-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: rgba(128, 0, 32, 0.1);
          color: var(--accent);
        }

        .option-card h3 {
          color: var(--text-primary);
          font-size: 18px;
          margin: 0;
        }

        .option-card p {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }

        .quick-stats {
          display: flex;
          justify-content: center;
          gap: 48px;
          padding: 32px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: var(--panel-glass);
          backdrop-filter: blur(24px);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .stat-number {
          font-size: 32px;
          font-weight: 700;
          color: var(--accent);
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 500;
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

        .btn-primary {
          background: var(--accent);
          color: white;
        }

        .btn-primary:hover {
          background: var(--accent-hover);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          border: 1px solid var(--border);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
            text-align: center;
          }

          .type-selection-grid {
            grid-template-columns: 1fr;
          }

          .options-grid {
            grid-template-columns: 1fr;
          }

          .quick-stats {
            flex-direction: column;
            gap: 24px;
          }

          .stat-item {
            flex-direction: row;
            gap: 16px;
          }

          .type-card {
            padding: 32px 24px;
          }

          .type-card h3 {
            font-size: 20px;
          }

          .type-card p {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
