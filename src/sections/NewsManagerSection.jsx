import { useEffect, useState } from 'react';
import { AlertCircle, Edit2, Eye, Globe, Plus, Radio, Trash2, Wifi } from 'lucide-react';
import { UserRole } from '../constants/sections';

const mockNews = [
  { id: 1, title: 'New Series Launch Announcement', type: 'announcement', status: 'published', date: '2024-03-15', views: 12500, priority: 'high', content: 'We are excited to announce the launch of our new original series...' },
  { id: 2, title: 'System Maintenance Tonight', type: 'maintenance', status: 'scheduled', date: '2024-03-14', views: 8900, priority: 'medium', content: 'Scheduled maintenance will occur tonight from 2AM to 4AM EST...' },
  { id: 3, title: 'Feature Update: New Player Controls', type: 'update', status: 'published', date: '2024-03-13', views: 15600, priority: 'low', content: 'We\'ve rolled out new player controls based on user feedback...' },
  { id: 4, title: 'Partnership with Major Studio', type: 'partnership', status: 'draft', date: '2024-03-12', views: 0, priority: 'high', content: 'Exciting partnership announcement coming soon...' },
];

const newsTypes = ['All', 'announcement', 'maintenance', 'update', 'partnership', 'promotion'];
const statusOptions = ['All', 'published', 'draft', 'scheduled', 'archived'];

export function NewsManagerSection() {
  const [news, setNews] = useState(mockNews);
  const [filteredNews, setFilteredNews] = useState(mockNews);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'announcement',
    status: 'draft',
    priority: 'medium',
    content: ''
  });

  useEffect(() => {
    let filtered = news;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType !== 'All') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    setFilteredNews(filtered);
  }, [searchQuery, selectedType, selectedStatus, news]);

  const getStatusBadge = (status) => {
    const colors = {
      published: '#22c55e',
      draft: '#f59e0b',
      scheduled: '#3b82f6',
      archived: '#6b7280'
    };
    return (
      <span className="status-badge" style={{ color: colors[status] }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#22c55e'
    };
    return (
      <span className="priority-badge" style={{ borderColor: colors[priority], color: colors[priority] }}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const handleCreateNews = () => {
    const newItem = {
      id: news.length + 1,
      ...formData,
      date: new Date().toISOString().split('T')[0],
      views: 0
    };
    setNews([...news, newItem]);
    setShowCreateModal(false);
    setFormData({ title: '', type: 'announcement', status: 'draft', priority: 'medium', content: '' });
  };

  const handleEditNews = (item) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      type: item.type,
      status: item.status,
      priority: item.priority,
      content: item.content
    });
  };

  const handleUpdateNews = () => {
    setNews(news.map(item => 
      item.id === editingNews.id 
        ? { ...item, ...formData }
        : item
    ));
    setEditingNews(null);
    setFormData({ title: '', type: 'announcement', status: 'draft', priority: 'medium', content: '' });
  };

  const handleDeleteNews = (id) => {
    if (confirm('Are you sure you want to delete this news item?')) {
      setNews(news.filter(item => item.id !== id));
    }
  };

  return (
    <div className="news-manager-section">
      <div className="news-container">
        {/* Header */}
        <div className="news-header">
          <div>
            <h1>News Manager</h1>
            <p>Create and manage platform announcements and updates.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} />
            Create News
          </button>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <input
              type="text"
              className="input"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select 
              className="filter-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {newsTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select 
              className="filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* News List */}
        <div className="news-list">
          {filteredNews.map((item) => (
            <div key={item.id} className="news-card">
              <div className="news-content">
                <div className="news-header-info">
                  <h3>{item.title}</h3>
                  <div className="news-meta">
                    {getPriorityBadge(item.priority)}
                    {getStatusBadge(item.status)}
                  </div>
                </div>
                
                <p className="news-excerpt">{item.content.substring(0, 150)}...</p>
                
                <div className="news-stats">
                  <span className="stat">
                    <Eye size={14} />
                    {item.views.toLocaleString()} views
                  </span>
                  <span className="stat">
                    <Globe size={14} />
                    {item.type}
                  </span>
                  <span className="stat">
                    <Radio size={14} />
                    {item.date}
                  </span>
                </div>
              </div>

              <div className="news-actions">
                <button className="btn-icon" onClick={() => handleEditNews(item)}>
                  <Edit2 size={16} />
                </button>
                <button className="btn-icon" onClick={() => handleDeleteNews(item.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {filteredNews.length === 0 && (
            <div className="empty-state">
              <AlertCircle size={48} />
              <h3>No news found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {(showCreateModal || editingNews) && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingNews ? 'Edit News' : 'Create News'}</h2>
                <button 
                  className="btn-icon"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingNews(null);
                  }}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-content">
                <div className="form-grid">
                  <div className="form-field">
                    <label>Title</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>

                  <div className="form-field">
                    <label>Type</label>
                    <select
                      className="input"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      {newsTypes.slice(1).map(type => (
                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Status</label>
                    <select
                      className="input"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      {statusOptions.slice(1).map(status => (
                        <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Priority</label>
                    <select
                      className="input"
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  <div className="form-field full-width">
                    <label>Content</label>
                    <textarea
                      className="input textarea"
                      rows={4}
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingNews(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={editingNews ? handleUpdateNews : handleCreateNews}
                  >
                    {editingNews ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .news-manager-section {
          min-height: 100vh;
          padding: 28px 0 56px;
          background: var(--bg-primary);
        }

        .news-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .news-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 26px;
          padding: 26px 30px;
          border-radius: 28px;
          border: 1px solid var(--border);
          background: var(--panel-glass-hero);
          backdrop-filter: blur(26px);
          box-shadow: var(--shadow-soft);
        }

        .news-header h1 {
          font-size: 36px;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .news-header p {
          color: var(--text-secondary);
          font-size: 14px;
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
          background: var(--panel-glass-soft);
          backdrop-filter: blur(24px);
        }

        .search-box {
          flex: 1;
          min-width: 280px;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 12px;
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

        .news-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .news-card {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 20px;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: var(--panel-glass);
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-soft);
          transition: all 0.3s ease;
        }

        .news-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .news-content {
          flex: 1;
        }

        .news-header-info {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .news-header-info h3 {
          color: var(--text-primary);
          font-size: 18px;
          margin-bottom: 8px;
        }

        .news-meta {
          display: flex;
          gap: 8px;
        }

        .status-badge, .priority-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }

        .priority-badge {
          border: 1px solid;
          background: transparent;
        }

        .news-excerpt {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .news-stats {
          display: flex;
          gap: 16px;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .news-actions {
          display: flex;
          gap: 8px;
          margin-left: 16px;
        }

        .btn-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-icon:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          color: var(--text-secondary);
          text-align: center;
        }

        .empty-state h3 {
          color: var(--text-primary);
          margin: 16px 0 8px;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(7, 2, 3, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: rgba(19, 23, 30, 0.98);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 32px;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--shadow-soft);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .modal-header h2 {
          color: var(--text-primary);
          font-size: 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-field.full-width {
          grid-column: span 2;
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

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
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
          .news-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .filters-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            min-width: auto;
          }

          .news-card {
            flex-direction: column;
          }

          .news-actions {
            margin-left: 0;
            margin-top: 12px;
            justify-content: flex-end;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-field.full-width {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}
