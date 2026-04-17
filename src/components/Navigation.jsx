import { useMemo, useState } from 'react';
import {
  Bell,
  CreditCard,
  Film,
  LayoutDashboard,
  ListMusic,
  LogOut,
  Menu,
  Moon,
  Newspaper,
  Receipt,
  Settings,
  Sun,
  UserCircle,
  Users,
  Wallet,
  X,
  Clock,
  BarChart3,
} from 'lucide-react';
import { Section, UserRole } from '../constants/sections';

const navItemsByRole = {
  [UserRole.ADMIN]: [
    { id: Section.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: Section.CONTENT, label: 'Library', icon: Film },
    { id: Section.ACTOR_QUEUE, label: 'Casting', icon: Clock },
    { id: Section.SONGS, label: 'Songs', icon: ListMusic },
    { id: Section.NEWS, label: 'News', icon: Newspaper },
    { id: Section.USERS, label: 'Users', icon: Users },
    { id: Section.SUBSCRIPTIONS, label: 'Subscriptions', icon: CreditCard },
    { id: Section.PAYMENTS, label: 'Payments', icon: Receipt },
    { id: Section.ANALYTICS, label: 'Analytics', icon: BarChart3 },
    { id: Section.NOTIFICATIONS, label: 'Alerts', icon: Bell },
    { id: Section.SETTINGS, label: 'Settings', icon: Settings },
  ],
  [UserRole.MANAGER]: [
    { id: Section.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: Section.CONTENT, label: 'Catalog', icon: Film },
    { id: Section.SONGS, label: 'Songs', icon: ListMusic },
    { id: Section.MANAGER_EARNINGS, label: 'Earnings', icon: Wallet },
    { id: Section.SETTINGS, label: 'Settings', icon: Settings },
  ],
  [UserRole.USER]: [
    { id: Section.SUBSCRIPTIONS, label: 'Subscriptions', icon: CreditCard },
    { id: Section.PAYMENTS, label: 'Receipts', icon: Receipt },
    { id: Section.SETTINGS, label: 'Settings', icon: Settings },
  ],
  [UserRole.ACTOR]: [
    { id: Section.ACTOR_PORTAL, label: 'Profile', icon: UserCircle },
    { id: Section.SETTINGS, label: 'Settings', icon: Settings },
  ],
};

export function Navigation({ currentSection, onNavigate, onLogout, userRole, userId, theme, onToggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = useMemo(() => (userRole ? navItemsByRole[userRole] ?? [] : []), [userRole]);
  const ThemeIcon = theme === 'dark' ? Sun : Moon;

  const handleNavigate = (section) => {
    onNavigate(section);
    setMobileOpen(false);
  };

  return (
    <nav>
      <div className="app-mobile-bar">
        <button className="nav-icon-button" type="button" onClick={() => setMobileOpen((open) => !open)}>
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <strong>Camcine</strong>
        <button className="nav-icon-button" type="button" onClick={onToggleTheme}>
          <ThemeIcon size={18} />
        </button>
      </div>

      {mobileOpen && <button className="app-sidebar-backdrop" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}

      <aside className={`app-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="app-sidebar-shell">
          <div className="app-sidebar-brand">
            <div className="app-logo-mark">
              <Film size={18} />
            </div>
          </div>

          <div className="app-sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`app-sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavigate(item.id)}
                  title={item.label}
                >
                  <Icon size={18} />
                </button>
              );
            })}
          </div>

          <div className="app-sidebar-footer">
            <button type="button" className="app-sidebar-link" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={onToggleTheme}>
              <ThemeIcon size={18} />
            </button>
            <button type="button" className="app-sidebar-link" title="Logout" onClick={onLogout}>
              <LogOut size={18} />
            </button>
            <div className="app-sidebar-avatar" title={userId || 'Guest'}>
              {(userId || 'G').slice(0, 1).toUpperCase()}
            </div>
          </div>
        </div>
      </aside>

      <style>{`
        .app-mobile-bar {
          position: fixed;
          top: 14px;
          left: 14px;
          right: 14px;
          z-index: 1200;
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-radius: 18px;
          background: var(--panel);
          border: 1px solid var(--line);
          box-shadow: var(--shadow-soft);
          backdrop-filter: blur(14px);
        }

        .nav-icon-button {
          width: 38px;
          height: 38px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: var(--surface-2);
          color: var(--text-primary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .app-sidebar-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1100;
          border: none;
          background: rgba(15, 15, 19, 0.55);
          backdrop-filter: blur(6px);
        }

        .app-sidebar {
          position: fixed;
          inset: 20px auto 20px 20px;
          width: 72px;
          z-index: 1150;
        }

        .app-sidebar-shell {
          height: 100%;
          display: grid;
          grid-template-rows: auto 1fr auto;
          gap: 20px;
          padding: 14px 10px;
          border-radius: 24px;
          background: var(--panel);
          border: 1px solid var(--line);
          box-shadow: var(--shadow-soft);
          backdrop-filter: blur(16px);
        }

        .app-sidebar-brand {
          display: grid;
          place-items: center;
        }

        .app-logo-mark {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: linear-gradient(180deg, var(--accent-strong), var(--accent));
          color: #fff;
        }

        .app-sidebar-nav,
        .app-sidebar-footer {
          display: grid;
          gap: 10px;
          justify-items: center;
        }

        .app-sidebar-footer {
          align-content: end;
        }

        .app-sidebar-link {
          width: 44px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: 0.2s ease;
        }

        .app-sidebar-link:hover,
        .app-sidebar-link.active {
          background: var(--surface-2);
          color: var(--accent);
          border-color: var(--line-strong);
        }

        .app-sidebar-avatar {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: var(--surface-2);
          border: 1px solid var(--line);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 700;
        }

        @media (max-width: 1100px) {
          .app-mobile-bar {
            display: flex;
          }

          .app-sidebar {
            inset: 70px auto 14px 14px;
            transform: translateX(-115%);
            transition: transform 0.24s ease;
          }

          .app-sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  );
}
