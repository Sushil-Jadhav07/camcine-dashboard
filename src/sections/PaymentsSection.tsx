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

interface Transaction {
  id: string;
  date: string;
  customer: string;
  email: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  method: string;
  plan: string;
}

const mockTransactions: Transaction[] = [
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
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactions);
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
      filtered = filtered.filter(txn =>
        txn.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter(txn => txn.status === selectedStatus.toLowerCase());
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, transactions]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalRefunds = transactions
    .filter(t => t.status === 'refunded')
    .reduce((acc, t) => acc + t.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-success"><CheckCircle /> Completed</span>;
      case 'pending':
        return <span className="badge badge-warning"><Clock /> Pending</span>;
      case 'failed':
        return <span className="badge badge-error"><XCircle /> Failed</span>;
      case 'refunded':
        return <span className="badge badge-neutral"><ArrowDownRight /> Refunded</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <section className="payments-section">
      <div className="payments-container">
        {/* Header */}
        <div 
          className="payments-header"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease'
          }}
        >
          <div>
            <h1>Payments</h1>
            <p>Invoices, refunds, and payout tracking.</p>
          </div>
          <button className="btn btn-secondary">
            <Download /> Export CSV
          </button>
        </div>

        {/* Summary Cards */}
        <div 
          className="summary-grid"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s'
          }}
        >
          <div className="summary-card">
            <div className="summary-icon green">
              <ArrowUpRight />
            </div>
            <div className="summary-content">
              <span className="summary-label">Total Revenue</span>
              <span className="summary-value">${totalRevenue.toFixed(2)}</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon red">
              <ArrowDownRight />
            </div>
            <div className="summary-content">
              <span className="summary-label">Total Refunds</span>
              <span className="summary-value">${totalRefunds.toFixed(2)}</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon blue">
              <CreditCard />
            </div>
            <div className="summary-content">
              <span className="summary-label">Transactions</span>
              <span className="summary-value">{transactions.length}</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon purple">
              <DollarSign />
            </div>
            <div className="summary-content">
              <span className="summary-label">Net Revenue</span>
              <span className="summary-value">${(totalRevenue - totalRefunds).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div 
          className="filters-bar"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s'
          }}
        >
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

        {/* Transactions Table */}
        <div 
          className="transactions-card"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s'
          }}
        >
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((txn) => (
                  <tr key={txn.id}>
                    <td className="txn-id">{txn.id}</td>
                    <td className="txn-date">{txn.date}</td>
                    <td>
                      <div className="customer-cell">
                        <span className="customer-name">{txn.customer}</span>
                        <span className="customer-email">{txn.email}</span>
                      </div>
                    </td>
                    <td className="txn-plan">{txn.plan}</td>
                    <td className="txn-amount">${txn.amount.toFixed(2)}</td>
                    <td>{getStatusBadge(txn.status)}</td>
                    <td className="txn-method">{txn.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
      </div>

      <style>{`
        .payments-section {
          min-height: 100vh;
          padding: 28px 0 56px;
          background: var(--bg-primary);
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
          background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), rgba(50, 18, 23, 0.58);
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

        .payments-header .btn {
          gap: 8px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .summary-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), rgba(50, 18, 23, 0.58);
          border: 1px solid var(--border);
          border-radius: 24px;
          transition: all 0.3s ease;
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-soft);
        }

        .summary-card:hover {
          border-color: var(--accent);
          transform: translateY(-4px);
        }

        .summary-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .summary-icon.green {
          background: rgba(34, 197, 94, 0.1);
          color: var(--success);
        }

        .summary-icon.red {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }

        .summary-icon.blue {
          background: rgba(128, 0, 32, 0.12);
          color: var(--accent);
        }

        .summary-icon.purple {
          background: rgba(128, 0, 32, 0.14);
          color: var(--accent);
        }

        .summary-icon svg {
          width: 24px;
          height: 24px;
        }

        .summary-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .summary-label {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .summary-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .filters-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
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

        .transactions-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), rgba(50, 18, 23, 0.58);
          border: 1px solid var(--border);
          border-radius: 26px;
          overflow: hidden;
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-soft);
        }

        .table-container {
          overflow-x: auto;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th {
          text-align: left;
          padding: 16px 20px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border);
          white-space: nowrap;
        }

        .table td {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          color: var(--text-primary);
          font-size: 14px;
        }

        .table tr:hover td {
          background: rgba(247, 237, 239, 0.05);
        }

        .txn-id {
          font-family: monospace;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .txn-date {
          white-space: nowrap;
        }

        .customer-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .customer-name {
          font-weight: 500;
          color: var(--text-primary);
        }

        .customer-email {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .txn-plan {
          font-size: 13px;
          color: var(--accent);
        }

        .txn-amount {
          font-weight: 600;
          color: var(--text-primary);
        }

        .txn-method {
          font-size: 13px;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
        }

        .badge svg {
          width: 14px;
          height: 14px;
        }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px;
          border-top: 1px solid var(--border);
        }

        .pagination-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 10px;
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

        @media (max-width: 1024px) {
          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .summary-grid {
            grid-template-columns: 1fr;
          }

          .filters-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-group {
            flex-wrap: wrap;
          }

          .filter-select {
            flex: 1;
          }

          .table th,
          .table td {
            padding: 12px 16px;
          }
        }
      `}</style>
    </section>
  );
}
