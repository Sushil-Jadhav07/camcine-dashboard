import { useState } from 'react';
import {
  BarChart3,
  LayoutDashboard,
  Film,
  ListMusic,
  Newspaper,
  Users,
  CreditCard,
  Receipt,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  UserCircle,
  Wallet,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Section, UserRole } from '../constants/sections';

const adminNavItems = [
  { id: Section.DASHBOARD,   label: 'Dashboard',    icon: LayoutDashboard, group: 'main' },
  { id: Section.CONTENT,     label: 'Content',      icon: Film,            group: 'main' },
  { id: Section.ACTOR_QUEUE, label: 'Actor Queue',  icon: Clock,           group: 'main' },
  { id: Section.SONGS,       label: 'Songs',        icon: ListMusic,       group: 'main' },
  { id: Section.NEWS,        label: 'News',         icon: Newspaper,       group: 'main' },
  { id: Section.USERS,       label: 'Users',        icon: Users,           group: 'manage' },
  { id: Section.SUBSCRIPTIONS, label: 'Subscriptions', icon: CreditCard,  group: 'manage' },
  { id: Section.PAYMENTS,    label: 'Payments',     icon: Receipt,         group: 'manage' },
  { id: Section.ANALYTICS,   label: 'Analytics',   icon: BarChart3,       group: 'manage' },
  { id: Section.NOTIFICATIONS, label: 'Notifications', icon: Bell,        group: 'system' },
  { id: Section.SETTINGS,    label: 'Settings',    icon: Settings,        group: 'system' },
];

const managerNavItems = [
  { id: Section.DASHBOARD,      label: 'Dashboard',    icon: LayoutDashboard, group: 'main' },
  { id: Section.CONTENT,        label: 'My Content',   icon: Film,            group: 'main' },
  { id: Section.SONGS,          label: 'My Songs',     icon: ListMusic,       group: 'main' },
  { id: Section.MANAGER_EARNINGS, label: 'My Earnings', icon: Wallet,         group: 'main' },
  { id: Section.SETTINGS,       label: 'Settings',     icon: Settings,        group: 'system' },
];

const userNavItems = [
  { id: Section.SUBSCRIPTIONS, label: 'Subscriptions', icon: CreditCard, group: 'main' },
  { id: Section.PAYMENTS,      label: 'My Purchases',  icon: Receipt,    group: 'main' },
  { id: Section.SETTINGS,      label: 'Settings',      icon: Settings,   group: 'system' },
];

const actorNavItems = [
  { id: Section.ACTOR_PORTAL, label: 'My Profile', icon: UserCircle, group: 'main' },
  { id: Section.SETTINGS,     label: 'Settings',   icon: Settings,   group: 'system' },
];

const navItemsByRole = {
  [UserRole.ADMIN]:   adminNavItems,
  [UserRole.MANAGER]: managerNavItems,
  [UserRole.USER]:    userNavItems,
  [UserRole.ACTOR]:   actorNavItems,
};

const roleLabels = {
  [UserRole.ADMIN]:   'Administrator',
  [UserRole.MANAGER]: 'Manager',
  [UserRole.USER]:    'User',
  [UserRole.ACTOR]:   'Actor',
};

