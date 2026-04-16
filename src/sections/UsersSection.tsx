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
  XOctagon
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

interface PlatformUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  plan: 'free' | 'basic' | 'standard' | 'premium';
  status: 'active' | 'suspended' | 'banned';
  joinedAt: string;
  lastActive: string;
  totalSpent: string;
  watchedTitles: number;
  avatar: string;
}

const mockUsers: User[] = [
  { id: 1, name: 'Alex Johnson', email: 'alex@Camcine.com', role: 'admin', status: 'active', lastActive: '2 min ago', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
  { id: 2, name: 'Sarah Chen', email: 'sarah@Camcine.com', role: 'editor', status: 'active', lastActive: '15 min ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
  { id: 3, name: 'Michael Brown', email: 'michael@Camcine.com', role: 'viewer', status: 'active', lastActive: '1 hour ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { id: 4, name: 'Emily Davis', email: 'emily@Camcine.com', role: 'support', status: 'active', lastActive: '3 hours ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  { id: 5, name: 'James Wilson', email: 'james@Camcine.com', role: 'editor', status: 'inactive', lastActive: '2 days ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
  { id: 6, name: 'Lisa Anderson', email: 'lisa@Camcine.com', role: 'viewer', status: 'pending', lastActive: 'Never', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
  { id: 7, name: 'David Martinez', email: 'david@Camcine.com', role: 'support', status: 'active', lastActive: '5 hours ago', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
  { id: 8, name: 'Anna Taylor', email: 'anna@Camcine.com', role: 'editor', status: 'active', lastActive: '30 min ago', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face' },
];

const mockPlatformUsers: PlatformUser[] = [
  { id: 101, name: 'Rohan Kapoor', email: 'rohan@gmail.com', phone: '+91 9876512340', plan: 'premium', status: 'active', joinedAt: '2025-11-04', lastActive: '18 min ago', totalSpent: '₹1,240', watchedTitles: 42, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
  { id: 102, name: 'Aisha Verma', email: 'aisha@gmail.com', phone: '+91 9822212345', plan: 'standard', status: 'active', joinedAt: '2025-09-18', lastActive: '2 hours ago', totalSpent: '₹860', watchedTitles: 31, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
  { id: 103, name: 'Neeraj Singh', email: 'neeraj@gmail.com', phone: '+91 9811012345', plan: 'free', status: 'suspended', joinedAt: '2026-01-12', lastActive: '4 days ago', totalSpent: '₹0', watchedTitles: 8, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
  { id: 104, name: 'Maya Rao', email: 'maya@gmail.com', phone: '+91 9988012345', plan: 'premium', status: 'active', joinedAt: '2025-07-22', lastActive: '35 min ago', totalSpent: '₹2,420', watchedTitles: 66, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face' },
  { id: 105, name: 'Sahil Khan', email: 'sahil@gmail.com', phone: '+91 9765412345', plan: 'basic', status: 'active', joinedAt: '2025-12-02', lastActive: '1 day ago', totalSpent: '₹340', watchedTitles: 15, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { id: 106, name: 'Priya Menon', email: 'priya@gmail.com', phone: '+91 9944312345', plan: 'standard', status: 'banned', joinedAt: '2025-06-10', lastActive: '10 days ago', totalSpent: '₹540', watchedTitles: 13, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  { id: 107, name: 'Aditya Joshi', email: 'aditya@gmail.com', phone: '+91 9700012345', plan: 'free', status: 'active', joinedAt: '2026-02-05', lastActive: '12 min ago', totalSpent: '₹120', watchedTitles: 11, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
  { id: 108, name: 'Kavya Sharma', email: 'kavya@gmail.com', phone: '+91 9898912345', plan: 'premium', status: 'active', joinedAt: '2025-08-14', lastActive: '3 hours ago', totalSpent: '₹1,980', watchedTitles: 58, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
  { id: 109, name: 'Harsh Patel', email: 'harsh@gmail.com', phone: '+91 9755512345', plan: 'basic', status: 'active', joinedAt: '2026-01-20', lastActive: '8 hours ago', totalSpent: '₹280', watchedTitles: 17, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
  { id: 110, name: 'Nisha Dutta', email: 'nisha@gmail.com', phone: '+91 9833312345', plan: 'free', status: 'active', joinedAt: '2026-03-02', lastActive: '5 min ago', totalSpent: '₹60', watchedTitles: 6, avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop&crop=face' },
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
  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>(mockPlatformUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [platformSearchQuery, setPlatformSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPlatformPage, setCurrentPlatformPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'internal' | 'platform'>('internal');
  const [openPlatformMenuId, setOpenPlatformMenuId] = useState<number | null>(null);
  const [sidePanel, setSidePanel] = useState<{ type: 'history' | 'purchases'; user: PlatformUser } | null>(null);
  const [planModalUser, setPlanModalUser] = useState<PlatformUser | null>(null);
  const [refundUser, setRefundUser] = useState<PlatformUser | null>(null);
  const [notificationUser, setNotificationUser] = useState<PlatformUser | null>(null);
  const [banUser, setBanUser] = useState<PlatformUser | null>(null);
  const itemsPerPage = 6;
  const platformItemsPerPage = 5;

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
  const filteredPlatformUsers = platformUsers.filter(user =>
    `${user.name} ${user.email}`.toLowerCase().includes(platformSearchQuery.toLowerCase())
  );
  const totalPlatformPages = Math.ceil(filteredPlatformUsers.length / platformItemsPerPage);
  const paginatedPlatformUsers = filteredPlatformUsers.slice(
    (currentPlatformPage - 1) * platformItemsPerPage,
    currentPlatformPage * platformItemsPerPage
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

  const getPlatformStatusBadge = (status: PlatformUser['status']) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-success"><CheckCircle /> Active</span>;
      case 'suspended':
        return <span className="badge badge-warning"><AlertCircle /> Suspended</span>;
      case 'banned':
        return <span className="badge badge-error"><XOctagon /> Banned</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  const getPlanBadge = (plan: PlatformUser['plan']) => (
    <span className={`plan-badge ${plan}`}>{plan}</span>
  );

  const updatePlatformStatus = (userId: number, status: PlatformUser['status']) => {
    setPlatformUsers((current) => current.map((user) => user.id === userId ? { ...user, status } : user));
    setOpenPlatformMenuId(null);
    setBanUser(null);
  };

  const watchHistoryItems = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    title: ['Crimson City', 'Monsoon Notes', 'The Archive Room', 'Stage Lights', 'Night Market'][index % 5],
    watchedDate: `${index + 1} day${index === 0 ? '' : 's'} ago`,
    progress: `${78 - index * 5}%`,
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=120&h=80&fit=crop',
  }));

  const purchaseItems = [
    { title: 'Cyber Chronicles', episode: 'Episode 5', amount: '₹5', date: 'Apr 10, 2026', status: 'Paid' },
    { title: 'Crimson City', episode: '-', amount: '₹20', date: 'Apr 3, 2026', status: 'Paid' },
    { title: 'Stage Lights', episode: '-', amount: '₹10', date: 'Mar 27, 2026', status: 'Refunded' },
  ];

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
            <p>{activeTab === 'internal' ? 'Invite teammates, assign roles, and control access.' : 'Manage platform viewers, plans, watch history, and purchases.'}</p>
          </div>
          {activeTab === 'internal' ? (
            <button 
              className="btn btn-primary"
              onClick={() => setShowInviteModal(true)}
            >
              <Plus /> Invite User
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setNotificationUser(platformUsers[0])}>
              <Mail /> Send Alert
            </button>
          )}
        </div>

        <div className="users-tabs">
          <button className={activeTab === 'internal' ? 'active' : ''} onClick={() => setActiveTab('internal')}>Internal Team</button>
          <button className={activeTab === 'platform' ? 'active' : ''} onClick={() => setActiveTab('platform')}>Platform Users (Viewers)</button>
        </div>

        {activeTab === 'internal' && (
          <>
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
          </>
        )}

        {activeTab === 'platform' && (
          <>
            <div className="platform-stats">
              {[
                ['Total Platform Users', '42,300'],
                ['Active This Month', '38,900'],
                ['Suspended', '12'],
                ['Banned', '3'],
              ].map(([label, value]) => (
                <div className="platform-stat-card" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className="filters-bar">
              <div className="search-box">
                <Search className="search-icon" />
                <input
                  type="text"
                  className="input"
                  placeholder="Search platform users..."
                  value={platformSearchQuery}
                  onChange={(e) => {
                    setPlatformSearchQuery(e.target.value);
                    setCurrentPlatformPage(1);
                  }}
                />
              </div>
            </div>

            <div className="platform-table-card">
              <div className="platform-table-wrap">
                <table className="platform-table">
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>Name & Email</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Last Active</th>
                      <th>Total Spent</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPlatformUsers.map((user) => (
                      <tr key={user.id}>
                        <td><img className="platform-avatar" src={user.avatar} alt={user.name} /></td>
                        <td>
                          <div className="platform-user-meta">
                            <strong>{user.name}</strong>
                            <span>{user.email}</span>
                          </div>
                        </td>
                        <td>{getPlanBadge(user.plan)}</td>
                        <td>{getPlatformStatusBadge(user.status)}</td>
                        <td>{user.joinedAt}</td>
                        <td>{user.lastActive}</td>
                        <td>{user.totalSpent}</td>
                        <td>
                          <div className="platform-actions">
                            <button className="action-btn" onClick={() => setOpenPlatformMenuId(openPlatformMenuId === user.id ? null : user.id)}>
                              <MoreHorizontal />
                            </button>
                            {openPlatformMenuId === user.id && (
                              <div className="platform-menu">
                                <button onClick={() => { setSidePanel({ type: 'history', user }); setOpenPlatformMenuId(null); }}>View Watch History</button>
                                <button onClick={() => { setSidePanel({ type: 'purchases', user }); setOpenPlatformMenuId(null); }}>View Purchases</button>
                                <button onClick={() => { setPlanModalUser(user); setOpenPlatformMenuId(null); }}>Change Plan</button>
                                <button onClick={() => updatePlatformStatus(user.id, 'suspended')}>Suspend Account</button>
                                <button onClick={() => { setBanUser(user); setOpenPlatformMenuId(null); }}>Ban Account</button>
                                <button onClick={() => { setRefundUser(user); setOpenPlatformMenuId(null); }}>Issue Refund</button>
                                <button onClick={() => { setNotificationUser(user); setOpenPlatformMenuId(null); }}>Send Notification</button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPlatformPages > 1 && (
                <div className="pagination">
                  <button className="pagination-btn" onClick={() => setCurrentPlatformPage((p) => Math.max(1, p - 1))} disabled={currentPlatformPage === 1}>
                    <ChevronLeft />
                  </button>
                  {[...Array(totalPlatformPages)].map((_, i) => (
                    <button key={i + 1} className={`pagination-btn ${currentPlatformPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPlatformPage(i + 1)}>
                      {i + 1}
                    </button>
                  ))}
                  <button className="pagination-btn" onClick={() => setCurrentPlatformPage((p) => Math.min(totalPlatformPages, p + 1))} disabled={currentPlatformPage === totalPlatformPages}>
                    <ChevronRight />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
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

      {sidePanel && (
        <div className="side-panel-overlay" onClick={() => setSidePanel(null)}>
          <aside className="side-panel" onClick={e => e.stopPropagation()}>
            <div className="side-panel-header">
              <div>
                <h2>{sidePanel.type === 'history' ? 'Watch History' : 'TVOD Purchases'}</h2>
                <p>{sidePanel.user.name}</p>
              </div>
              <button className="modal-close" onClick={() => setSidePanel(null)}><X /></button>
            </div>
            <div className="side-panel-list">
              {sidePanel.type === 'history' ? (
                watchHistoryItems.map((item) => (
                  <div className="side-item" key={item.id}>
                    <img src={item.thumbnail} alt={item.title} />
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.watchedDate}</span>
                      <small>Watched {item.progress}</small>
                    </div>
                  </div>
                ))
              ) : (
                purchaseItems.map((item) => (
                  <div className="side-item purchase" key={`${item.title}-${item.date}`}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.episode}</span>
                    </div>
                    <div className="purchase-meta">
                      <strong>{item.amount}</strong>
                      <span>{item.date}</span>
                      <small>{item.status}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      )}

      {planModalUser && (
        <div className="modal-overlay" onClick={() => setPlanModalUser(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Plan</h2>
              <button className="modal-close" onClick={() => setPlanModalUser(null)}><X /></button>
            </div>
            <div className="invite-form">
              <div className="form-field">
                <label className="label">User</label>
                <input className="input" value={planModalUser.name} readOnly />
              </div>
              <div className="form-field">
                <label className="label">Select Plan</label>
                <select className="filter-select" style={{ width: '100%' }} defaultValue={planModalUser.plan}>
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setPlanModalUser(null)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => setPlanModalUser(null)}>Update Plan</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {refundUser && (
        <div className="modal-overlay" onClick={() => setRefundUser(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Issue Refund</h2>
              <button className="modal-close" onClick={() => setRefundUser(null)}><X /></button>
            </div>
            <div className="invite-form">
              <div className="form-field">
                <label className="label">Transaction</label>
                <select className="filter-select" style={{ width: '100%' }}>
                  <option>Cyber Chronicles - ₹5</option>
                  <option>Crimson City - ₹20</option>
                </select>
              </div>
              <div className="form-field">
                <label className="label">Amount</label>
                <input className="input" placeholder="₹5" />
              </div>
              <div className="form-field">
                <label className="label">Reason</label>
                <textarea className="input refund-textarea" placeholder="Reason for refund" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setRefundUser(null)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => setRefundUser(null)}>Issue Refund</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {notificationUser && (
        <div className="modal-overlay" onClick={() => setNotificationUser(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Send Notification</h2>
              <button className="modal-close" onClick={() => setNotificationUser(null)}><X /></button>
            </div>
            <div className="invite-form">
              <div className="form-field">
                <label className="label">User ID</label>
                <input className="input" value={String(notificationUser.id)} readOnly />
              </div>
              <div className="form-field">
                <label className="label">Title</label>
                <input className="input" placeholder="Notification title" />
              </div>
              <div className="form-field">
                <label className="label">Message</label>
                <textarea className="input refund-textarea" placeholder="Notification message" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setNotificationUser(null)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => setNotificationUser(null)}>Send</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {banUser && (
        <div className="modal-overlay" onClick={() => setBanUser(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ban Account</h2>
              <button className="modal-close" onClick={() => setBanUser(null)}><X /></button>
            </div>
            <div className="invite-form">
              <div className="form-field">
                <label className="label">User</label>
                <input className="input" value={banUser.name} readOnly />
              </div>
              <div className="form-field">
                <label className="label">Reason</label>
                <textarea className="input refund-textarea" placeholder="Reason for banning this account" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setBanUser(null)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => updatePlatformStatus(banUser.id, 'banned')}>Confirm Ban</button>
              </div>
            </div>
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

        .users-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 22px;
          padding: 10px;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(19, 23, 30, 0.82);
          backdrop-filter: blur(24px);
        }

        .users-tabs button {
          min-height: 38px;
          padding: 8px 14px;
          border: 1px solid transparent;
          border-radius: 10px;
          background: transparent;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .users-tabs button.active,
        .users-tabs button:hover {
          color: var(--text-primary);
          background: rgba(128, 0, 32, 0.16);
          border-color: rgba(128, 0, 32, 0.28);
        }

        .platform-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .platform-stat-card,
        .platform-table-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(19, 23, 30, 0.84);
          border: 1px solid var(--border);
          border-radius: 24px;
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-soft);
        }

        .platform-stat-card {
          padding: 20px;
        }

        .platform-stat-card span {
          display: block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .platform-stat-card strong {
          color: var(--text-primary);
          font-size: 28px;
        }

        .platform-table-card {
          padding: 18px;
        }

        .platform-table-wrap {
          overflow-x: auto;
        }

        .platform-table {
          width: 100%;
          min-width: 1020px;
          border-collapse: collapse;
        }

        .platform-table th,
        .platform-table td {
          padding: 14px 12px;
          text-align: left;
          border-bottom: 1px solid var(--border);
          color: var(--text-primary);
          font-size: 14px;
        }

        .platform-table th {
          color: var(--text-secondary);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .platform-avatar {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          object-fit: cover;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .platform-user-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .platform-user-meta strong {
          color: var(--text-primary);
        }

        .platform-user-meta span {
          color: var(--text-secondary);
          font-size: 12px;
        }

        .plan-badge {
          display: inline-flex;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          font-size: 12px;
          font-weight: 700;
          text-transform: capitalize;
        }

        .plan-badge.free { background: rgba(148, 163, 184, 0.12); color: #cbd5e1; }
        .plan-badge.basic { background: rgba(59, 130, 246, 0.12); color: #93c5fd; }
        .plan-badge.standard { background: rgba(245, 158, 11, 0.12); color: #fbbf24; }
        .plan-badge.premium { background: rgba(128, 0, 32, 0.16); color: #f7d4da; }

        .platform-actions {
          position: relative;
        }

        .platform-menu {
          position: absolute;
          right: 0;
          top: 42px;
          z-index: 30;
          min-width: 210px;
          display: flex;
          flex-direction: column;
          padding: 8px;
          background: rgba(19, 23, 30, 0.98);
          border: 1px solid var(--border);
          border-radius: 14px;
          box-shadow: var(--shadow-soft);
        }

        .platform-menu button {
          padding: 10px 12px;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: var(--text-secondary);
          text-align: left;
          cursor: pointer;
        }

        .platform-menu button:hover {
          background: rgba(255,255,255,0.06);
          color: var(--text-primary);
        }

        .side-panel-overlay {
          position: fixed;
          inset: 0;
          z-index: 1900;
          background: rgba(7, 2, 3, 0.48);
          backdrop-filter: blur(8px);
        }

        .side-panel {
          position: absolute;
          top: 0;
          right: 0;
          width: min(420px, 100%);
          height: 100%;
          padding: 24px;
          background: rgba(19, 23, 30, 0.98);
          border-left: 1px solid var(--border);
          box-shadow: var(--shadow-soft);
          animation: slideInPanel 0.25s ease;
        }

        .side-panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }

        .side-panel-header h2 {
          color: var(--text-primary);
          font-size: 22px;
          margin-bottom: 6px;
        }

        .side-panel-header p,
        .side-item span,
        .side-item small {
          color: var(--text-secondary);
        }

        .side-panel-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .side-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.04);
        }

        .side-item img {
          width: 80px;
          height: 56px;
          border-radius: 12px;
          object-fit: cover;
        }

        .side-item strong {
          display: block;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .side-item.purchase {
          justify-content: space-between;
        }

        .purchase-meta {
          text-align: right;
        }

        .refund-textarea {
          min-height: 110px;
          resize: vertical;
        }

        @keyframes slideInPanel {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
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
