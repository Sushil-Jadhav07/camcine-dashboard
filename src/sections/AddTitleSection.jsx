import { useState, useEffect } from 'react';
import {
  Plus,
  Film,
  Music,
  Tv,
  Radio,
  Upload,
  X,
  Save,
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  User,
  DollarSign
} from 'lucide-react';
import { UserRole } from '../constants/sections';

const titleTypes = [
  { id: 'film', name: 'Film', icon: Film, description: 'Feature films and movies' },
  { id: 'series', name: 'Series', icon: Tv, description: 'TV series and shows' },
  { id: 'music', name: 'Music', icon: Music, description: 'Music videos and concerts' },
  { id: 'podcast', name: 'Podcast', icon: Radio, description: 'Audio podcasts and radio shows' }
];

const genres = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Documentary', 'Animation', 'Music', 'Sports', 'News'
];

export function AddTitleSection({ onNavigate, titleType }) {
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    releaseDate: '',
    duration: '',
    director: '',
    cast: '',
    language: '',
    rating: '',
    price: '',
    tags: '',
    thumbnail: null,
    video: null
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (titleType) {
      setSelectedType(titleType);
    }
  }, [titleType]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setIsSubmitting(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setUploadProgress(0);
    
    // Reset form or navigate back
    if (confirm('Title added successfully! Would you like to add another title?')) {
      setFormData({
        title: '',
        description: '',
        genre: '',
        releaseDate: '',
        duration: '',
        director: '',
        cast: '',
        language: '',
        rating: '',
        price: '',
        tags: '',
        thumbnail: null,
        video: null
      });
      setSelectedType(titleType || '');
    } else {
      onNavigate('content');
    }
  };

  const renderTypeSelection = () => (
    <div className="type-selection">
      <h2>What type of title are you adding?</h2>
      <div className="type-grid">
        {titleTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              className={`type-card ${selectedType === type.id ? 'selected' : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="type-icon">
                <Icon size={32} />
              </div>
              <h3>{type.name}</h3>
              <p>{type.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderForm = () => {
    const selectedTypeData = titleTypes.find(t => t.id === selectedType);
    const Icon = selectedTypeData?.icon || Film;

    return (
      <div className="add-title-form">
        <div className="form-header">
          <div className="header-left">
            <button className="btn btn-secondary" type="button" onClick={() => onNavigate('add-title-type')}>
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="form-title">
              <Icon size={24} />
              <h2>Add {selectedTypeData?.name}</h2>
            </div>
          </div>
          <div className="header-right">
            <button className="btn btn-primary" type="button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : <><Save size={16} /> Save Title</>}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-grid">
            {/* Left Column */}
            <div className="form-column">
              <div className="form-field">
                <label>Title *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter title"
                  required
                />
              </div>

              <div className="form-field">
                <label>Description *</label>
                <textarea
                  className="input textarea"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter description"
                  required
                />
              </div>

              <div className="form-field">
                <label>Genre *</label>
                <select
                  className="input"
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  required
                >
                  <option value="">Select genre</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Release Date *</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.releaseDate}
                    onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Duration *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 2:30:00"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Director</label>
                <input
                  type="text"
                  className="input"
                  value={formData.director}
                  onChange={(e) => handleInputChange('director', e.target.value)}
                  placeholder="Enter director name"
                />
              </div>

              <div className="form-field">
                <label>Cast</label>
                <input
                  type="text"
                  className="input"
                  value={formData.cast}
                  onChange={(e) => handleInputChange('cast', e.target.value)}
                  placeholder="Enter cast members (comma separated)"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="form-row">
                <div className="form-field">
                  <label>Language</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    placeholder="e.g., English"
                  />
                </div>
                <div className="form-field">
                  <label>Rating</label>
                  <select
                    className="input"
                    value={formData.rating}
                    onChange={(e) => handleInputChange('rating', e.target.value)}
                  >
                    <option value="">Select rating</option>
                    <option value="G">G</option>
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                    <option value="NC-17">NC-17</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Price</label>
                <div className="price-input">
                  <DollarSign size={16} />
                  <input
                    type="number"
                    className="input"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Tags</label>
                <input
                  type="text"
                  className="input"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="Enter tags (comma separated)"
                />
              </div>

              {/* File Uploads */}
              <div className="upload-section">
                <div className="form-field">
                  <label>Thumbnail Image *</label>
                  <div className="upload-area">
                    <input
                      type="file"
                      id="thumbnail"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('thumbnail', e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="thumbnail" className="upload-label">
                      {formData.thumbnail ? (
                        <div className="file-preview">
                          <img src={URL.createObjectURL(formData.thumbnail)} alt="Thumbnail" />
                          <button type="button" className="remove-file" onClick={() => handleFileUpload('thumbnail', null)}>
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          <Upload size={24} />
                          <span>Click to upload thumbnail</span>
                          <small>PNG, JPG up to 10MB</small>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="form-field">
                  <label>Video File *</label>
                  <div className="upload-area">
                    <input
                      type="file"
                      id="video"
                      accept="video/*"
                      onChange={(e) => handleFileUpload('video', e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="video" className="upload-label">
                      {formData.video ? (
                        <div className="file-preview">
                          <Film size={32} />
                          <span>{formData.video.name}</span>
                          <button type="button" className="remove-file" onClick={() => handleFileUpload('video', null)}>
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          <Upload size={24} />
                          <span>Click to upload video</span>
                          <small>MP4, AVI, MOV up to 2GB</small>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Upload Progress */}
        {isSubmitting && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
            <span>Uploading... {uploadProgress}%</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`add-title-section ${isVisible ? 'visible' : ''}`}>
      <div className="add-title-container">
        <div className="add-title-header">
          <div>
            <h1>Add New Title</h1>
            <p>Upload and manage your content library.</p>
          </div>
        </div>

        <div className="add-title-content">
          {!selectedType ? renderTypeSelection() : renderForm()}
        </div>
      </div>

      <style>{`
        .add-title-section {
          min-height: 100vh;
          padding: 28px 0 56px;
          background: var(--bg-primary);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .add-title-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .add-title-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .add-title-header {
          margin-bottom: 32px;
          padding: 26px 30px;
          border-radius: 28px;
          border: 1px solid var(--border);
          background: var(--panel-glass-hero);
          backdrop-filter: blur(26px);
          box-shadow: var(--shadow-soft);
        }

        .add-title-header h1 {
          font-size: 36px;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .add-title-header p {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .type-selection h2 {
          color: var(--text-primary);
          font-size: 24px;
          margin-bottom: 24px;
          text-align: center;
        }

        .type-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .type-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 32px;
          border: 2px solid var(--border);
          border-radius: 20px;
          background: var(--panel-glass);
          backdrop-filter: blur(24px);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .type-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .type-card.selected {
          border-color: var(--accent);
          background: var(--panel-glass-active);
        }

        .type-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background: rgba(128, 0, 32, 0.1);
          color: var(--accent);
        }

        .type-card h3 {
          color: var(--text-primary);
          font-size: 20px;
          margin: 0;
        }

        .type-card p {
          color: var(--text-secondary);
          text-align: center;
          font-size: 14px;
          margin: 0;
        }

        .add-title-form {
          background: var(--panel-glass);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 32px;
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-soft);
        }

        .form-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .form-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .form-title h2 {
          color: var(--text-primary);
          font-size: 24px;
          margin: 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .form-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-field label {
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 500;
        }

        .input {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .input:focus {
          outline: none;
          border-color: var(--accent);
          background: rgba(255, 255, 255, 0.08);
        }

        .textarea {
          resize: vertical;
          font-family: inherit;
        }

        .price-input {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .price-input .input {
          flex: 1;
        }

        .price-input > span {
          color: var(--text-secondary);
        }

        .upload-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .upload-area {
          position: relative;
        }

        .upload-label {
          display: block;
          cursor: pointer;
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 32px;
          border: 2px dashed var(--border);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.3s ease;
        }

        .upload-placeholder:hover {
          border-color: var(--accent);
          background: rgba(128, 0, 32, 0.05);
        }

        .upload-placeholder span {
          color: var(--text-primary);
          font-size: 14px;
        }

        .upload-placeholder small {
          color: var(--text-secondary);
          font-size: 12px;
        }

        .file-preview {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
        }

        .file-preview img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
        }

        .file-preview span {
          flex: 1;
          color: var(--text-primary);
          font-size: 14px;
        }

        .remove-file {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(239, 68, 68, 0.1);
          border: none;
          border-radius: 4px;
          color: #ef4444;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .remove-file:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .upload-progress {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--accent);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .upload-progress span {
          color: var(--text-secondary);
          font-size: 14px;
          text-align: center;
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

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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
          .type-grid {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .header-left {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
