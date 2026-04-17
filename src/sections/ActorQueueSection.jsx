import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, XCircle, Clock, User, Eye, ChevronRight } from 'lucide-react';
import { UserRole } from '../constants/sections';

const mockQueueData = [
  { id: 1, title: 'Lead Role - Action Film', type: 'Film', priority: 'High', status: 'available', posted: '2 hours ago', director: 'Sarah Chen', rate: '$500/day', description: 'Looking for experienced action actor for lead role in upcoming feature film.' },
  { id: 2, title: 'Supporting Role - Drama Series', type: 'Series', priority: 'Medium', status: 'available', posted: '5 hours ago', director: 'Mike Roberts', rate: '$350/day', description: 'Supporting role for 3-episode arc in dramatic series.' },
  { id: 3, title: 'Commercial - Brand Ambassador', type: 'Commercial', priority: 'Low', status: 'pending', posted: '1 day ago', director: 'Lisa Martinez', rate: '$2000/day', description: 'National commercial campaign seeking charismatic brand ambassador.' },
  { id: 4, title: 'Voice Actor - Animation', type: 'Animation', priority: 'Medium', status: 'available', posted: '2 days ago', director: 'James Wilson', rate: '$300/hour', description: 'Voice acting for animated character in family-friendly series.' },
  { id: 5, title: 'Background Actor - Period Drama', type: 'Film', priority: 'Low', status: 'filled', posted: '3 days ago', director: 'Emma Davis', rate: '$150/day', description: 'Background roles for historical drama film.' },
];

export function ActorQueueSection({ onNavigate }) {
  const [queueData, setQueueData] = useState(mockQueueData);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = useMemo(() => {
    return queueData.filter(job => {
      const matchesStatus = selectedStatus === 'All' || job.status === selectedStatus;
      const matchesType = selectedType === 'All' || job.type === selectedType;
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [queueData, selectedStatus, selectedType, searchQuery]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return (
          <span className="status-badge available">
            <CheckCircle size={12} />
            Available
          </span>
        );
      case 'pending':
        return (
          <span className="status-badge pending">
            <Clock size={12} />
            Pending
          </span>
        );
      case 'filled':
        return (
          <span className="status-badge filled">
            <XCircle size={12} />
            Filled
          </span>
        );
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      High: '#ef4444',
      Medium: '#f59e0b',
      Low: '#22c55e'
    };
    return (
      <span className="priority-badge" style={{ borderColor: colors[priority], color: colors[priority] }}>
        {priority}
      </span>
    );
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
  };

  const handleCloseDetails = () => {
    setSelectedJob(null);
  };

  return (
    <div className={`actor-queue-section ${isVisible ? 'visible' : ''}`}>
      <div className="queue-container">
        {/* Header */}
        <div className="queue-header">
          <div>
            <h1>Actor Queue</h1>
            <p>Browse and apply for available acting roles.</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => onNavigate('actor-portal')}
          >
            <User size={16} />
            My Profile
          </button>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <input
              type="text"
              className="input"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select 
              className="filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="filled">Filled</option>
            </select>
          </div>

          <div className="filter-group">
            <select 
              className="filter-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Film">Film</option>
              <option value="Series">Series</option>
              <option value="Commercial">Commercial</option>
              <option value="Animation">Animation</option>
            </select>
          </div>
        </div>

        {/* Queue List */}
        <div className="queue-list">
          {filteredData.map((job) => (
            <div key={job.id} className="queue-item">
              <div className="job-main">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <div className="job-meta">
                    {getPriorityBadge(job.priority)}
                    {getStatusBadge(job.status)}
                  </div>
                </div>
                
                <div className="job-details">
                  <div className="detail-item">
                    <span className="label">Type:</span>
                    <span className="value">{job.type}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Director:</span>
                    <span className="value">{job.director}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Rate:</span>
                    <span className="value">{job.rate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Posted:</span>
                    <span className="value">{job.posted}</span>
                  </div>
                </div>

                <p className="job-description">{job.description}</p>
              </div>

              <div className="job-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleViewDetails(job)}
                >
                  <Eye size={16} />
                  View Details
                </button>
                {job.status === 'available' && (
                  <button className="btn btn-primary">
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="empty-state">
              <h3>No roles found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Job Details Modal */}
        {selectedJob && (
          <div className="modal-overlay" onClick={handleCloseDetails}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedJob.title}</h2>
                <button className="btn-icon" onClick={handleCloseDetails}>
                  ×
                </button>
              </div>
              
              <div className="modal-content">
                <div className="job-details-expanded">
                  <div className="detail-row">
                    <span className="label">Type:</span>
                    <span className="value">{selectedJob.type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Priority:</span>
                    {getPriorityBadge(selectedJob.priority)}
                  </div>
                  <div className="detail-row">
                    <span className="label">Status:</span>
                    {getStatusBadge(selectedJob.status)}
                  </div>
                  <div className="detail-row">
                    <span className="label">Director:</span>
                    <span className="value">{selectedJob.director}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Rate:</span>
                    <span className="value">{selectedJob.rate}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Posted:</span>
                    <span className="value">{selectedJob.posted}</span>
                  </div>
                </div>

                <div className="job-description-expanded">
                  <h3>Description</h3>
                  <p>{selectedJob.description}</p>
                </div>

                <div className="modal-actions">
                  {selectedJob.status === 'available' ? (
                    <button className="btn btn-primary">Apply for this Role</button>
                  ) : (
                    <button className="btn btn-secondary" disabled>
                      {selectedJob.status === 'filled' ? 'Role Filled' : 'Application Pending'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .actor-queue-section {
          min-height: 100vh;
          padding: 28px 0 56px;
          background: var(--bg-primary);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .actor-queue-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .queue-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .queue-header {
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

        .queue-header h1 {
          font-size: 36px;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .queue-header p {
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

        .queue-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .queue-item {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 24px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: var(--panel-glass);
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-soft);
          transition: all 0.3s ease;
        }

        .queue-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .job-main {
          flex: 1;
        }

        .job-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .job-header h3 {
          color: var(--text-primary);
          font-size: 20px;
          margin-bottom: 8px;
        }

        .job-meta {
          display: flex;
          gap: 8px;
        }

        .status-badge, .priority-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-badge.available {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .status-badge.pending {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .status-badge.filled {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .priority-badge {
          border: 1px solid;
          background: transparent;
        }

        .job-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .detail-item {
          display: flex;
          gap: 8px;
        }

        .detail-item .label {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .detail-item .value {
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 500;
        }

        .job-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .job-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-left: 16px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-secondary);
        }

        .empty-state h3 {
          color: var(--text-primary);
          margin-bottom: 8px;
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

        .btn-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 20px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .btn-icon:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }

        .job-details-expanded {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }

        .detail-row .label {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .job-description-expanded h3 {
          color: var(--text-primary);
          font-size: 18px;
          margin-bottom: 12px;
        }

        .job-description-expanded p {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 24px;
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

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .input {
          width: 100%;
          height: 44px;
          padding: 0 16px;
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

        @media (max-width: 768px) {
          .queue-header {
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

          .queue-item {
            flex-direction: column;
          }

          .job-actions {
            flex-direction: row;
            margin-left: 0;
            margin-top: 16px;
          }

          .job-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
