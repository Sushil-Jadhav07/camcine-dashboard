import { useState, useEffect } from 'react';
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
import './App.css';

export type Section =
  | 'login'
  | 'dashboard'
  | 'content'
  | 'content-detail'
  | 'add-title-type'
  | 'add-title'
  | 'users'
  | 'subscriptions'
  | 'payments'
  | 'settings'
  | 'actor-portal'
  | 'actor-queue'
  | 'songs'
  | 'news'
  | 'analytics'
  | 'manager-earnings'
  | 'notifications';
export type UserRole = 'admin' | 'manager' | 'user' | 'actor';
type AddTitleType = 'movie' | 'series' | 'song' | 'news-clip';

const defaultSections: Record<UserRole, Section> = {
  admin: 'dashboard',
  manager: 'dashboard',
  user: 'subscriptions',
  actor: 'actor-portal',
};

const roleSections: Record<UserRole, Section[]> = {
  admin: [
    'dashboard',
    'content',
    'content-detail',
    'add-title-type',
    'add-title',
    'actor-queue',
    'songs',
    'news',
    'users',
    'subscriptions',
    'payments',
    'analytics',
    'settings',
    'notifications',
  ],
  manager: [
    'dashboard',
    'content',
    'content-detail',
    'add-title-type',
    'add-title',
    'songs',
    'manager-earnings',
    'settings',
  ],
  user: ['subscriptions', 'payments', 'settings'],
  actor: ['actor-portal', 'settings'],
};

const getDefaultSection = (role: UserRole): Section => defaultSections[role];

const canAccessSection = (section: Section, role: UserRole | null): boolean => {
  if (section === 'login') {
    return !role;
  }

  if (!role) {
    return false;
  }

  return roleSections[role].includes(section);
};

export interface LoginPayload {
  role: UserRole;
  userId: string;
}

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState('');
  const [showNavigation, setShowNavigation] = useState(false);
  const [addTitleType, setAddTitleType] = useState<AddTitleType>('movie');

  useEffect(() => {
    if (isAuthenticated && userRole) {
      setShowNavigation(true);
      setCurrentSection(getDefaultSection(userRole));
    }
  }, [isAuthenticated, userRole]);

  useEffect(() => {
    if (!isAuthenticated || !userRole) {
      return;
    }

    if (!canAccessSection(currentSection, userRole)) {
      setCurrentSection(getDefaultSection(userRole));
    }
  }, [currentSection, isAuthenticated, userRole]);

  const handleLogin = ({ role, userId: loggedInUserId }: LoginPayload) => {
    setUserRole(role);
    setUserId(loggedInUserId);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId('');
    setShowNavigation(false);
    setCurrentSection('login');
  };

  const renderSection = () => {
    const guardedSection =
      isAuthenticated && userRole && !canAccessSection(currentSection, userRole)
        ? getDefaultSection(userRole)
        : currentSection;

    switch (guardedSection) {
      case 'login':
        return <LoginSection onLogin={handleLogin} />;
      case 'dashboard':
        if (userRole === 'manager') {
          return <ManagerDashboardSection onNavigate={setCurrentSection} userId={userId} />;
        }

        return <DashboardSection onNavigate={setCurrentSection} />;
      case 'content':
        if (!userRole) {
          return <LoginSection onLogin={handleLogin} />;
        }

        return (
          <ContentLibrarySection
            onNavigate={setCurrentSection}
            userRole={userRole}
            userId={userId}
          />
        );
      case 'content-detail':
        return <ContentDetailSection onNavigate={setCurrentSection} />;
      case 'add-title-type':
        return (
          <AddTitleTypeSection
            onNavigate={setCurrentSection}
            onSelectType={setAddTitleType}
          />
        );
      case 'add-title':
        return (
          <AddTitleSection
            onNavigate={setCurrentSection}
            titleType={addTitleType === 'series' ? 'series' : 'movie'}
          />
        );
      case 'users':
        return <UsersSection />;
      case 'subscriptions':
        return <SubscriptionsSection />;
      case 'payments':
        return <PaymentsSection />;
      case 'settings':
        return (
          <SettingsSection
            onLogout={handleLogout}
            userRole={userRole ?? 'user'}
            userId={userId}
          />
        );
      case 'actor-portal':
        return <ActorPortalSection onNavigate={setCurrentSection} userId={userId} />;
      case 'actor-queue':
        return <ActorQueueSection onNavigate={setCurrentSection} />;
      case 'songs':
        return <SongsSection onNavigate={setCurrentSection} />;
      case 'news':
        return <NewsManagerSection onNavigate={setCurrentSection} />;
      case 'analytics':
        return <AnalyticsSection onNavigate={setCurrentSection} />;
      case 'manager-earnings':
        return <ManagerEarningsSection userId={userId} />;
      case 'notifications':
        return <NotificationsSection onNavigate={setCurrentSection} />;
      default:
        return <DashboardSection onNavigate={setCurrentSection} />;
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
        />
      )}
      <main className={`main-content ${showNavigation ? 'with-nav' : ''}`}>
        {renderSection()}
      </main>
    </div>
  );
}

export default App;