import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Upload,
  Link,
  X,
  Check,
  FileVideo,
  Loader2,
  Plus
} from 'lucide-react';
import type { Section } from '../App';

interface AddTitleSectionProps {
  onNavigate: (section: Section) => void;
  titleType: 'movie' | 'series';
}

type Episode = {
  id: string;
  name: string;
  title: string;
  description: string;
  isDragging: boolean;
  isUploading: boolean;
  uploadProgress: number;
  uploadComplete: boolean;
};

export function AddTitleSection({ onNavigate, titleType }: AddTitleSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [title, setTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [seriesTitle, setSeriesTitle] = useState('');
  const [seriesDescription, setSeriesDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const episodeFileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const episodeIdRef = useRef(1);

  const createEpisode = (): Episode => ({
    id: `ep-${episodeIdRef.current++}`,
    name: '',
    title: '',
    description: '',
    isDragging: false,
    isUploading: false,
    uploadProgress: 0,
    uploadComplete: false
  });

  const [episodes, setEpisodes] = useState<Episode[]>(() => [createEpisode()]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      startUpload();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      startUpload();
    }
  };

  const startUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const startEpisodeUpload = (episodeId: string) => {
    setEpisodes((prev) =>
      prev.map((episode) =>
        episode.id === episodeId
          ? {
              ...episode,
              isUploading: true,
              uploadProgress: 0,
              uploadComplete: false
            }
          : episode
      )
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setEpisodes((prev) =>
        prev.map((episode) =>
          episode.id === episodeId
            ? {
                ...episode,
                uploadProgress: Math.min(progress, 100),
                isUploading: progress < 100,
                uploadComplete: progress >= 100
              }
            : episode
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const updateEpisode = (episodeId: string, updates: Partial<Episode>) => {
    setEpisodes((prev) =>
      prev.map((episode) =>
        episode.id === episodeId ? { ...episode, ...updates } : episode
      )
    );
  };

  const handleEpisodeDragOver = (e: React.DragEvent, episodeId: string) => {
    e.preventDefault();
    updateEpisode(episodeId, { isDragging: true });
  };

  const handleEpisodeDragLeave = (e: React.DragEvent, episodeId: string) => {
    e.preventDefault();
    updateEpisode(episodeId, { isDragging: false });
  };

  const handleEpisodeDrop = (e: React.DragEvent, episodeId: string) => {
    e.preventDefault();
    updateEpisode(episodeId, { isDragging: false });
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      startEpisodeUpload(episodeId);
    }
  };

  const handleEpisodeFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    episodeId: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      startEpisodeUpload(episodeId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('content');
  };

  const isMovie = titleType === 'movie';

  return (
    <section className="add-title-section">
      <div
        className="upload-bg"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(1.06)',
          transition: 'opacity 0.9s ease, transform 0.9s ease'
        }}
      />
      <div className="upload-overlay" />

      <div className="upload-content">
        <button
          className="back-btn"
          onClick={() => onNavigate('add-title-type')}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease'
          }}
        >
          <ArrowLeft /> Back to Type Selection
        </button>

        <div
          className="upload-card"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s'
          }}
        >
          <div className="upload-header">
            <h1>{isMovie ? 'Add a new movie' : 'Add a new series'}</h1>
            <p>
              {isMovie
                ? 'Upload a video file or paste a link.'
                : 'Upload episodes with names, titles, and descriptions.'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {isMovie && (
              <>
                {!uploadComplete && (
                  <div
                    className={`dropzone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />

                    {isUploading ? (
                      <div className="upload-progress">
                        <Loader2 className="spinner" />
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <span className="progress-text">{uploadProgress}% uploaded</span>
                      </div>
                    ) : (
                      <>
                        <div className="dropzone-icon">
                          <Upload />
                        </div>
                        <span className="dropzone-text">Drop video here</span>
                        <span className="dropzone-subtext">or click to browse</span>
                      </>
                    )}

                    <div className="rotating-ring" />
                  </div>
                )}

                {uploadComplete && (
                  <div className="upload-complete">
                    <div className="complete-icon">
                      <Check />
                    </div>
                    <span className="complete-text">Upload complete!</span>
                    <button
                      type="button"
                      className="reset-btn"
                      onClick={() => {
                        setUploadComplete(false);
                        setUploadProgress(0);
                      }}
                    >
                      <X /> Remove file
                    </button>
                  </div>
                )}

                {!isUploading && !uploadComplete && (
                  <div className="link-section">
                    <button
                      type="button"
                      className="link-toggle"
                      onClick={() => setShowLinkInput(!showLinkInput)}
                    >
                      <Link /> Or paste a link
                    </button>

                    {showLinkInput && (
                      <div className="link-input-wrapper">
                        <Link className="link-icon" />
                        <input
                          type="url"
                          className="input"
                          placeholder="https://..."
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}

                {(uploadComplete || linkUrl) && (
                  <div
                    className="metadata-form"
                    style={{
                      animation: 'slideUp 0.4s ease'
                    }}
                  >
                    <div className="form-row">
                      <div className="form-field">
                        <label className="label">Title</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="Enter title..."
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => onNavigate('content')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <FileVideo /> Create Title
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {!isMovie && (
              <div className="series-form">
                <div className="form-row">
                  <div className="form-field">
                    <label className="label">Series Title</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Enter series title..."
                      value={seriesTitle}
                      onChange={(e) => setSeriesTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="label">Series Description</label>
                  <textarea
                    className="input input-textarea"
                    placeholder="Short description of the series..."
                    value={seriesDescription}
                    onChange={(e) => setSeriesDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="episodes-header">
                  <h3>Episodes</h3>
                  <button
                    type="button"
                    className="btn btn-secondary btn-small"
                    onClick={() => setEpisodes((prev) => [...prev, createEpisode()])}
                  >
                    <Plus /> Add Episode
                  </button>
                </div>

                <div className="episodes-list">
                  {episodes.map((episode, index) => (
                    <div
                      key={episode.id}
                      className={`episode-card ${episode.isDragging ? 'dragging' : ''}`}
                    >
                      <div className="episode-top">
                        <span className="episode-badge">Episode {index + 1}</span>
                        {episodes.length > 1 && (
                          <button
                            type="button"
                            className="episode-remove"
                            onClick={() =>
                              setEpisodes((prev) =>
                                prev.filter((item) => item.id !== episode.id)
                              )
                            }
                          >
                            <X /> Remove
                          </button>
                        )}
                      </div>

                      <div className="form-row">
                        <div className="form-field">
                          <label className="label">Episode Name</label>
                          <input
                            type="text"
                            className="input"
                            placeholder="Episode name..."
                            value={episode.name}
                            onChange={(e) =>
                              updateEpisode(episode.id, { name: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="form-field">
                          <label className="label">Episode Title</label>
                          <input
                            type="text"
                            className="input"
                            placeholder="Episode title..."
                            value={episode.title}
                            onChange={(e) =>
                              updateEpisode(episode.id, { title: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="form-field">
                        <label className="label">Description</label>
                        <textarea
                          className="input input-textarea"
                          placeholder="Episode description..."
                          value={episode.description}
                          onChange={(e) =>
                            updateEpisode(episode.id, {
                              description: e.target.value
                            })
                          }
                          rows={3}
                        />
                      </div>

                      {!episode.uploadComplete && (
                        <div
                          className={`episode-dropzone ${episode.isDragging ? 'dragging' : ''}`}
                          onDragOver={(e) => handleEpisodeDragOver(e, episode.id)}
                          onDragLeave={(e) => handleEpisodeDragLeave(e, episode.id)}
                          onDrop={(e) => handleEpisodeDrop(e, episode.id)}
                          onClick={() => episodeFileRefs.current[episode.id]?.click()}
                        >
                          <input
                            ref={(el) => {
                              episodeFileRefs.current[episode.id] = el;
                            }}
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleEpisodeFileSelect(e, episode.id)}
                            style={{ display: 'none' }}
                          />

                          {episode.isUploading ? (
                            <div className="upload-progress">
                              <Loader2 className="spinner" />
                              <div className="progress-bar">
                                <div
                                  className="progress-fill"
                                  style={{ width: `${episode.uploadProgress}%` }}
                                />
                              </div>
                              <span className="progress-text">
                                {episode.uploadProgress}% uploaded
                              </span>
                            </div>
                          ) : (
                            <>
                              <div className="dropzone-icon">
                                <Upload />
                              </div>
                              <span className="dropzone-text">Drop episode file</span>
                              <span className="dropzone-subtext">or click to browse</span>
                            </>
                          )}
                        </div>
                      )}

                      {episode.uploadComplete && (
                        <div className="upload-complete episode-complete">
                          <div className="complete-icon">
                            <Check />
                          </div>
                          <span className="complete-text">Upload complete!</span>
                          <button
                            type="button"
                            className="reset-btn"
                            onClick={() =>
                              updateEpisode(episode.id, {
                                uploadComplete: false,
                                uploadProgress: 0
                              })
                            }
                          >
                            <X /> Remove file
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onNavigate('content')}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <FileVideo /> Create Series
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .add-title-section {
          position: relative;
          min-height: 100vh;
          padding: 24px 0 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-bg {
          position: fixed;
          inset: 0;
          background-image: url('/upload_bg.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .upload-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(22, 7, 9, 0.88) 0%,
            rgba(22, 7, 9, 0.94) 50%,
            rgba(22, 7, 9, 0.98) 100%
          );
        }

        .upload-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 920px;
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

        .upload-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), rgba(50, 18, 23, 0.58);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 40px;
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-soft);
        }

        .upload-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .upload-header h1 {
          font-size: 28px;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .upload-header p {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .dropzone {
          position: relative;
          border: 2px dashed var(--border);
          border-radius: 20px;
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .dropzone:hover,
        .dropzone.dragging {
          border-color: var(--accent);
          background: rgba(128, 0, 32, 0.08);
        }

        .rotating-ring {
          position: absolute;
          inset: -4px;
          border: 2px dashed var(--accent);
          border-radius: 14px;
          opacity: 0;
          animation: rotate-ring 12s linear infinite;
          pointer-events: none;
        }

        .dropzone:hover .rotating-ring,
        .dropzone.dragging .rotating-ring {
          opacity: 0.3;
        }

        @keyframes rotate-ring {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .dropzone-icon {
          width: 64px;
          height: 64px;
          background: rgba(128, 0, 32, 0.12);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }

        .dropzone-icon svg {
          width: 28px;
          height: 28px;
        }

        .dropzone-text {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .dropzone-subtext {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .upload-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 100%;
          max-width: 300px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          color: var(--accent);
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255,255,255,0.05);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--accent);
          border-radius: 3px;
          transition: width 0.2s ease;
        }

        .progress-text {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .upload-complete {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 40px;
        }

        .episode-complete {
          padding: 24px;
          border-radius: 20px;
          background: rgba(34, 197, 94, 0.08);
        }

        .complete-icon {
          width: 64px;
          height: 64px;
          background: var(--success);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .complete-icon svg {
          width: 32px;
          height: 32px;
        }

        .complete-text {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .reset-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .reset-btn:hover {
          border-color: var(--accent);
          color: var(--text-primary);
        }

        .link-section {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .link-toggle {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 14px;
          cursor: pointer;
        }

        .link-toggle:hover {
          color: var(--text-primary);
        }

        .link-input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.05);
          border-radius: 16px;
          border: 1px solid var(--border);
        }

        .link-icon {
          width: 18px;
          height: 18px;
          color: var(--text-secondary);
        }

        .metadata-form {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .series-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-textarea {
          resize: vertical;
          min-height: 88px;
        }

        .episodes-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 8px;
        }

        .episodes-header h3 {
          font-size: 20px;
          color: var(--text-primary);
        }

        .btn-small {
          padding: 8px 14px;
          font-size: 12px;
        }

        .episodes-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .episode-card {
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 20px;
          background: rgba(255,255,255,0.04);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .episode-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .episode-badge {
          font-size: 12px;
          padding: 6px 10px;
          background: rgba(128, 0, 32, 0.16);
          color: var(--accent);
          border-radius: 999px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .episode-remove {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 12px;
        }

        .episode-remove:hover {
          color: var(--text-primary);
        }

        .episode-dropzone {
          border: 2px dashed var(--border);
          border-radius: 18px;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .episode-dropzone:hover,
        .episode-dropzone.dragging {
          border-color: var(--accent);
          background: rgba(128, 0, 32, 0.08);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 8px;
        }

        @media (max-width: 768px) {
          .upload-card {
            padding: 28px 20px;
          }

          .dropzone {
            padding: 48px 24px;
          }
        }
      `}</style>
    </section>
  );
}
