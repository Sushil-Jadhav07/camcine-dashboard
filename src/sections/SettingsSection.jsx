import { useEffect, useState } from 'react';
import {
  Bell,
  CheckCircle,
  ChevronRight,
  CreditCard,
  LogOut,
  Plug,
  Save,
  Settings,
  Shield,
  User,
} from 'lucide-react';
import { UserRole } from '../constants/sections';
import { useAuth } from '../contexts/AuthContext.jsx';

const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'general', label: 'General', icon: Settings },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export function SettingsSection({ onLogout, userRole }) {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [accountData, setAccountData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    age: '',
    role: UserRole.USER,
  });
  const [generalSettings, setGeneralSettings] = useState({
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    theme: 'dark',
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '30',
    passwordStrength: 'strong',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
  });
  const [integrations, setIntegrations] = useState([
    { id: 'slack', name: 'Slack', enabled: false, webhook: '' },
    { id: 'discord', name: 'Discord', enabled: false, webhook: '' },
    { id: 'webhook', name: 'Custom Webhook', enabled: false, webhook: '' },
  ]);
  const [billingData, setBillingData] = useState({
    plan: 'free',
    billingCycle: 'monthly',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    if (!user) return;
    setAccountData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      age: user.age || '',
      role: user.role || UserRole.USER,
      language_preferences: user.language_preferences || [],
      regions: user.regions || [],
    });
  }, [user]);

  const flashSuccess = (message) => {
    setSuccessMessage(message);
    window.setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSaveAccount = async () => {
    setIsLoading(true);
    try {
      const result = await updateUser(accountData);
      if (result.success) flashSuccess('Account updated successfully.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderAccount = () => (
    <div className="tab-panel">
      <div className="section-heading">
        <div>
          <h3>Account Information</h3>
          <p>Identity and profile settings.</p>
        </div>
      </div>
      <div className="form-grid">
        {[
          ['first_name', 'First Name'],
          ['last_name', 'Last Name'],
          ['email', 'Email'],
          ['phone_number', 'Phone Number'],
          ['age', 'Age'],
        ].map(([key, label]) => (
          <div key={key} className="field">
            <label>{label}</label>
            <input
              className="input"
              value={accountData[key]}
              onChange={(event) => setAccountData({ ...accountData, [key]: event.target.value })}
              disabled={key === 'email'}
            />
          </div>
        ))}
        <div className="field">
          <label>Role</label>
          <select
            className="select"
            value={accountData.role}
            onChange={(event) => setAccountData({ ...accountData, role: event.target.value })}
            disabled={userRole !== UserRole.ADMIN}
          >
            {Object.values(UserRole).map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
        </div>
      </div>
      <div className="button-row" style={{ marginTop: 18 }}>
        <button className="btn btn-primary" onClick={handleSaveAccount} disabled={isLoading}>
          <Save size={16} />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );

  const renderGeneral = () => (
    <div className="tab-panel">
      <div className="section-heading">
        <div>
          <h3>General Settings</h3>
          <p>Regional and interface defaults.</p>
        </div>
      </div>
      <div className="form-grid">
        {[
          ['language', ['en', 'es', 'fr', 'de']],
          ['timezone', ['UTC', 'EST', 'PST', 'IST']],
          ['dateFormat', ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']],
          ['theme', ['dark', 'light', 'auto']],
        ].map(([key, options]) => (
          <div key={key} className="field">
            <label>{key}</label>
            <select className="select" value={generalSettings[key]} onChange={(event) => setGeneralSettings({ ...generalSettings, [key]: event.target.value })}>
              {options.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div className="button-row" style={{ marginTop: 18 }}>
        <button className="btn btn-primary" onClick={() => flashSuccess('General settings saved.')}>
          <Save size={16} />
          Save Settings
        </button>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="tab-panel">
      <div className="section-heading">
        <div>
          <h3>Security</h3>
          <p>Session controls and account protection.</p>
        </div>
      </div>
      <div className="list-stack">
        <div className="toggle-row">
          <div>
            <strong>Two-factor authentication</strong>
            <div className="subtle">Protect privileged access with an extra verification step.</div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={securitySettings.twoFactorEnabled}
              onChange={(event) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: event.target.checked })}
            />
            <span />
          </label>
        </div>
      </div>
      <div className="form-grid" style={{ marginTop: 16 }}>
        <div className="field">
          <label>Session Timeout</label>
          <input className="input" value={securitySettings.sessionTimeout} onChange={(event) => setSecuritySettings({ ...securitySettings, sessionTimeout: event.target.value })} />
        </div>
        <div className="field">
          <label>Password Strength</label>
          <select className="select" value={securitySettings.passwordStrength} onChange={(event) => setSecuritySettings({ ...securitySettings, passwordStrength: event.target.value })}>
            <option value="weak">Weak</option>
            <option value="medium">Medium</option>
            <option value="strong">Strong</option>
          </select>
        </div>
      </div>
      <div className="button-row" style={{ marginTop: 18 }}>
        <button className="btn btn-primary" onClick={() => flashSuccess('Security settings updated.')}>
          <Shield size={16} />
          Update Security
        </button>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="tab-panel">
      <div className="section-heading">
        <div>
          <h3>Notification Preferences</h3>
          <p>Fine-tune communication channels.</p>
        </div>
      </div>
      <div className="list-stack">
        {[
          ['emailNotifications', 'Email Notifications'],
          ['pushNotifications', 'Push Notifications'],
          ['smsNotifications', 'SMS Notifications'],
          ['marketingEmails', 'Marketing Emails'],
        ].map(([key, label]) => (
          <div key={key} className="toggle-row">
            <strong>{label}</strong>
            <label className="switch">
              <input
                type="checkbox"
                checked={notificationSettings[key]}
                onChange={(event) => setNotificationSettings({ ...notificationSettings, [key]: event.target.checked })}
              />
              <span />
            </label>
          </div>
        ))}
      </div>
      <div className="button-row" style={{ marginTop: 18 }}>
        <button className="btn btn-primary" onClick={() => flashSuccess('Notification preferences saved.')}>
          <Bell size={16} />
          Save Preferences
        </button>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="tab-panel">
      <div className="section-heading">
        <div>
          <h3>Integrations</h3>
          <p>Toggle and configure external hooks.</p>
        </div>
      </div>
      <div className="list-stack">
        {integrations.map((integration) => (
          <div key={integration.id} className="surface-panel" style={{ padding: 16, borderRadius: 20 }}>
            <div className="surface-content">
              <div className="toggle-row">
                <div>
                  <strong>{integration.name}</strong>
                  <div className="subtle">Connect your {integration.name} account.</div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={integration.enabled}
                    onChange={() => setIntegrations((prev) => prev.map((item) => item.id === integration.id ? { ...item, enabled: !item.enabled } : item))}
                  />
                  <span />
                </label>
              </div>
              {integration.enabled && (
                <div className="field" style={{ marginTop: 14 }}>
                  <label>Webhook URL</label>
                  <input
                    className="input"
                    value={integration.webhook}
                    onChange={(event) => setIntegrations((prev) => prev.map((item) => item.id === integration.id ? { ...item, webhook: event.target.value } : item))}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="button-row" style={{ marginTop: 18 }}>
        <button className="btn btn-primary" onClick={() => flashSuccess('Integrations updated.')}>
          <Plug size={16} />
          Save Integrations
        </button>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="tab-panel">
      <div className="section-heading">
        <div>
          <h3>Billing</h3>
          <p>Plan, cycle, and payment details.</p>
        </div>
      </div>
      <div className="form-grid">
        <div className="field">
          <label>Plan</label>
          <select className="select" value={billingData.plan} onChange={(event) => setBillingData({ ...billingData, plan: event.target.value })}>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
        <div className="field">
          <label>Billing Cycle</label>
          <select className="select" value={billingData.billingCycle} onChange={(event) => setBillingData({ ...billingData, billingCycle: event.target.value })}>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div className="field">
          <label>Card Number</label>
          <input className="input" value={billingData.cardNumber} onChange={(event) => setBillingData({ ...billingData, cardNumber: event.target.value })} />
        </div>
        <div className="field">
          <label>Expiry Date</label>
          <input className="input" value={billingData.expiryDate} onChange={(event) => setBillingData({ ...billingData, expiryDate: event.target.value })} />
        </div>
        <div className="field">
          <label>CVV</label>
          <input className="input" value={billingData.cvv} onChange={(event) => setBillingData({ ...billingData, cvv: event.target.value })} />
        </div>
      </div>
      <div className="button-row" style={{ marginTop: 18 }}>
        <button className="btn btn-primary" onClick={() => flashSuccess('Billing information updated.')}>
          <CreditCard size={16} />
          Update Billing
        </button>
      </div>
    </div>
  );

  const renderActivePanel = () => {
    if (activeTab === 'account') return renderAccount();
    if (activeTab === 'general') return renderGeneral();
    if (activeTab === 'security') return renderSecurity();
    if (activeTab === 'notifications') return renderNotifications();
    if (activeTab === 'integrations') return renderIntegrations();
    return renderBilling();
  };

  return (
    <section className="dashboard-shell">
      <div className="shell-container">
        <div className="hero-panel compact">
          <div className="hero-content hero-grid">
            <div className="hero-copy">
              <span className="hero-topline">Settings suite</span>
              <h1>Everything configurable, now split into a cleaner operational rail.</h1>
              <p>Functionality is unchanged across account, security, notifications, integrations, and billing.</p>
            </div>
            <div className="hero-side">
              <button className="btn btn-danger" onClick={onLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="success-banner">
            <CheckCircle size={16} />
            {' '}
            {successMessage}
          </div>
        )}

        <div className="split-layout">
          <div className="surface-panel">
            <div className="surface-content tab-rail">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} className={`tab-button ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      <Icon size={16} />
                      {tab.label}
                    </span>
                    <ChevronRight size={14} />
                  </button>
                );
              })}
            </div>
          </div>
          {renderActivePanel()}
        </div>
      </div>
    </section>
  );
}
