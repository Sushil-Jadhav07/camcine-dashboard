import { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const mockTransactions = [
  { id: 'TXN-001234', date: '2024-03-15', customer: 'John Smith', email: 'john@email.com', amount: 14.99, status: 'completed', method: 'Visa •••• 4242', plan: 'Standard' },
  { id: 'TXN-001235', date: '2024-03-15', customer: 'Emma Wilson', email: 'emma@email.com', amount: 19.99, status: 'completed', method: 'Mastercard •••• 8888', plan: 'Premium' },
  { id: 'TXN-001236', date: '2024-03-14', customer: 'Michael Brown', email: 'michael@email.com', amount: 9.99, status: 'pending', method: 'Visa •••• 1234', plan: 'Basic' },
  { id: 'TXN-001237', date: '2024-03-14', customer: 'Lisa Davis', email: 'lisa@email.com', amount: 14.99, status: 'completed', method: 'Amex •••• 0005', plan: 'Standard' },
  { id: 'TXN-001238', date: '2024-03-13', customer: 'James Taylor', email: 'james@email.com', amount: 19.99, status: 'failed', method: 'Visa •••• 9999', plan: 'Premium' },
  { id: 'TXN-001239', date: '2024-03-13', customer: 'Sarah Chen', email: 'sarah@email.com', amount: 14.99, status: 'refunded', method: 'Mastercard •••• 7777', plan: 'Standard' },
  { id: 'TXN-001240', date: '2024-03-12', customer: 'David Martinez', email: 'david@email.com', amount: 9.99, status: 'completed', method: 'Visa •••• 5555', plan: 'Basic' },
  { id: 'TXN-001241', date: '2024-03-12', customer: 'Anna Taylor', email: 'anna@email.com', amount: 19.99, status: 'completed', method: 'Amex •••• 3333', plan: 'Premium' },
];

const statusFilters = ['All', 'Completed', 'Pending', 'Failed', 'Refunded'];

export function PaymentsSection() {
  const [transactions] = useState(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [dateRange, setDateRange] = useState('7d');
  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = transactions;

    if (searchQuery) {
      filtered = filtered.filter(transaction =>
        transaction.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter(transaction => 
        transaction.status === selectedStatus.toLowerCase()
      );
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, transactions]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="status-badge completed">
            <CheckCircle size={12} />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="status-badge pending">
            <Clock size={12} />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="status-badge failed">
            <XCircle size={12} />
            Failed
          </span>
        );
      case 'refunded':
        return (
          <span className="status-badge refunded">
            <ArrowDownRight size={12} />
            Refunded
          </span>
        );
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ['ID', 'Date', 'Customer', 'Email', 'Amount', 'Status', 'Method', 'Plan'],
      ...filteredTransactions.map(t => [
        t.id,
        t.date,
        t.customer,
        t.email,
        t.amount,
        t.status,
        t.method,
        t.plan
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`payments-section ${isVisible ? 'visible' : ''}`}>
      <div className="payments-container">
        {/* Header */}
        <div className="payments-header">
          <div>
            <h1>Payments</h1>
            <p>Invoices, refunds, and payout tracking.</p>
          </div>
          <button className="btn btn-secondary" onClick={exportCSV}>
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
              <span>Total Revenue</span>
              <strong>$1,234.56</strong>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">
              <ArrowUpRight size={24} />
            </div>
            <div className="summary-content">
              <span>This Month</span>
              <strong>$456.78</strong>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">
              <CreditCard size={24} />
            </div>
            <div className="summary-content">
              <span>Transactions</span>
              <strong>{filteredTransactions.length}</strong>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              className="input"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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

          <div className="filter-group">
            <Calendar className="filter-icon" />
            <select 
              className="filter-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="transactions-table">
          <div className="table-header">
            <div>Transaction ID</div>
            <div>Date</div>
            <div>Customer</div>
            <div>Email</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Method</div>
            <div>Plan</div>
          </div>
          
          {paginatedTransactions.map((transaction) => (
            <div key={transaction.id} className="table-row">
              <div className="transaction-id">{transaction.id}</div>
              <div className="transaction-date">{transaction.date}</div>
              <div className="transaction-customer">{transaction.customer}</div>
              <div className="transaction-email">{transaction.email}</div>
              <div className="transaction-amount">${transaction.amount}</div>
              <div className="transaction-status">
                {getStatusBadge(transaction.status)}
              </div>
              <div className="transaction-method">{transaction.method}</div>
              <div className="transaction-plan">{transaction.plan}</div>
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
      </div>

      <style>{`
        .payments-section {
          min-height: 100vh;
          padding: 28px 0 56px;
          background: var(--bg-primary);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .payments-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .payments-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .payments-header {
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

        .payments-header h1 {
          font-size: 36px;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .payments-header p {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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

        .transactions-table {
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
          grid-template-columns: 1fr 1fr 1.5fr 1.5fr 1fr 1fr 1.5fr 1fr;
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
          grid-template-columns: 1fr 1fr 1.5fr 1.5fr 1fr 1fr 1.5fr 1fr;
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

        .transaction-id {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 12px;
        }

        .transaction-amount {
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

        .status-badge.completed {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .status-badge.pending {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .status-badge.failed {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .status-badge.refunded {
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
          
          .table-header > div,
          .table-row > div {
            padding: 4px 0;
          }
          
          .table-header > div:not(:first-child),
          .table-row > div:not(:first-child) {
            display: none;
          }
          
          .table-header > div:first-child::after,
          .table-row > div:first-child::after {
            content: attr(data-label);
            font-weight: 600;
          }
        }
      `}</style>
    </div>
  );
}
