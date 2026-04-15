import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { LoginSection } from './sections/LoginSection';
import { DashboardSection } from './sections/DashboardSection';
import { ContentLibrarySection } from './sections/ContentLibrarySection';
import { ContentDetailSection } from './sections/ContentDetailSection';
import { AddTitleSection } from './sections/AddTitleSection';
import { AddTitleTypeSection } from './sections/AddTitleTypeSection';
import { UsersSection } from './sections/UsersSection';
import { SubscriptionsSection } from './sections/SubscriptionsSection';
import { PaymentsSection } from './sections/PaymentsSection';
import { SettingsSection } from './sections/SettingsSection';
import './App.css';

export type Section = 'login' | 'dashboard' | 'content' | 'content-detail' | 'add-title-type' | 'add-title' | 'users' | 'subscriptions' | 'payments' | 'settings';
export type UserRole = 'admin' | 'vendor' | 'user';

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
  const [addTitleType, setAddTitleType] = useState<'movie' | 'series'>('movie');

  useEffect(() => {
    if (isAuthenticated && userRole) {
      setShowNavigation(true);
      setCurrentSection(userRole === 'user' ? 'subscriptions' : 'dashboard');
    }
  }, [isAuthenticated, userRole]);

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
    switch (currentSection) {
      case 'login':
        return <LoginSection onLogin={handleLogin} />;
      case 'dashboard':
        return <DashboardSection onNavigate={setCurrentSection} />;
      case 'content':
        return <ContentLibrarySection onNavigate={setCurrentSection} />;
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
            titleType={addTitleType}
          />
        );
      case 'users':
        return <UsersSection />;
      case 'subscriptions':
        return <SubscriptionsSection />;
      case 'payments':
        return <PaymentsSection />;
      case 'settings':
        return <SettingsSection onLogout={handleLogout} />;
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
