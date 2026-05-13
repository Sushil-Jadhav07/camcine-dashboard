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
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import './App.css';

import { Section, UserRole } from './constants/sections';

const defaultSections = {
  [UserRole.ADMIN]: Section.DASHBOARD,
  [UserRole.MANAGER]: Section.DASHBOARD,
  [UserRole.USER]: Section.SUBSCRIPTIONS,
  [UserRole.ACTOR]: Section.ACTOR_PORTAL,
};

const roleSections = {
  [UserRole.ADMIN]: [
    Section.DASHBOARD, Section.CONTENT, Section.CONTENT_DETAIL,
    Section.ADD_TITLE_TYPE, Section.ADD_TITLE, Section.ACTOR_QUEUE,
    Section.SONGS, Section.NEWS, Section.USERS, Section.SUBSCRIPTIONS,
    Section.PAYMENTS, Section.ANALYTICS, Section.SETTINGS, Section.NOTIFICATIONS,
  ],
  [UserRole.MANAGER]: [
    Section.DASHBOARD, Section.CONTENT, Section.CONTENT_DETAIL,
    Section.ADD_TITLE_TYPE, Section.ADD_TITLE, Section.SONGS,
    Section.MANAGER_EARNINGS, Section.SETTINGS,
  ],
  [UserRole.USER]: [Section.SUBSCRIPTIONS, Section.PAYMENTS, Section.SETTINGS],
  [UserRole.ACTOR]: [Section.ACTOR_PORTAL, Section.SETTINGS],
};

const canAccessSection = (section, role) => {
  if (section === Section.LOGIN) return !role;
  if (!role) return false;
  return (roleSections[role] || []).includes(section);
};

function AppInner() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [currentSection, setCurrentSection] = useState(Section.LOGIN);
  const [showNavigation, setShowNavigation] = useState(false);
  const [addTitleType, setAddTitleType] = useState('movie');
  const [selectedContentId, setSelectedContentId] = useState(null);

  const userRole = user?.role || null;
  const userId = user?.id || '';

  // When auth state resolves, navigate based on role
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && userRole) {
        setShowNavigation(true);
        setCurrentSection(defaultSections[userRole] || Section.DASHBOARD);
      } else {
        setShowNavigation(false);
        setCurrentSection(Section.LOGIN);
      }
    }
  }, [isAuthenticated, userRole, isLoading]);

  // Guard section access
  useEffect(() => {
    if (!isAuthenticated || !userRole) return;
    if (!canAccessSection(currentSection, userRole)) {
      setCurrentSection(defaultSections[userRole] || Section.DASHBOARD);
    }
  }, [currentSection, isAuthenticated, userRole]);

  const handleLogin = ({ role, userId: _uid }) => {
    // Role is already set in AuthContext from the API response
    // This callback is just to trigger navigation from LoginSection
    // Navigation is handled by the useEffect above via isAuthenticated
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div style={{minHeight:'100vh',background:'#080808',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
          <div style={{width:24,height:24,borderRadius:'50%',border:'2px solid rgba(255,255,255,.10)',borderTopColor:'rgba(204,26,26,.80)',animation:'spin .65s linear infinite'}}/>
          <div style={{fontSize:13,color:'rgba(255,255,255,.30)'}}>Loading…</div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const guardedSection =
    isAuthenticated && userRole && !canAccessSection(currentSection, userRole)
      ? defaultSections[userRole]
      : currentSection;

  const renderSection = () => {
    switch (guardedSection) {
      case Section.LOGIN:
        return <LoginSection onLogin={handleLogin} />;
      case Section.DASHBOARD:
        if (userRole === UserRole.MANAGER) {
          return <ManagerDashboardSection onNavigate={setCurrentSection} userId={userId} />;
        }
        return <DashboardSection onNavigate={setCurrentSection} />;
      case Section.CONTENT:
        return (
          <ContentLibrarySection
            onNavigate={setCurrentSection}
            userRole={userRole}
            userId={userId}
            onSelectContent={setSelectedContentId}
          />
        );
      case Section.CONTENT_DETAIL:
        return <ContentDetailSection onNavigate={setCurrentSection} contentId={selectedContentId} />;
      case Section.ADD_TITLE_TYPE:
        return (
          <AddTitleTypeSection
            onNavigate={setCurrentSection}
            onSelectType={setAddTitleType}
          />
        );
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
        return (
          <SettingsSection
            onLogout={handleLogout}
            userRole={userRole ?? UserRole.USER}
            userId={userId}
          />
        );
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

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
