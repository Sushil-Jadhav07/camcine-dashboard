import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Film,
  IndianRupee,
  Radio,
  Receipt,
  Users,
  Wallet,
} from 'lucide-react';

interface managerEarningsSectionProps {
  userId: string;
}

type DateRange = 'This Week' | 'This Month' | 'This Year' | 'All Time';
type EarningsStatus = 'Paid' | 'Pending' | 'Processing';

interface EarningsMonth {
  month: string;
  tvod: number;
  avod: number;
  svod: number;
  status: EarningsStatus;
}

interface ContentPerformance {
  title: string;
  type: 'Movie' | 'Series' | 'Song';
  views: string;
  tvodSales: number;
  earnings: number;
}

const summaryCards = [
  {
    label: 'TVOD Revenue',
    amount: '₹8,450',
    source: 'From 423 episode purchases',
    trend: '+14.2%',
    icon: Receipt,
  },
  {
    label: 'AVOD Revenue',
    amount: '₹2,100',
    source: 'From 41,200 ad-supported views',
    trend: '+8.7%',
    icon: Radio,
  },
  {
    label: 'SVOD Share',
    amount: '₹1,900',
    source: 'Pro-rata from 890 subscriber views',
    trend: '+5.4%',
    icon: Users,
  },
];

const earningsHistory: EarningsMonth[] = [
  { month: 'April 2026', tvod: 8450, avod: 2100, svod: 1900, status: 'Pending' },
  { month: 'March 2026', tvod: 7920, avod: 1980, svod: 1760, status: 'Processing' },
  { month: 'February 2026', tvod: 6880, avod: 1720, svod: 1490, status: 'Paid' },
  { month: 'January 2026', tvod: 6240, avod: 1640, svod: 1320, status: 'Paid' },
  { month: 'December 2025', tvod: 7380, avod: 1890, svod: 1580, status: 'Paid' },
  { month: 'November 2025', tvod: 5820, avod: 1420, svod: 1210, status: 'Paid' },
  { month: 'October 2025', tvod: 5360, avod: 1340, svod: 1140, status: 'Paid' },
  { month: 'September 2025', tvod: 4910, avod: 1190, svod: 980, status: 'Paid' },
];

const contentPerformance: ContentPerformance[] = [
  { title: 'Crimson City', type: 'Movie', views: '14.8K', tvodSales: 138, earnings: 4820 },
  { title: 'Monsoon Notes', type: 'Song', views: '11.2K', tvodSales: 74, earnings: 2960 },
  { title: 'The Archive Room', type: 'Series', views: '8.6K', tvodSales: 66, earnings: 2180 },
  { title: 'Stage Lights', type: 'Movie', views: '7.9K', tvodSales: 51, earnings: 1640 },
  { title: 'Midnight Raag', type: 'Song', views: '5.7K', tvodSales: 39, earnings: 850 },
  { title: 'Hill Station Files', type: 'Series', views: '4.9K', tvodSales: 33, earnings: 720 },
];

const dateRanges: DateRange[] = ['This Week', 'This Month', 'This Year', 'All Time'];
const itemsPerPage = 5;

const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const getStatusBadge = (status: EarningsStatus) => (
  <span className={`earnings-status ${status.toLowerCase()}`}>
    {status === 'Paid' && <CheckCircle />}
    {status === 'Pending' && <Clock />}
    {status === 'Processing' && <ArrowUpRight />}
    {status}
  </span>
);

