import { useState } from 'react';
import {
  LayoutDashboard,
  Film,
  Users,
  CreditCard,
  Receipt,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import type { Section, UserRole } from '../App';

interface NavigationProps {
  currentSection: Section;
  onNavigate: (section: Section) => void;
  onLogout: () => void;
  userRole: UserRole | null;
  userId: string;
}

const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'content', label: 'Content', icon: Film },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
  { id: 'payments', label: 'Payments', icon: Receipt },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  vendor: 'Vendor',
  user: 'User',
};

export function Navigation({ currentSection, onNavigate, onLogout, userRole, userId }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (section: Section) => {
    onNavigate(section);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sidebar-root">
      <div className="sidebar-mobile-bar">
        <div className="sidebar-logo">
          <Film className="sidebar-logo-icon" />
          <span className="sidebar-logo-text">StreamFlow</span>
        </div>
        <button
          className="sidebar-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <button
          className="sidebar-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <div className={`sidebar-panel ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-panel-inner">
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <Film className="sidebar-logo-icon" />
              <span className="sidebar-logo-text">StreamFlow</span>
            </div>
          </div>

          <div className="sidebar-search">
            <Search className="sidebar-search-icon" />
            <input
              type="text"
              placeholder="Search content, users, transactions..."
              className="sidebar-search-input"
            />
          </div>

          <div className="sidebar-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <Icon className="sidebar-link-icon" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="sidebar-footer">
            <button className="sidebar-action-btn" aria-label="Notifications">
              <Bell className="sidebar-action-icon" />
              <span className="notification-dot" />
              <span>Notifications</span>
            </button>
            <button className="sidebar-action-btn" aria-label="Logout" onClick={onLogout}>
              <LogOut className="sidebar-action-icon" />
              <span>Logout</span>
            </button>
            <div className="sidebar-user">
              <div className="sidebar-avatar">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                  alt="Admin"
                />
              </div>
              <div className="sidebar-user-meta">
                <span className="sidebar-user-name">{userId || 'Guest'}</span>
                <span className="sidebar-user-role">{userRole ? roleLabels[userRole] : 'Not signed in'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .sidebar-root {
          --sidebar-width: 260px;
          --sidebar-mobile-bar: 56px;
        }

        .sidebar-mobile-bar {
          position: fixed;
          top: 14px;
          left: 14px;
          right: 14px;
          height: var(--sidebar-mobile-bar);
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          background: linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02)), rgba(19, 23, 30, 0.92);
          backdrop-filter: blur(26px);
          border: 1px solid var(--border);
          border-radius: 18px;
          box-shadow: var(--shadow-soft);
          z-index: 1100;
        }

        .sidebar-mobile-toggle {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border);
          color: var(--text-primary);
          cursor: pointer;
        }

        .sidebar-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(7, 2, 3, 0.62);
          border: none;
          z-index: 1050;
          backdrop-filter: blur(8px);
        }

        .sidebar-panel {
          position: fixed;
          top: 18px;
          left: 18px;
          bottom: 18px;
          width: var(--sidebar-width);
          background: linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02)), rgba(18, 22, 29, 0.9);
          backdrop-filter: blur(28px);
          border: 1px solid var(--border);
          border-radius: 28px;
          box-shadow: var(--shadow-soft);
          z-index: 1100;
          transform: translateX(0);
          transition: transform 0.24s ease;
          overflow: hidden;
        }

        .sidebar-panel-inner {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 24px 18px 18px;
          gap: 22px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .sidebar-logo-icon {
          width: 30px;
          height: 30px;
          color: var(--accent);
          padding: 7px;
          background: rgba(128, 0, 32, 0.12);
          border-radius: 14px;
          box-shadow: none;
        }

        .sidebar-logo-text {
          font-family: 'Sora', sans-serif;
          font-size: 19px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .sidebar-search {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .sidebar-search-icon {
          width: 18px;
          height: 18px;
          color: var(--text-secondary);
        }

        .sidebar-search-input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
        }

        .sidebar-search-input::placeholder {
          color: var(--text-secondary);
        }

        .sidebar-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 14px;
          border-radius: 18px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .sidebar-link:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255,255,255,0.08);
        }

        .sidebar-link.active {
          color: var(--text-primary);
          background: rgba(128, 0, 32, 0.12);
          border-color: rgba(128, 0, 32, 0.22);
          box-shadow: none;
        }

        .sidebar-link-icon {
          width: 18px;
          height: 18px;
        }

        .sidebar-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.04);
        }

        .sidebar-action-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          text-align: left;
        }

        .sidebar-action-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255,255,255,0.08);
        }

        .sidebar-action-icon {
          width: 18px;
          height: 18px;
        }

        .notification-dot {
          position: absolute;
          top: 10px;
          left: 22px;
          width: 7px;
          height: 7px;
          background: var(--accent);
          border-radius: 50%;
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
          border: 1px solid rgba(255,255,255,0.07);
        }

        .sidebar-avatar {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid var(--border);
        }

        .sidebar-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sidebar-user-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .sidebar-user-role {
          font-size: 11px;
          color: var(--text-secondary);
        }

        @media (max-width: 1024px) {
          .sidebar-mobile-bar {
            display: flex;
          }

          .sidebar-panel {
            transform: translateX(-100%);
            top: 84px;
            left: 14px;
            right: 14px;
            bottom: 14px;
            width: auto;
            height: auto;
          }

          .sidebar-panel.open {
            transform: translateX(0);
          }

          .sidebar-panel-inner {
            padding: 20px 16px 16px;
          }
        }

        @media (max-width: 768px) {
          .sidebar-logo-text {
            font-size: 18px;
          }
        }
      `}</style>
    </nav>
  );
}
