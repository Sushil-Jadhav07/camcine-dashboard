import { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { LoginSection } from './sections/LoginSection';
import { DashboardSection } from './sections/DashboardSection';
import { ManagerDashboardSection } from './sections/ManagerDashboardSection';
import { ManagerEarningsSection } from './sections/ManagerEarningsSection';
import { ActorPortalSection } from './sections/ActorPortalSection';
import { ActorQueueSection } from './sections/ActorQueueSection';
import { SongsSection } from './sections/SongsSection';
import { NewsManagerSection } from './sections/NewsManagerSection';
import { AnalyticsSection } from './sections/AnalyticsSection';
import { NotificationsSection } from './sections/NotificationsSection';
import { ContentLibrarySection } from './sections/ContentLibrarySection';
import { ContentDetailSection } from './sections/ContentDetailSection';
import { AddTitleSection } from './sections/AddTitleSection';
import { AddTitleTypeSection } from './sections/AddTitleTypeSection';
import { UsersSection } from './sections/UsersSection';
import { SubscriptionsSection } from './sections/SubscriptionsSection';
import { PaymentsSection } from './sections/PaymentsSection';
import { SettingsSection } from './sections/SettingsSection';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import './App.css';

import { Section, UserRole } from './constants/sections';

const AddTitleType = {
  FILM: 'film',
  SERIES: 'series',
  MUSIC: 'music',
  PODCAST: 'podcast',
};

const defaultSections = {
  [UserRole.ADMIN]: Section.DASHBOARD,
  [UserRole.MANAGER]: Section.DASHBOARD,
  [UserRole.USER]: Section.SUBSCRIPTIONS,
  [UserRole.ACTOR]: Section.ACTOR_PORTAL,
};

const roleSections = {
  [UserRole.ADMIN]: [
    Section.DASHBOARD,
    Section.CONTENT,
    Section.CONTENT_DETAIL,
    Section.ADD_TITLE_TYPE,
    Section.ADD_TITLE,
    Section.ACTOR_QUEUE,
    Section.SONGS,
    Section.NEWS,
    Section.USERS,
    Section.SUBSCRIPTIONS,
    Section.PAYMENTS,
    Section.ANALYTICS,
    Section.SETTINGS,
    Section.NOTIFICATIONS,
  ],
  [UserRole.MANAGER]: [
    Section.DASHBOARD,
    Section.CONTENT,
    Section.CONTENT_DETAIL,
    Section.ADD_TITLE_TYPE,
    Section.ADD_TITLE,
    Section.SONGS,
    Section.MANAGER_EARNINGS,
    Section.SETTINGS,
  ],
  [UserRole.USER]: [Section.SUBSCRIPTIONS, Section.PAYMENTS, Section.SETTINGS],
  [UserRole.ACTOR]: [Section.ACTOR_PORTAL, Section.SETTINGS],
};

const getDefaultSection = (role) => defaultSections[role] || Section.LOGIN;

const canAccessSection = (section, role) => {
  if (section === Section.LOGIN) return !role;
  if (!role) return false;
  return roleSections[role]?.includes(section) ?? false;
};

function AppContent() {
  const { isAuthenticated, isLoading, user, role: authRole, logout } = useAuth();
  const [currentSection, setCurrentSection] = useState(Section.LOGIN);
  const [addTitleType, setAddTitleType] = useState(AddTitleType.FILM);
  const [theme, setTheme] = useState(() => localStorage.getItem('camcine-theme') || 'dark');

  const userRole = authRole || user?.role || null;
  const userId = user?.id || user?.email || '';
  const showNavigation = isAuthenticated && !!userRole;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('camcine-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !userRole) {
      setCurrentSection(Section.LOGIN);
      return;
    }

    setCurrentSection((previousSection) =>
      canAccessSection(previousSection, userRole) ? previousSection : getDefaultSection(userRole)
    );
  }, [isAuthenticated, isLoading, userRole]);

  const handleLogin = ({ role }) => {
    setCurrentSection(getDefaultSection(role));
  };

  const handleLogout = () => {
    logout();
    setCurrentSection(Section.LOGIN);
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const renderSection = () => {
    if (isLoading) {
      return (
        <section className="login-shell">
          <div className="login-card" style={{ width: 'min(520px, 100%)' }}>
            <span className="hero-topline">Camcine access</span>
            <h2 style={{ marginTop: 16 }}>Loading session</h2>
            <p>Checking the authenticated user via `/auth/me`.</p>
          </div>
        </section>
      );
    }

    const guardedSection =
      isAuthenticated && userRole && !canAccessSection(currentSection, userRole)
        ? getDefaultSection(userRole)
        : currentSection;

    switch (guardedSection) {
      case Section.LOGIN:
        return <LoginSection onLogin={handleLogin} />;
      case Section.DASHBOARD:
        return userRole === UserRole.MANAGER
          ? <ManagerDashboardSection onNavigate={setCurrentSection} userId={userId} />
          : <DashboardSection onNavigate={setCurrentSection} />;
      case Section.CONTENT:
        return <ContentLibrarySection onNavigate={setCurrentSection} userRole={userRole} userId={userId} />;
      case Section.CONTENT_DETAIL:
        return <ContentDetailSection onNavigate={setCurrentSection} />;
      case Section.ADD_TITLE_TYPE:
        return <AddTitleTypeSection onNavigate={setCurrentSection} onSelectType={setAddTitleType} />;
      case Section.ADD_TITLE:
        return (
          <AddTitleSection
            onNavigate={setCurrentSection}
            titleType={addTitleType}
          />
        );
      case Section.USERS:
        return <UsersSection />;
      case Section.SUBSCRIPTIONS:
        return <SubscriptionsSection />;
      case Section.PAYMENTS:
        return <PaymentsSection />;
      case Section.SETTINGS:
        return <SettingsSection onLogout={handleLogout} userRole={userRole ?? UserRole.USER} userId={userId} />;
      case Section.ACTOR_PORTAL:
        return <ActorPortalSection onNavigate={setCurrentSection} userId={userId} />;
      case Section.ACTOR_QUEUE:
        return <ActorQueueSection onNavigate={setCurrentSection} />;
      case Section.SONGS:
        return <SongsSection onNavigate={setCurrentSection} />;
      case Section.NEWS:
        return <NewsManagerSection onNavigate={setCurrentSection} />;
      case Section.ANALYTICS:
        return <AnalyticsSection onNavigate={setCurrentSection} />;
      case Section.MANAGER_EARNINGS:
        return <ManagerEarningsSection userId={userId} />;
      case Section.NOTIFICATIONS:
        return <NotificationsSection onNavigate={setCurrentSection} />;
      default:
        return <LoginSection onLogin={handleLogin} />;
    }
  };

  return (
    <div className="app">
      {showNavigation && (
        <Navigation
          currentSection={currentSection}
          onNavigate={setCurrentSection}
          onLogout={handleLogout}
          userRole={userRole}
          userId={userId}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      <main className={`main-content ${showNavigation ? 'with-nav' : ''}`}>
        {renderSection()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