export function managerEarningsSection({ userId }: managerEarningsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>('This Month');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const totalPages = Math.ceil(earningsHistory.length / itemsPerPage);
  const paginatedHistory = earningsHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="manager-earnings-section">
      <div
        className="manager-earnings-bg"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(1.06)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      />
      <div className="manager-earnings-overlay" />

      <div className="manager-earnings-content">
        <div
          className="earnings-header"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <div>
            <h1>My Earnings</h1>
            <p>{userId ? `${userId}, review your revenue split and payout status.` : 'Review your revenue split and payout status.'}</p>
          </div>
          <div className="date-range-picker" aria-label="Date range">
            {dateRanges.map((range) => (
              <button
                key={range}
                className={`date-range-btn ${selectedRange === range ? 'active' : ''}`}
                onClick={() => setSelectedRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div
          className="earnings-summary-grid"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
          }}
        >
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="earnings-summary-card">
                <div className="earnings-summary-top">
                  <div className="earnings-summary-icon">
                    <Icon />
                  </div>
                  <span className="earnings-trend">
                    <ArrowUpRight />
                    {card.trend}
                  </span>
                </div>
                <span className="earnings-summary-label">{card.label}</span>
                <span className="earnings-summary-amount">{card.amount}</span>
                <span className="earnings-summary-source">{card.source}</span>
              </div>
            );
          })}
        </div>

        <div
          className="earnings-card"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s',
          }}
        >
          <div className="earnings-card-header">
            <div>
              <h3>Earnings History</h3>
              <p>{selectedRange} payout accounting across revenue streams.</p>
            </div>
          </div>
          <div className="earnings-table-wrap">
            <table className="earnings-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>TVOD</th>
                  <th>AVOD</th>
                  <th>SVOD</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHistory.map((row) => {
                  const total = row.tvod + row.avod + row.svod;
                  return (
                    <tr key={row.month}>
                      <td className="earnings-month">{row.month}</td>
                      <td>{formatCurrency(row.tvod)}</td>
                      <td>{formatCurrency(row.avod)}</td>
                      <td>{formatCurrency(row.svod)}</td>
                      <td className="earnings-total">{formatCurrency(total)}</td>
                      <td>{getStatusBadge(row.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="earnings-pagination">
            <button
              className="earnings-pagination-btn"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`earnings-pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="earnings-pagination-btn"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div
          className="earnings-card"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s',
          }}
        >
          <div className="earnings-card-header">
            <div>
              <h3>Content Performance</h3>
              <p>Titles earning the most across views, purchases, and pool share.</p>
            </div>
          </div>
          <div className="earnings-table-wrap">
            <table className="earnings-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Views</th>
                  <th>TVOD Sales</th>
                  <th>Your Earnings</th>
                </tr>
              </thead>
              <tbody>
                {contentPerformance.map((row) => (
                  <tr key={row.title}>
                    <td className="performance-title">{row.title}</td>
                    <td>
                      <span className="content-type">
                        {row.type === 'Song' ? <Radio /> : <Film />}
                        {row.type}
                      </span>
                    </td>
                    <td>
                      <span className="views-cell">
                        <Eye />
                        {row.views}
                      </span>
                    </td>
                    <td>{row.tvodSales}</td>
                    <td className="earnings-total">{formatCurrency(row.earnings)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className="payout-card"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s',
          }}
        >
          <div className="payout-card-header">
            <div className="payout-icon">
              <Wallet />
            </div>
            <div>
              <h3>Payout Info</h3>
              <p>Settlement details for your upcoming payout.</p>
            </div>
          </div>
          <div className="payout-grid">
            <div className="payout-item">
              <CalendarDays />
              <div>
                <span>Next payout</span>
                <strong>May 1, 2026</strong>
              </div>
            </div>
            <div className="payout-item">
              <CheckCircle />
              <div>
                <span>Minimum threshold</span>
                <strong>₹500 — You qualify</strong>
              </div>
            </div>
            <div className="payout-item">
              <IndianRupee />
              <div>
                <span>Payout method</span>
                <strong>Bank Transfer (XXXX1234)</strong>
              </div>
            </div>
            <div className="payout-item">
              <Receipt />
              <div>
                <span>TDS deducted at source</span>
                <strong>10%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .manager-earnings-section {
          position: relative;
          min-height: 100vh;
          padding: 28px 0 56px;
        }

        .manager-earnings-bg {
          position: fixed;
          inset: 0;
          background-image: url('/dashboard_bg.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .manager-earnings-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(22, 7, 9, 0.86) 0%,
            rgba(22, 7, 9, 0.93) 50%,
            rgba(22, 7, 9, 0.98) 100%
          );
        }

        .manager-earnings-content {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .earnings-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 26px;
          padding: 26px 30px;
          border: 1px solid var(--border);
          border-radius: 28px;
          background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), rgba(50, 18, 23, 0.58);
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

        .date-range-picker {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 14px;
          flex-wrap: wrap;
        }

        .date-range-btn {
          min-height: 36px;
          padding: 8px 12px;
          border: 1px solid transparent;
          border-radius: 8px;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .date-range-btn:hover {
          color: var(--text-primary);
          background: rgba(255,255,255,0.06);
        }

        .date-range-btn.active {
          color: var(--text-primary);
          background: rgba(128, 0, 32, 0.18);
          border-color: rgba(128, 0, 32, 0.32);
        }

        .earnings-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .earnings-summary-card,
        .earnings-card,
        .payout-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), rgba(50, 18, 23, 0.58);
          border: 1px solid var(--border);
          border-radius: 26px;
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-soft);
        }

        .earnings-summary-card {
          padding: 22px;
          transition: all 0.3s ease;
        }

        .earnings-summary-card:hover {
          border-color: var(--accent);
          transform: translateY(-4px);
        }

        .earnings-summary-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .earnings-summary-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          color: var(--accent);
          background: rgba(128, 0, 32, 0.1);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .earnings-summary-icon svg {
          width: 22px;
          height: 22px;
        }

        .earnings-trend {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--success);
          font-size: 13px;
          font-weight: 700;
        }

        .earnings-trend svg {
          width: 14px;
          height: 14px;
        }

        .earnings-summary-label {
          display: block;
          margin-bottom: 8px;
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .earnings-summary-amount {
          display: block;
          color: var(--text-primary);
          font-size: 34px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .earnings-summary-source {
          color: var(--text-secondary);
          font-size: 13px;
        }

        .earnings-card {
          padding: 0;
          margin-bottom: 32px;
          overflow: hidden;
        }

        .earnings-card-header {
          padding: 24px 26px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .earnings-card-header h3 {
          color: var(--text-primary);
          font-size: 18px;
          margin-bottom: 6px;
        }

        .earnings-card-header p {
          color: var(--text-secondary);
          font-size: 13px;
        }

        .earnings-table-wrap {
          overflow-x: auto;
        }

        .earnings-table {
          width: 100%;
          min-width: 780px;
          border-collapse: collapse;
        }

        .earnings-table th {
          padding: 16px 20px;
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-align: left;
          text-transform: uppercase;
          border-bottom: 1px solid var(--border);
          white-space: nowrap;
        }

        .earnings-table td {
          padding: 16px 20px;
          color: var(--text-primary);
          font-size: 14px;
          border-bottom: 1px solid var(--border);
          white-space: nowrap;
        }

        .earnings-table tr:hover td {
          background: rgba(247, 237, 239, 0.05);
        }

        .earnings-month,
        .performance-title {
          font-weight: 700;
        }

        .earnings-total {
          font-weight: 800;
          color: var(--text-primary);
        }

        .earnings-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .earnings-status svg {
          width: 14px;
          height: 14px;
        }

        .earnings-status.paid {
          background: rgba(34, 197, 94, 0.12);
          color: #86efac;
        }

        .earnings-status.pending {
          background: rgba(245, 158, 11, 0.12);
          color: #fbbf24;
        }

        .earnings-status.processing {
          background: rgba(59, 130, 246, 0.12);
          color: #93c5fd;
        }

        .earnings-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px;
          border-top: 1px solid var(--border);
        }

        .earnings-pagination-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-primary);
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .earnings-pagination-btn:hover:not(:disabled) {
          border-color: var(--accent);
          color: var(--accent);
        }

        .earnings-pagination-btn.active {
          background: linear-gradient(135deg, var(--accent-hover), var(--accent));
          border-color: var(--accent);
          color: white;
        }

        .earnings-pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .earnings-pagination-btn svg {
          width: 18px;
          height: 18px;
        }

        .content-type,
        .views-cell {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
        }

        .content-type svg,
        .views-cell svg {
          width: 16px;
          height: 16px;
          color: var(--accent);
        }

        .payout-card {
          padding: 26px;
        }

        .payout-card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .payout-icon {
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          color: var(--accent);
          background: rgba(128, 0, 32, 0.1);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .payout-icon svg {
          width: 24px;
          height: 24px;
        }

        .payout-card h3 {
          color: var(--text-primary);
          font-size: 18px;
          margin-bottom: 6px;
        }

        .payout-card p {
          color: var(--text-secondary);
          font-size: 13px;
        }

        .payout-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .payout-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 16px;
        }

        .payout-item svg {
          width: 20px;
          height: 20px;
          color: var(--accent);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .payout-item span {
          display: block;
          color: var(--text-secondary);
          font-size: 12px;
          margin-bottom: 5px;
        }

        .payout-item strong {
          color: var(--text-primary);
          font-size: 14px;
        }

        @media (max-width: 1200px) {
          .earnings-summary-grid {
            grid-template-columns: 1fr;
          }

          .payout-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 860px) {
          .earnings-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .date-range-picker {
            width: 100%;
          }
        }

        @media (max-width: 640px) {
          .earnings-header h1 {
            font-size: 30px;
          }

          .date-range-btn {
            flex: 1;
          }

          .payout-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
