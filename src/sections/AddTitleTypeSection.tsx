import { useEffect, useState } from 'react';
import { ArrowLeft, Film, Music, Radio, Tv } from 'lucide-react';
import type { Section } from '../App';

type TitleType = 'movie' | 'series' | 'song' | 'news-clip';

interface AddTitleTypeSectionProps {
  onNavigate: (section: Section) => void;
  onSelectType: (type: TitleType) => void;
}

export function AddTitleTypeSection({ onNavigate, onSelectType }: AddTitleTypeSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (type: TitleType) => {
    onSelectType(type);

    if (type === 'song') {
      onNavigate('songs');
      return;
    }

    if (type === 'news-clip') {
      onNavigate('news');
      return;
    }

    onNavigate('add-title');
  };

  return (
    <section className="add-title-type-section">
      <div
        className="type-bg"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(1.06)',
          transition: 'opacity 0.9s ease, transform 0.9s ease'
        }}
      />
      <div className="type-overlay" />

      <div className="type-content">
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

        <div
          className="type-card"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s'
          }}
        >
          <div className="type-header">
            <h1>Choose title type</h1>
            <p>Pick the format before uploading.</p>
          </div>

          <div className="type-options">
            <button className="type-option" onClick={() => handleSelect('movie')}>
              <div className="type-icon">
                <Film />
              </div>
              <div className="type-copy">
                <h3>Movie</h3>
                <p>Single upload with metadata.</p>
              </div>
            </button>

            <button className="type-option" onClick={() => handleSelect('series')}>
              <div className="type-icon">
                <Tv />
              </div>
              <div className="type-copy">
                <h3>Series</h3>
                <p>Multiple episode uploads with names and descriptions.</p>
              </div>
            </button>

            <button className="type-option" onClick={() => handleSelect('song')}>
              <div className="type-icon">
                <Music />
              </div>
              <div className="type-copy">
                <h3>Song</h3>
                <p>Audio track or music video with lyrics sync and cultural metadata.</p>
              </div>
            </button>

            <button className="type-option" onClick={() => handleSelect('news-clip')}>
              <div className="type-icon">
                <Radio />
              </div>
              <div className="type-copy">
                <h3>News Clip</h3>
                <p>Short VOD clip from live news (2-10 min recording).</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .add-title-type-section {
          position: relative;
          min-height: 100vh;
          padding: 24px 0 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .type-bg {
          position: fixed;
          inset: 0;
          background-image: url('/upload_bg.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .type-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(22, 7, 9, 0.88) 0%,
            rgba(22, 7, 9, 0.94) 50%,
            rgba(22, 7, 9, 0.98) 100%
          );
        }

        .type-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 900px;
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

        .type-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), rgba(50, 18, 23, 0.58);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 40px;
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-soft);
        }

        .type-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .type-header h1 {
          font-size: 28px;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .type-header p {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .type-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .type-option {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.05);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .type-option:hover {
          border-color: var(--accent);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
          transform: translateY(-2px);
        }

        .type-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(128, 0, 32, 0.14);
          border-radius: 16px;
          color: var(--accent);
          flex-shrink: 0;
        }

        .type-icon svg {
          width: 24px;
          height: 24px;
        }

        .type-copy h3 {
          font-size: 18px;
          margin-bottom: 4px;
        }

        .type-copy p {
          font-size: 13px;
          color: var(--text-secondary);
        }

        @media (max-width: 760px) {
          .type-options {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
