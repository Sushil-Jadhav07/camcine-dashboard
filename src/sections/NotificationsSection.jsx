import { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle, Clock, Filter, Send, Users } from 'lucide-react';
import { UserRole } from '../constants/sections';

const mockNotifications = [
  { id: 1, title: 'System Maintenance', message: 'Scheduled maintenance tonight from 2AM to 4AM EST', type: 'system', status: 'unread', date: '2024-03-15T10:30:00', priority: 'high', recipients: 'all' },
  { id: 2, title: 'New Feature Release', message: 'Video player controls have been updated with new features', type: 'feature', status: 'read', date: '2024-03-14T14:15:00', priority: 'medium', recipients: 'all' },
  { id: 3, title: 'Payment Processing Issue', message: 'Some users may experience delays in payment processing', type: 'payment', status: 'unread', date: '2024-03-13T09:45:00', priority: 'high', recipients: 'premium' },
  { id: 4, title: 'Content Update', message: 'New episodes available for your favorite shows', type: 'content', status: 'read', date: '2024-03-12T16:20:00', priority: 'low', recipients: 'all' },
  { id: 5, title: 'Security Update', message: 'We\'ve updated our security measures to better protect your account', type: 'security', status: 'read', date: '2024-03-11T11:00:00', priority: 'medium', recipients: 'all' },
];

const notificationTypes = ['All', 'system', 'feature', 'payment', 'content', 'security', 'marketing'];
const recipientTypes = ['All', 'all', 'premium', 'basic', 'admin', 'manager'];

