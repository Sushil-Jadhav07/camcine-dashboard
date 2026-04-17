import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  Filter,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { UserRole } from '../constants/sections';

const earningsData = [
  { id: 1, date: '2024-03-15', amount: 2450.00, status: 'Paid', method: 'Bank Transfer', project: 'Film Project A' },
  { id: 2, date: '2024-03-14', amount: 1800.00, status: 'Pending', method: 'PayPal', project: 'Series Episode 3' },
  { id: 3, date: '2024-03-13', amount: 3200.00, status: 'Processing', method: 'Wire Transfer', project: 'Documentary B' },
  { id: 4, date: '2024-03-12', amount: 1500.00, status: 'Paid', method: 'Bank Transfer', project: 'Commercial C' },
  { id: 5, date: '2024-03-11', amount: 2800.00, status: 'Paid', method: 'PayPal', project: 'Film Project D' },
  { id: 6, date: '2024-03-10', amount: 1950.00, status: 'Pending', method: 'Bank Transfer', project: 'Music Video E' },
];

const monthlyEarnings = [
  { month: 'Jan', earnings: 8500 },
  { month: 'Feb', earnings: 9200 },
  { month: 'Mar', earnings: 10500 },
  { month: 'Apr', earnings: 11800 },
  { month: 'May', earnings: 12300 },
  { month: 'Jun', earnings: 14500 },
];

export function ManagerEarningsSection({ userId }) {
  const [earnings] = useState(earningsData);
  const [filteredEarnings, setFilteredEarnings] = useState(earningsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const itemsPerPage = 5;

  const totalEarnings = earnings
    .filter(e => e.status === 'Paid')
    .reduce((total, e) => total + e.amount, 0);

  const pendingEarnings = earnings
    .filter(e => e.status === 'Pending' || e.status === 'Processing')
    .reduce((total, e) => total + e.amount, 0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = earnings;

    if (searchQuery) {
      filtered = filtered.filter(earning =>
        earning.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        earning.method.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter(earning => 
        earning.status === selectedStatus
      );
    }

    setFilteredEarnings(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, earnings]);

  const totalPages = Math.ceil(filteredEarnings.length / itemsPerPage);
  const paginatedEarnings = filteredEarnings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="status-badge paid">
            <CheckCircle size={12} />
            Paid
          </span>
        );
      case 'Pending':
        return (
          <span className="status-badge pending">
            <Clock size={12} />
            Pending
          </span>
        );
      case 'Processing':
        return (
          <span className="status-badge processing">
            <Clock size={12} />
            Processing
          </span>
        );
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ['Date', 'Amount', 'Status', 'Method', 'Project'],
      ...filteredEarnings.map(e => [
        e.date,
        e.amount.toFixed(2),
        e.status,
        e.method,
        e.project
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'earnings.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <section className={`dashboard-shell manager-earnings-section ${isVisible ? 'visible' : ''}`}>
      <div className="shell-container earnings-container">
        {/* Header */}
        <div className="earnings-header">
          <div>
            <h1>Earnings Overview</h1>
            <p>Track your team's revenue and payment status.</p>
          </div>
          <button className="btn btn-primary" onClick={exportCSV}>
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon">
              <DollarSign size={24} />
            </div>
            <div className="summary-content">
              <span>Total Earnings</span>
              <strong>${totalEarnings.toFixed(2)}</strong>
              <small>+15.2% from last month</small>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">
              <Clock size={24} />
            </div>
            <div className="summary-content">
              <span>Pending Earnings</span>
              <strong>${pendingEarnings.toFixed(2)}</strong>
              <small>Awaiting payment</small>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">
              <TrendingUp size={24} />
            </div>
            <div className="summary-content">
              <span>Growth Rate</span>
              <strong>+23.5%</strong>
              <small>Year over year</small>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <Filter className="search-icon" />
            <input
              type="text"
              className="input"
              placeholder="Search earnings..."
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
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
            </select>
          </div>

          <div className="filter-group">
            <select 
              className="filter-select"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Earnings Table */}
        <div className="earnings-table">
          <div className="table-header">
            <div>Date</div>
            <div>Project</div>
            <div>Amount</div>
            <div>Method</div>
            <div>Status</div>
          </div>
          
          {paginatedEarnings.map((earning) => (
            <div key={earning.id} className="table-row">
              <div className="earning-date">{earning.date}</div>
              <div className="earning-project">{earning.project}</div>
              <div className="earning-amount">${earning.amount.toFixed(2)}</div>
              <div className="earning-method">{earning.method}</div>
              <div className="earning-status">
                {getStatusBadge(earning.status)}
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
            </button>
          </div>
        )}
      </div>

      <style>{`
        .manager-earnings-section {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .manager-earnings-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .earnings-container {
          max-width: 1480px;
        }

        .earnings-header {
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

        .earnings-header h1 {
          font-size: 36px;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .earnings-header p {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .summary-card {
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

        .summary-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: rgba(128, 0, 32, 0.1);
          color: var(--accent);
        }

        .summary-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .summary-content span {
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .summary-content strong {
          color: var(--text-primary);
          font-size: 24px;
          font-weight: 700;
        }

        .summary-content small {
          color: var(--accent);
          font-size: 12px;
          font-weight: 500;
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

        .earnings-table {
          background: var(--panel-glass);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 20px;
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-soft);
          overflow-x: auto;
        }

        .table-header {
          display: grid;
          grid-template-columns: 1fr 1.5fr 1fr 1.2fr 1fr;
          gap: 16px;
          padding: 16px;
          border-bottom: 1px solid var(--border);
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .table-row {
          display: grid;
          grid-template-columns: 1fr 1.5fr 1fr 1.2fr 1fr;
          gap: 16px;
          padding: 16px;
          border-bottom: 1px solid var(--border);
          color: var(--text-primary);
          font-size: 14px;
          transition: background 0.2s ease;
        }

        .table-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .earning-amount {
          font-weight: 600;
          color: var(--accent);
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

        .status-badge.paid {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .status-badge.pending {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .status-badge.processing {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
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
          .earnings-header {
            flex-direction: column;
            align-items: stretch;
          }

          .summary-cards {
            grid-template-columns: 1fr;
          }
          
          .filters-bar {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-box {
            min-width: auto;
          }
          
          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          
          .table-header > div:not(:first-child),
          .table-row > div:not(:first-child) {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