const roleBadgeColors = {
  [UserRole.ADMIN]:   { bg: 'rgba(204,26,26,0.15)',   color: '#ff6b6b', border: 'rgba(204,26,26,0.30)' },
  [UserRole.MANAGER]: { bg: 'rgba(245,158,11,0.12)',  color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
  [UserRole.USER]:    { bg: 'rgba(59,130,246,0.12)',  color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
  [UserRole.ACTOR]:   { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
};

const groupLabels = {
  main:   'Main',
  manage: 'Manage',
  system: 'System',
};

export function Navigation({ currentSection, onNavigate, onLogout, userRole, userId }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = userRole ? navItemsByRole[userRole] : [];
  const groups = [...new Set(navItems.map(i => i.group))];

  const handleNavClick = (section) => {
    onNavigate(section);
    setIsMobileMenuOpen(false);
  };

  const badgeStyle = userRole ? roleBadgeColors[userRole] : null;

  return (
    <>
      {/* Mobile top bar */}
      <div className="nav-mobile-bar">
        <div className="nav-brand-compact">
          <div className="nav-logo-mark"><Film size={16} /></div>
          <span className="nav-logo-text">Camcine</span>
        </div>
        <button
          className="nav-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <button
          className="nav-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close navigation"
        />
      )}

      {/* Sidebar */}
      <aside className={`nav-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="nav-logo-area">
          <div className="nav-logo-mark large"><Film size={20} /></div>
          <div className="nav-logo-content">
            <span className="nav-logo-text large">Camcine</span>
            <span className="nav-logo-sub">Admin Panel</span>
          </div>
        </div>

        {/* User badge */}
        {userRole && badgeStyle && (
          <div className="nav-user-pill" style={{
            background: badgeStyle.bg,
            border: `1px solid ${badgeStyle.border}`,
            color: badgeStyle.color
          }}>
            <span className="nav-user-dot" style={{ background: badgeStyle.color }} />
            {roleLabels[userRole]}
          </div>
        )}

        <div className="nav-divider" />

        {/* Navigation groups */}
        <nav className="nav-links-area">
          {groups.map((group) => {
            const items = navItems.filter(i => i.group === group);
            return (
              <div key={group} className="nav-group">
                <div className="nav-group-label">{groupLabels[group]}</div>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`nav-link ${isActive ? 'active' : ''}`}
                    >
                      <span className="nav-link-icon-wrap">
                        <Icon size={17} />
                      </span>
                      <span className="nav-link-label">{item.label}</span>
                      {isActive && <ChevronRight size={14} className="nav-link-arrow" />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="nav-footer">
          <button className="nav-footer-btn" onClick={onLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
          <div className="nav-user-card">
            <div className="nav-avatar">
              {userId ? userId[0]?.toUpperCase() : 'A'}
            </div>
            <div className="nav-user-info">
              <span className="nav-user-name">{userId || 'Admin'}</span>
              <span className="nav-user-role">{userRole ? roleLabels[userRole] : ''}</span>
            </div>
          </div>
        </div>
      </aside>

      <style>{`
        /* === SIDEBAR === */
        .nav-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 260px;
          background: #0d0d0d;
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          overflow: hidden;
        }

        /* === LOGO === */
        .nav-logo-area {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 24px 20px 18px;
        }

        .nav-logo-mark {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: rgba(204,26,26,0.12);
          color: #cc1a1a;
          border: 1px solid rgba(204,26,26,0.22);
          flex-shrink: 0;
        }

        .nav-logo-mark.large { width: 42px; height: 42px; border-radius: 14px; }

        .nav-logo-content { display: flex; flex-direction: column; gap: 1px; }

        .nav-logo-text {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 18px;
          color: #f5f5f5;
          letter-spacing: -0.02em;
        }

        .nav-logo-text.large { font-size: 19px; }

        .nav-logo-sub {
          font-size: 10px;
          color: rgba(255,255,255,0.35);
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* === USER PILL === */
        .nav-user-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin: 0 20px 16px;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          width: fit-content;
        }

        .nav-user-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* === DIVIDER === */
        .nav-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 0 20px 16px;
        }

        /* === LINKS === */
        .nav-links-area {
          flex: 1;
          overflow-y: auto;
          padding: 0 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          scrollbar-width: none;
        }
        .nav-links-area::-webkit-scrollbar { display: none; }

        .nav-group { margin-bottom: 20px; }

        .nav-group-label {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.22);
          padding: 0 8px 8px;
        }

        .nav-link {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px 11px;
          border-radius: 11px;
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.50);
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
          font-family: 'Inter', sans-serif;
        }

        .nav-link:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.04);
        }

        .nav-link.active {
          color: #fff;
          background: rgba(204,26,26,0.12);
          border-color: rgba(204,26,26,0.22);
        }

        .nav-link-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          flex-shrink: 0;
          background: rgba(255,255,255,0.04);
          transition: background 0.15s;
        }

        .nav-link.active .nav-link-icon-wrap {
          background: rgba(204,26,26,0.18);
          color: #ff6b6b;
        }

        .nav-link-label { flex: 1; }

        .nav-link-arrow {
          color: rgba(255,255,255,0.30);
          flex-shrink: 0;
        }

        /* === FOOTER === */
        .nav-footer {
          padding: 16px 12px 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-footer-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 11px;
          border-radius: 10px;
          background: transparent;
          border: 1px solid transparent;
          color: rgba(255,255,255,0.40);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: 'Inter', sans-serif;
        }

        .nav-footer-btn:hover {
          color: #f87171;
          background: rgba(239,68,68,0.08);
          border-color: rgba(239,68,68,0.15);
        }

        .nav-user-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 11px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .nav-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(204,26,26,0.15);
          border: 1px solid rgba(204,26,26,0.25);
          color: #ff6b6b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .nav-user-info {
          display: flex;
          flex-direction: column;
          gap: 1px;
          overflow: hidden;
        }

        .nav-user-name {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .nav-user-role {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
        }

        /* === MOBILE === */
        .nav-mobile-bar {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: #0d0d0d;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          z-index: 1100;
        }

        .nav-brand-compact {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-brand-compact .nav-logo-mark {
          width: 32px;
          height: 32px;
          border-radius: 10px;
        }

        .nav-brand-compact .nav-logo-text {
          font-size: 17px;
        }

        .nav-mobile-toggle {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.70);
          cursor: pointer;
          transition: all 0.15s;
        }

        .nav-mobile-toggle:hover {
          background: rgba(255,255,255,0.09);
          color: #fff;
        }

        .nav-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.65);
          border: none;
          z-index: 999;
          backdrop-filter: blur(4px);
        }

        @media (max-width: 1024px) {
          .nav-mobile-bar { display: flex; }
          .nav-sidebar {
            top: 0;
            width: 280px;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
            box-shadow: 8px 0 32px rgba(0,0,0,0.5);
          }
          .nav-sidebar.open { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
