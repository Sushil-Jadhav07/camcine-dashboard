import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Mail,
  Shield,
  User,
  Headphones,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer' | 'support';
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  avatar: string;
}

const mockUsers: User[] = [
  { id: 1, name: 'Alex Johnson', email: 'alex@streamflow.com', role: 'admin', status: 'active', lastActive: '2 min ago', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
  { id: 2, name: 'Sarah Chen', email: 'sarah@streamflow.com', role: 'editor', status: 'active', lastActive: '15 min ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
  { id: 3, name: 'Michael Brown', email: 'michael@streamflow.com', role: 'viewer', status: 'active', lastActive: '1 hour ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { id: 4, name: 'Emily Davis', email: 'emily@streamflow.com', role: 'support', status: 'active', lastActive: '3 hours ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  { id: 5, name: 'James Wilson', email: 'james@streamflow.com', role: 'editor', status: 'inactive', lastActive: '2 days ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
  { id: 6, name: 'Lisa Anderson', email: 'lisa@streamflow.com', role: 'viewer', status: 'pending', lastActive: 'Never', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
  { id: 7, name: 'David Martinez', email: 'david@streamflow.com', role: 'support', status: 'active', lastActive: '5 hours ago', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
  { id: 8, name: 'Anna Taylor', email: 'anna@streamflow.com', role: 'editor', status: 'active', lastActive: '30 min ago', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face' },
];

const roles = [
  { id: 'admin', label: 'Admin', icon: Shield, description: 'Full access to all features' },
  { id: 'editor', label: 'Editor', icon: Edit2, description: 'Can manage content' },
  { id: 'viewer', label: 'Viewer', icon: User, description: 'View-only access' },
  { id: 'support', label: 'Support', icon: Headphones, description: 'Handle support tickets' },
];

const roleFilters = ['All', 'Admin', 'Editor', 'Viewer', 'Support'];
const statusFilters = ['All', 'Active', 'Inactive', 'Pending'];

export function UsersSection() {
  const [users] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRole !== 'All') {
      filtered = filtered.filter(user => user.role === selectedRole.toLowerCase());
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter(user => user.status === selectedStatus.toLowerCase());
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedRole, selectedStatus, users]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="role-icon" />;
      case 'editor': return <Edit2 className="role-icon" />;
      case 'support': return <Headphones className="role-icon" />;
      default: return <User className="role-icon" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-success"><CheckCircle /> Active</span>;
      case 'inactive':
        return <span className="badge badge-error"><XCircle /> Inactive</span>;
      case 'pending':
        return <span className="badge badge-warning"><Clock /> Pending</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <section className="users-section">
      <div className="users-container">
        {/* Header */}
        <div 
          className="users-header"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease'
          }}
        >
          <div>
            <h1>Users & Roles</h1>
            <p>Invite teammates, assign roles, and control access.</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowInviteModal(true)}
          >
            <Plus /> Invite User
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
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <Filter className="filter-icon" />
            <select 
              className="filter-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roleFilters.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            <select 
              className="filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statusFilters.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Users Grid */}
        <div className="users-layout">
          {/* Users List */}
          <div 
            className="users-list"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s'
            }}
          >
            {paginatedUsers.map((user, index) => (
              <div 
                key={user.id} 
                className="user-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="user-avatar">
                  <img src={user.avatar} alt={user.name} />
                </div>

                <div className="user-info">
                  <h3 className="user-name">{user.name}</h3>
                  <div className="user-email">
                    <Mail className="email-icon" />
                    {user.email}
                  </div>
                </div>

                <div className="user-role">
                  {getRoleIcon(user.role)}
                  <span className="role-label capitalize">{user.role}</span>
                </div>

                <div className="user-status">
                  {getStatusBadge(user.status)}
                </div>

                <div className="user-last-active">
                  <Clock className="time-icon" />
                  {user.lastActive}
                </div>

                <div className="user-actions">
                  <button className="action-btn" title="Edit">
                    <Edit2 />
                  </button>
                  <button className="action-btn danger" title="Delete">
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}

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

          {/* Roles Panel */}
          <div 
            className="roles-panel"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(40px)',
              transition: 'opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s'
            }}
          >
            <h3>Role Permissions</h3>
            <div className="roles-list">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <div key={role.id} className="role-item">
                    <div className="role-icon-wrapper">
                      <Icon />
                    </div>
                    <div className="role-info">
                      <span className="role-name">{role.label}</span>
                      <span className="role-desc">{role.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Invite User</h2>
              <button className="modal-close" onClick={() => setShowInviteModal(false)}>
                <X />
              </button>
            </div>
            <form className="invite-form">
              <div className="form-field">
                <label className="label">Email Address</label>
                <input type="email" className="input" placeholder="user@company.com" />
              </div>
              <div className="form-field">
                <label className="label">Role</label>
                <select className="filter-select" style={{ width: '100%' }}>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.label}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Mail /> Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .users-section {
          min-height: 100vh;
          padding: 28px 0 56px;
          background: var(--bg-primary);
        }

        .users-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .users-header {
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

        .users-header h1 {
          font-size: 36px;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .users-header p {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .users-header .btn {
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

        .users-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
        }

        .users-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .user-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(19, 23, 30, 0.84);
          border: 1px solid var(--border);
          border-radius: 24px;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-soft);
          backdrop-filter: blur(24px);
        }

        .user-card:hover {
          border-color: var(--accent);
          background: linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03)), rgba(24, 28, 36, 0.94);
          transform: translateY(-6px);
        }

        .user-avatar {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .user-email {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .email-icon {
          width: 14px;
          height: 14px;
        }

        .user-role {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: rgba(128, 0, 32, 0.12);
          border-radius: 999px;
          color: var(--accent);
          font-size: 13px;
          font-weight: 500;
        }

        .role-icon {
          width: 14px;
          height: 14px;
        }

        .role-label.capitalize {
          text-transform: capitalize;
        }

        .user-status .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .user-status .badge svg {
          width: 12px;
          height: 12px;
        }

        .user-last-active {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .time-icon {
          width: 14px;
          height: 14px;
        }

        .user-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 8px;
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

        .roles-panel {
          position: sticky;
          top: 96px;
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(19, 23, 30, 0.84);
          border: 1px solid var(--border);
          border-radius: 26px;
          padding: 24px;
          height: fit-content;
          box-shadow: var(--shadow-soft);
          backdrop-filter: blur(24px);
        }

        .roles-panel h3 {
          font-size: 16px;
          color: var(--text-primary);
          margin-bottom: 20px;
        }

        .roles-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .role-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .role-icon-wrapper {
          width: 40px;
          height: 40px;
          background: rgba(128, 0, 32, 0.12);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
        }

        .role-icon-wrapper svg {
          width: 18px;
          height: 18px;
        }

        .role-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .role-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .role-desc {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
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

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(7, 2, 3, 0.68);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.2s ease;
          backdrop-filter: blur(10px);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02)), rgba(19, 23, 30, 0.92);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 24px;
          width: 100%;
          max-width: 440px;
          animation: slideUp 0.3s ease;
          box-shadow: var(--shadow-soft);
          backdrop-filter: blur(28px);
        }

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

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .modal-header h2 {
          font-size: 20px;
          color: var(--text-primary);
        }

        .modal-close {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          background: rgba(247, 237, 239, 0.05);
          color: var(--text-primary);
        }

        .invite-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 8px;
        }

        .modal-actions .btn {
          gap: 8px;
        }

        @media (max-width: 1024px) {
          .users-layout {
            grid-template-columns: 1fr;
          }

          .roles-panel {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .user-card {
            flex-wrap: wrap;
          }

          .users-header {
            padding: 22px;
          }

          .user-last-active {
            width: 100%;
            margin-left: 64px;
          }
        }
      `}</style>
    </section>
  );
}