export function NotificationsSection() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filteredNotifications, setFilteredNotifications] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedRecipients, setSelectedRecipients] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'system',
    priority: 'medium',
    recipients: 'all'
  });

  useEffect(() => {
    let filtered = notifications;

    if (searchQuery) {
      filtered = filtered.filter(notif =>
        notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType !== 'All') {
      filtered = filtered.filter(notif => notif.type === selectedType);
    }

    if (selectedRecipients !== 'All') {
      filtered = filtered.filter(notif => notif.recipients === selectedRecipients.toLowerCase());
    }

    setFilteredNotifications(filtered);
  }, [searchQuery, selectedType, selectedRecipients, notifications]);

  const getTypeBadge = (type) => {
    const colors = {
      system: '#ef4444',
      feature: '#3b82f6',
      payment: '#f59e0b',
      content: '#22c55e',
      security: '#8b5cf6',
      marketing: '#ec4899'
    };
    return (
      <span className="type-badge" style={{ backgroundColor: colors[type] }}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, status: 'read' } : notif
    ));
  };

  const markAsUnread = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, status: 'unread' } : notif
    ));
  };

  const deleteNotification = (id) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      setNotifications(notifications.filter(notif => notif.id !== id));
    }
  };

  const handleCreateNotification = () => {
    const newNotification = {
      id: notifications.length + 1,
      ...formData,
      status: 'draft',
      date: new Date().toISOString()
    };
    setNotifications([newNotification, ...notifications]);
    setShowCreateModal(false);
    setFormData({ title: '', message: '', type: 'system', priority: 'medium', recipients: 'all' });
  };

  const sendNotification = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, status: 'sent' } : notif
    ));
  };

  return (
    <div className="notifications-section">
      <div className="notifications-container">
        {/* Header */}
        <div className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p>Manage system notifications and user communications.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <Bell size={16} />
            Create Notification
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-number">{notifications.filter(n => n.status === 'unread').length}</span>
            <span className="stat-label">Unread</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{notifications.filter(n => n.status === 'sent').length}</span>
            <span className="stat-label">Sent</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{notifications.filter(n => n.status === 'draft').length}</span>
            <span className="stat-label">Draft</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{notifications.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <input
              type="text"
              className="input"
              placeholder="Search notifications..."
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
              {notificationTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select 
              className="filter-select"
              value={selectedRecipients}
              onChange={(e) => setSelectedRecipients(e.target.value)}
            >
              {recipientTypes.map(recipient => (
                <option key={recipient} value={recipient}>{recipient.charAt(0).toUpperCase() + recipient.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {filteredNotifications.map((notification) => (
            <div key={notification.id} className={`notification-item ${notification.status === 'unread' ? 'unread' : ''}`}>
              <div className="notification-content">
                <div className="notification-header">
                  <h3>{notification.title}</h3>
                  <div className="notification-meta">
                    {getTypeBadge(notification.type)}
                    {getPriorityBadge(notification.priority)}
                    <span className="status-badge">{notification.status}</span>
                  </div>
                </div>
                
                <p className="notification-message">{notification.message}</p>
                
                <div className="notification-footer">
                  <span className="date">{formatDate(notification.date)}</span>
                  <span className="recipients">
                    <Users size={14} />
                    {notification.recipients}
                  </span>
                </div>
              </div>

              <div className="notification-actions">
                {notification.status === 'unread' && (
                  <button 
                    className="btn-icon"
                    onClick={() => markAsRead(notification.id)}
                    title="Mark as read"
                  >
                    <CheckCircle size={16} />
                  </button>
                )}
                {notification.status === 'read' && (
                  <button 
                    className="btn-icon"
                    onClick={() => markAsUnread(notification.id)}
                    title="Mark as unread"
                  >
                    <Clock size={16} />
                  </button>
                )}
                {notification.status === 'draft' && (
                  <button 
                    className="btn-icon"
                    onClick={() => sendNotification(notification.id)}
                    title="Send notification"
                  >
                    <Send size={16} />
                  </button>
                )}
                <button 
                  className="btn-icon btn-danger"
                  onClick={() => deleteNotification(notification.id)}
                  title="Delete notification"
                >
                  ×
                </button>
              </div>
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="empty-state">
              <Bell size={48} />
              <h3>No notifications found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Create Notification Modal */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Create Notification</h2>
                <button 
                  className="btn-icon"
                  onClick={() => setShowCreateModal(false)}
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
                      placeholder="Enter notification title"
                    />
                  </div>

                  <div className="form-field">
                    <label>Type</label>
                    <select
                      className="input"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      {notificationTypes.slice(1).map(type => (
                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
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

                  <div className="form-field">
                    <label>Recipients</label>
                    <select
                      className="input"
                      value={formData.recipients}
                      onChange={(e) => setFormData({...formData, recipients: e.target.value})}
                    >
                      {recipientTypes.slice(1).map(recipient => (
                        <option key={recipient} value={recipient}>{recipient.charAt(0).toUpperCase() + recipient.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field full-width">
                    <label>Message</label>
                    <textarea
                      className="input textarea"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Enter notification message"
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={handleCreateNotification}
                  >
                    Create Notification
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .notifications-section {
          min-height: 100vh;
          padding: 28px 0 56px;
          background: var(--bg-primary);
        }

        .notifications-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .notifications-header {
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

        .notifications-header h1 {
          font-size: 36px;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .notifications-header p {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: var(--panel-glass);
          backdrop-filter: blur(24px);
        }

        .stat-number {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .filters-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
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

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .notification-item {
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

        .notification-item.unread {
          border-left: 4px solid var(--accent);
          background: var(--panel-glass-active);
        }

        .notification-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .notification-content {
          flex: 1;
        }

        .notification-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .notification-header h3 {
          color: var(--text-primary);
          font-size: 18px;
          margin-bottom: 8px;
        }

        .notification-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .type-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          color: white;
        }

        .priority-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid;
          background: transparent;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
        }

        .notification-message {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .notification-footer {
          display: flex;
          gap: 16px;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .date {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .recipients {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .notification-actions {
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

        .btn-icon.btn-danger:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
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
          .notifications-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }

          .filters-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            min-width: auto;
          }

          .notification-item {
            flex-direction: column;
          }

          .notification-actions {
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
