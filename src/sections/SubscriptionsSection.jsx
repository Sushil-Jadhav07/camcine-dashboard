import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Users,
  TrendingUp,
  Crown,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Star,
  Zap
} from 'lucide-react';

const mockSubscriptions = [
  { id: 1, name: 'John Smith', email: 'john@email.com', plan: 'Premium', status: 'active', price: 19.99, nextBilling: '2024-04-15', startDate: '2023-04-15', autoRenew: true, avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=800020&color=fff' },
  { id: 2, name: 'Emma Wilson', email: 'emma@email.com', plan: 'Standard', status: 'active', price: 14.99, nextBilling: '2024-04-15', startDate: '2023-06-20', autoRenew: true, avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=800020&color=fff' },
  { id: 3, name: 'Michael Brown', email: 'michael@email.com', plan: 'Basic', status: 'active', price: 9.99, nextBilling: '2024-04-15', startDate: '2023-09-10', autoRenew: false, avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=800020&color=fff' },
  { id: 4, name: 'Lisa Davis', email: 'lisa@email.com', plan: 'Premium', status: 'cancelled', price: 19.99, nextBilling: '-', startDate: '2023-02-15', autoRenew: false, avatar: 'https://ui-avatars.com/api/?name=Lisa+Davis&background=800020&color=fff' },
  { id: 5, name: 'James Taylor', email: 'james@email.com', plan: 'Standard', status: 'active', price: 14.99, nextBilling: '2024-04-15', startDate: '2023-11-05', autoRenew: true, avatar: 'https://ui-avatars.com/api/?name=James+Taylor&background=800020&color=fff' },
  { id: 6, name: 'Sarah Chen', email: 'sarah@email.com', plan: 'Basic', status: 'active', price: 9.99, nextBilling: '2024-04-15', startDate: '2023-12-01', autoRenew: true, avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=800020&color=fff' },
];

const mockPlans = [
  { id: 'basic', name: 'Basic', price: 9.99, features: ['HD Streaming', '1 Device', 'Basic Content'], color: '#3b82f6', icon: Star },
  { id: 'standard', name: 'Standard', price: 14.99, features: ['4K Streaming', '2 Devices', 'Premium Content', 'Offline Downloads'], color: '#f59e0b', icon: Zap },
  { id: 'premium', name: 'Premium', price: 19.99, features: ['4K Streaming', '4 Devices', 'All Content', 'Offline Downloads', 'Early Access'], color: '#800020', icon: Crown },
];

export function SubscriptionsSection() {
  const [subscriptions] = useState(mockSubscriptions);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState(mockSubscriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('svod');
  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const itemsPerPage = 6;

  const totalMRR = mockSubscriptions
    .filter(sub => sub.status === 'active')
    .reduce((total, sub) => total + sub.price, 0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = subscriptions;

    if (searchQuery) {
      filtered = filtered.filter(sub =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter(sub => 
        sub.status === selectedStatus.toLowerCase()
      );
    }

    setFilteredSubscriptions(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, subscriptions]);

  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const paginatedSubscriptions = filteredSubscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="status-badge active">
            <CheckCircle size={12} />
            Active
          </span>
        );
      case 'cancelled':
        return (
          <span className="status-badge cancelled">
            <XCircle size={12} />
            Cancelled
          </span>
        );
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className={`subscriptions-section ${isVisible ? 'visible' : ''}`}>
      <div className="subscriptions-container">
        {/* Header */}
        <div className="subscriptions-header">
          <div>
            <h1>Subscriptions</h1>
            <p>Plans, pricing, and growth at a glance.</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} />
            Create Plan
          </button>
        </div>

        {/* Revenue Overview */}
        <div className="revenue-overview">
          <div className="revenue-card">
            <div className="revenue-icon">
              <TrendingUp size={24} />
            </div>
            <div className="revenue-content">
              <span>Monthly Recurring Revenue</span>
              <strong>${(totalMRR / 1000).toFixed(1)}K</strong>
              <small>+12% from last month</small>
            </div>
          </div>
          <div className="revenue-card">
            <div className="revenue-icon">
              <Users size={24} />
            </div>
            <div className="revenue-content">
              <span>Total Subscribers</span>
              <strong>{subscriptions.filter(s => s.status === 'active').length}</strong>
              <small>+23 this month</small>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="subscription-tabs">
          <button 
            className={`tab-button ${activeTab === 'svod' ? 'active' : ''}`}
            onClick={() => setActiveTab('svod')}
          >
            Plans (SVOD)
          </button>
          <button 
            className={`tab-button ${activeTab === 'tvod' ? 'active' : ''}`}
            onClick={() => setActiveTab('tvod')}
          >
            Per-Episode Pricing (TVOD)
          </button>
          <button 
            className={`tab-button ${activeTab === 'avod' ? 'active' : ''}`}
            onClick={() => setActiveTab('avod')}
          >
            Free Tier (AVOD)
          </button>
        </div>

        {activeTab === 'svod' && (
          <>
            {/* Filters */}
            <div className="filters-bar">
              <div className="search-box">
                <Search className="search-icon" />
                <input
                  type="text"
                  className="input"
                  placeholder="Search subscribers..."
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
                  <option value="Active">Active</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Subscriptions List */}
            <div className="subscriptions-list">
              {paginatedSubscriptions.map((subscriber) => (
                <div key={subscriber.id} className="subscriber-card">
                  <div className="subscriber-avatar">
                    <img src={subscriber.avatar} alt={subscriber.name} />
                  </div>
                  <div className="subscriber-info">
                    <div className="subscriber-name">{subscriber.name}</div>
                    <div className="subscriber-email">{subscriber.email}</div>
                    <div className="subscriber-plan">{subscriber.plan}</div>
                  </div>
                  <div className="subscriber-details">
                    <div className="subscriber-price">${subscriber.price}/mo</div>
                    <div className="subscriber-billing">Next: {subscriber.nextBilling}</div>
                    <div className="subscriber-status">
                      {getStatusBadge(subscriber.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
          </>
        )}

        {activeTab === 'tvod' && (
          <div className="tvod-section">
            <h2>Per-Episode Pricing (TVOD)</h2>
            <div className="pricing-grid">
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Standard Episode</h3>
                  <div className="price">$4.99</div>
                </div>
                <div className="pricing-features">
                  <ul>
                    <li>HD Quality</li>
                    <li>48-hour Rental</li>
                    <li>Single Device</li>
                  </ul>
                </div>
              </div>
              <div className="pricing-card featured">
                <div className="pricing-header">
                  <h3>Premium Episode</h3>
                  <div className="price">$9.99</div>
                </div>
                <div className="pricing-features">
                  <ul>
                    <li>4K Quality</li>
                    <li>72-hour Rental</li>
                    <li>Multi-device</li>
                    <li>Download Available</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'avod' && (
          <div className="avod-section">
            <h2>Free Tier (AVOD)</h2>
            <div className="avod-content">
              <div className="avod-stats">
                <div className="stat-card">
                  <div className="stat-icon">
                    <Users size={32} />
                  </div>
                  <div className="stat-content">
                    <strong>2.3M</strong>
                    <span>Active Users</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <DollarSign size={32} />
                  </div>
                  <div className="stat-content">
                    <strong>$45.2K</strong>
                    <span>Monthly Ad Revenue</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <TrendingUp size={32} />
                  </div>
                  <div className="stat-content">
                    <strong>18.5%</strong>
                    <span>Engagement Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Plan Modal */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Create New Plan</h2>
                <button 
                  className="btn-icon"
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-content">
                <div className="plans-grid">
                  {mockPlans.map((plan) => {
                    const Icon = plan.icon;
                    return (
                      <div key={plan.id} className="plan-card" style={{ borderColor: plan.color }}>
                        <div className="plan-header">
                          <div className="plan-icon" style={{ background: plan.color }}>
                            <Icon size={24} />
                          </div>
                          <h3>{plan.name}</h3>
                          <div className="plan-price">${plan.price}/mo</div>
                        </div>
                        <div className="plan-features">
                          <ul>
                            {plan.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                        <button className="btn btn-primary">Select Plan</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .subscriptions-section {
          min-height: 100vh;
          padding: 28px 0 56px;
          background: var(--bg-primary);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .subscriptions-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .subscriptions-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .subscriptions-header {
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

        .subscriptions-header h1 {
          font-size: 36px;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .subscriptions-header p {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .revenue-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .revenue-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          border-radius: 20px;
          border: 1px solid var(--border);
          background: var(--panel-glass);
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-soft);
        }

        .revenue-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: rgba(128, 0, 32, 0.1);
          color: var(--accent);
        }

        .revenue-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .revenue-content span {
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .revenue-content strong {
          color: var(--text-primary);
          font-size: 28px;
          font-weight: 700;
        }

        .revenue-content small {
          color: var(--accent);
          font-size: 12px;
          font-weight: 500;
        }

        .subscription-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 22px;
          padding: 10px;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: var(--panel-glass-soft);
          backdrop-filter: blur(24px);
        }

        .tab-button {
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

        .tab-button.active,
        .tab-button:hover {
          color: var(--text-primary);
          background: rgba(128, 0, 32, 0.16);
          border-color: rgba(128, 0, 32, 0.28);
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

        .subscriptions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .subscriber-card {
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

        .subscriber-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .subscriber-avatar {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid var(--border);
        }

        .subscriber-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .subscriber-info {
          flex: 1;
        }

        .subscriber-name {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .subscriber-email {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 4px;
        }

        .subscriber-plan {
          color: var(--accent);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .subscriber-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: right;
        }

        .subscriber-price {
          font-weight: 600;
          color: var(--text-primary);
        }

        .subscriber-billing {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-badge.active {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .status-badge.cancelled {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
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

        .tvod-section, .avod-section {
          background: var(--panel-glass);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 32px;
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-soft);
        }

        .tvod-section h2, .avod-section h2 {
          color: var(--text-primary);
          font-size: 24px;
          margin-bottom: 24px;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .pricing-card {
          padding: 24px;
          border: 2px solid var(--border);
          border-radius: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .pricing-card.featured {
          border-color: var(--accent);
          transform: scale(1.05);
        }

        .pricing-header {
          margin-bottom: 20px;
        }

        .pricing-header h3 {
          color: var(--text-primary);
          font-size: 20px;
          margin-bottom: 8px;
        }

        .plan-price {
          font-size: 32px;
          font-weight: 700;
          color: var(--accent);
        }

        .plan-features ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .plan-features li {
          padding: 8px 0;
          color: var(--text-secondary);
          font-size: 14px;
          border-bottom: 1px solid var(--border);
        }

        .plan-features li:last-child {
          border-bottom: none;
        }

        .avod-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
        }

        .stat-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background: rgba(128, 0, 32, 0.1);
          color: var(--accent);
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-content strong {
          color: var(--text-primary);
          font-size: 24px;
          font-weight: 700;
        }

        .stat-content span {
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
          max-width: 900px;
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
          .revenue-overview {
            grid-template-columns: 1fr;
          }
          
          .subscription-tabs {
            flex-direction: column;
          }
          
          .filters-bar {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-box {
            min-width: auto;
          }
          
          .subscriber-card {
            flex-direction: column;
            text-align: center;
          }
          
          .subscriber-details {
            text-align: center;
          }
          
          .pricing-grid {
            grid-template-columns: 1fr;
          }
          
          .avod-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
