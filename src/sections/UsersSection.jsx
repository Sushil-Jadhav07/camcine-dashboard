import { useState, useEffect } from 'react';
import { 
  AlertCircle,
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
  MoreHorizontal,
  X,
  XOctagon,
  Users as UsersIcon
} from 'lucide-react';
import { userService } from '../services/users.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { UserRole } from '../constants/sections';
import { authService } from '../services/auth.js';

const roleLabels = {
  [UserRole.ADMIN]: 'Admin',
  [UserRole.MANAGER]: 'Manager',
  [UserRole.USER]: 'User',
  [UserRole.ACTOR]: 'Actor',
};

const roleFilters = ['All', 'Admin', 'Manager', 'User', 'Actor'];
const statusFilters = ['All', 'Active', 'Inactive'];

export function UsersSection() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    role: UserRole.USER,
    age: '',
    language_preferences: [],
    regions: []
  });
  const itemsPerPage = 6;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(user =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRole !== 'All') {
      const roleKey = Object.keys(UserRole).find(key => UserRole[key] === selectedRole.toLowerCase());
      filtered = filtered.filter(user => user.role === selectedRole.toLowerCase());
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter(user => 
        selectedStatus === 'Active' ? user.is_active : !user.is_active
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedRole, selectedStatus, users]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getAllUsers();
      
      if (response.success) {
        setUsers(response.data.users || response.data || []);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const response = await authService.register(formData);
      
      if (response.success) {
        setShowCreateModal(false);
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone_number: '',
          password: '',
          role: UserRole.USER,
          age: '',
          language_preferences: [],
          regions: []
        });
        await fetchUsers();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const response = await userService.updateUser(editingUser.id, formData);
      
      if (response.success) {
        setEditingUser(null);
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone_number: '',
          password: '',
          role: UserRole.USER,
          age: '',
          language_preferences: [],
          regions: []
        });
        await fetchUsers();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;
    
    try {
      const response = await userService.deactivateUser(userId);
      if (response.success) {
        await fetchUsers();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      password: '',
      role: user.role || UserRole.USER,
      age: user.age || '',
      language_preferences: user.language_preferences || [],
      regions: user.regions || []
    });
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRoleIcon = (role) => {
    switch (role) {
      case UserRole.ADMIN: return <Shield size={16} />;
      case UserRole.MANAGER: return <UsersIcon size={16} />;
      case UserRole.ACTOR: return <Headphones size={16} />;
      default: return <User size={16} />;
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="status-badge active">
        <CheckCircle size={12} />
        Active
      </span>
    ) : (
      <span className="status-badge inactive">
        <XCircle size={12} />
        Inactive
      </span>
    );
  };

  const canCreateUsers = currentUser?.role === UserRole.ADMIN;
  const canDeactivateUsers = currentUser?.role === UserRole.ADMIN;

  return (
    <div className={`users-section ${isVisible ? 'visible' : ''}`}>
      <div className="users-container">
        {/* Header */}
        <div className="users-header">
          <div>
            <h1>Users Management</h1>
            <p>Manage platform users, roles, and permissions.</p>
          </div>
          {canCreateUsers && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={16} />
              Add User
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              className="input"
              placeholder="Search users by name or email..."
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
          </div>

          <div className="filter-group">
            <Filter className="filter-icon" />
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

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Users List */}
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="users-list">
            {paginatedUsers.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-avatar">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=800020&color=fff`}
                    alt={`${user.first_name} ${user.last_name}`}
                  />
                </div>

                <div className="user-info">
                  <div className="user-name">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="user-email">{user.email}</div>
                </div>

                <div className="user-role">
                  {getRoleIcon(user.role)}
                  {roleLabels[user.role] || user.role}
                </div>

                <div className="user-status">
                  {getStatusBadge(user.is_active)}
                </div>

                <div className="user-meta">
                  <div className="user-phone">{user.phone_number}</div>
                  <div className="user-age">Age: {user.age}</div>
                </div>

                {(canCreateUsers || canDeactivateUsers) && (
                  <div className="user-actions">
                    {canCreateUsers && (
                      <button
                        className="btn-icon"
                        onClick={() => openEditModal(user)}
                        title="Edit user"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {canDeactivateUsers && (
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => handleDeactivateUser(user.id)}
                        title="Deactivate user"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {paginatedUsers.length === 0 && (
              <div className="empty-state">
                <UsersIcon size={48} />
                <h3>No users found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit User Modal */}
      {(showCreateModal || editingUser) && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User' : 'Create New User'}</h2>
              <button
                className="btn-icon"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingUser(null);
                  setError(null);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
              <div className="form-grid">
                <div className="form-field">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Email</label>
                  <input
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    disabled={Boolean(editingUser)}
                  />
                </div>

                <div className="form-field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    className="input"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    required
                  />
                </div>

                {!editingUser && (
                  <div className="form-field">
                    <label>Password</label>
                    <input
                      type="password"
                      className="input"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                  </div>
                )}

                <div className="form-field">
                  <label>Age</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Role</label>
                  <select
                    className="input"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    required
                  >
                    {Object.values(UserRole).map(role => (
                      <option key={role} value={role}>
                        {roleLabels[role]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingUser(null);
                    setError(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? <div className="spinner" /> : (editingUser ? 'Update' : 'Create')}
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
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .users-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .users-container {
          max-width: 1200px;
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
          background: var(--panel-glass-hero);
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

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          margin-bottom: 20px;
          border-radius: 12px;
          background: rgba(226, 79, 99, 0.1);
          border: 1px solid rgba(226, 79, 99, 0.3);
          color: #ffb8c2;
          font-size: 14px;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: var(--text-secondary);
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
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
          background: var(--panel-glass);
          border: 1px solid var(--border);
          border-radius: 24px;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-soft);
          backdrop-filter: blur(24px);
        }

        .user-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid var(--border);
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .user-email {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .user-role {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.active {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .status-badge.inactive {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .user-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .user-actions {
          display: flex;
          gap: 8px;
        }

        .btn-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 10px;
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
        }

        .empty-state h3 {
          margin: 16px 0 8px;
          color: var(--text-primary);
        }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 32px;
          padding: 20px;
        }

        .page-info {
          color: var(--text-secondary);
          font-size: 14px;
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

        .form-field label {
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 500;
        }

        .form-field .input {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .form-field .input:focus {
          outline: none;
          border-color: var(--accent);
          background: rgba(255, 255, 255, 0.08);
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
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .filters-bar {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-box {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}
