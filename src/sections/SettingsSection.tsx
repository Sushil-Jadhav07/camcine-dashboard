import { useState, useEffect } from 'react';
import { 
  Settings,
  Palette,
  Shield,
  Bell,
  Plug,
  CreditCard,
  Save,
  Upload,
  LogOut,
  ChevronRight,
  Key,
  Webhook
} from 'lucide-react';

interface SettingsSectionProps {
  onLogout: () => void;
}

type SettingsTab = 'general' | 'branding' | 'security' | 'notifications' | 'integrations' | 'billing';

const tabs = [
  { id: 'general' as SettingsTab, label: 'General', icon: Settings },
  { id: 'branding' as SettingsTab, label: 'Branding', icon: Palette },
  { id: 'security' as SettingsTab, label: 'Security', icon: Shield },
  { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
  { id: 'integrations' as SettingsTab, label: 'Integrations', icon: Plug },
  { id: 'billing' as SettingsTab, label: 'Billing', icon: CreditCard },
];

export function SettingsSection({ onLogout }: SettingsSectionProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'StreamFlow',
    timezone: 'UTC-5',
    language: 'en',
    darkMode: true,
    accentColor: '#800020',
    logo: null as string | null,
    twoFactor: false,
    sessionTimeout: 30,
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    apiKey: 'sk_live_51HxZ9l2eZvKYlo2C...',
    webhookUrl: 'https://api.streamflow.com/webhooks',
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    // Save settings logic
    alert('Settings saved successfully!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="settings-form">
            <div className="form-section">
              <h3>Platform Settings</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label className="label">Site Name</label>
                  <input
                    type="text"
                    className="input"
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  />
                </div>
                <div className="form-field">
                  <label className="label">Timezone</label>
                  <select 
                    className="filter-select"
                    value={settings.timezone}
                    onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                  >
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC+0">UTC</option>
                    <option value="UTC+1">Central European (UTC+1)</option>
                    <option value="UTC+8">Singapore (UTC+8)</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="label">Language</label>
                  <select 
                    className="filter-select"
                    value={settings.language}
                    onChange={(e) => setSettings({...settings, language: e.target.value})}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Appearance</h3>
              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-label">Dark Mode</span>
                  <span className="toggle-desc">Use dark theme across the platform</span>
                </div>
                <button 
                  className={`toggle ${settings.darkMode ? 'active' : ''}`}
                  onClick={() => setSettings({...settings, darkMode: !settings.darkMode})}
                >
                  <div className="toggle-slider" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'branding':
        return (
          <div className="settings-form">
            <div className="form-section">
              <h3>Logo & Assets</h3>
              <div className="logo-upload">
                <div className="logo-preview">
                  {settings.logo ? (
                    <img src={settings.logo} alt="Logo" />
                  ) : (
                    <div className="logo-placeholder">
                      <Upload />
                      <span>Upload Logo</span>
                    </div>
                  )}
                </div>
                <div className="logo-actions">
                  <button className="btn btn-secondary">
                    <Upload /> Upload New
                  </button>
                  <span className="upload-hint">Recommended: 512x512px PNG</span>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Brand Colors</h3>
              <div className="color-picker-row">
                <div className="form-field">
                  <label className="label">Primary Color</label>
                  <div className="color-input">
                    <input
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => setSettings({...settings, accentColor: e.target.value})}
                    />
                    <span>{settings.accentColor}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Favicon</h3>
              <div className="favicon-upload">
                <div className="favicon-preview">
                  <div className="favicon-placeholder">SF</div>
                </div>
                <button className="btn btn-secondary">
                  <Upload /> Upload Favicon
                </button>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="settings-form">
            <div className="form-section">
              <h3>Authentication</h3>
              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-label">Two-Factor Authentication</span>
                  <span className="toggle-desc">Require 2FA for all admin accounts</span>
                </div>
                <button 
                  className={`toggle ${settings.twoFactor ? 'active' : ''}`}
                  onClick={() => setSettings({...settings, twoFactor: !settings.twoFactor})}
                >
                  <div className="toggle-slider" />
                </button>
              </div>
            </div>

            <div className="form-section">
              <h3>Session Settings</h3>
              <div className="form-field">
                <label className="label">Session Timeout (minutes)</label>
                <input
                  type="number"
                  className="input"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                  min={5}
                  max={120}
                />
              </div>
            </div>

            <div className="form-section danger-zone">
              <h3>Danger Zone</h3>
              <div className="danger-actions">
                <div className="danger-item">
                  <div>
                    <span className="danger-label">Reset API Keys</span>
                    <span className="danger-desc">This will invalidate all existing API keys</span>
                  </div>
                  <button className="btn btn-danger">Reset</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-form">
            <div className="form-section">
              <h3>Email Notifications</h3>
              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-label">System Notifications</span>
                  <span className="toggle-desc">Receive emails about system updates</span>
                </div>
                <button 
                  className={`toggle ${settings.emailNotifications ? 'active' : ''}`}
                  onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                >
                  <div className="toggle-slider" />
                </button>
              </div>
              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-label">Marketing Emails</span>
                  <span className="toggle-desc">Receive product updates and offers</span>
                </div>
                <button 
                  className={`toggle ${settings.marketingEmails ? 'active' : ''}`}
                  onClick={() => setSettings({...settings, marketingEmails: !settings.marketingEmails})}
                >
                  <div className="toggle-slider" />
                </button>
              </div>
            </div>

            <div className="form-section">
              <h3>Push Notifications</h3>
              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-label">Browser Notifications</span>
                  <span className="toggle-desc">Show notifications in browser</span>
                </div>
                <button 
                  className={`toggle ${settings.pushNotifications ? 'active' : ''}`}
                  onClick={() => setSettings({...settings, pushNotifications: !settings.pushNotifications})}
                >
                  <div className="toggle-slider" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="settings-form">
            <div className="form-section">
              <h3>API Configuration</h3>
              <div className="form-field">
                <label className="label">API Key</label>
                <div className="api-key-field">
                  <input
                    type="text"
                    className="input"
                    value={settings.apiKey}
                    readOnly
                  />
                  <button className="btn btn-secondary">
                    <Key /> Regenerate
                  </button>
                </div>
              </div>
              <div className="form-field">
                <label className="label">Webhook URL</label>
                <div className="webhook-field">
                  <Webhook className="webhook-icon" />
                  <input
                    type="text"
                    className="input"
                    value={settings.webhookUrl}
                    onChange={(e) => setSettings({...settings, webhookUrl: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Connected Services</h3>
              <div className="integrations-list">
                <div className="integration-item">
                  <div className="integration-info">
                    <div className="integration-icon stripe">S</div>
                    <div>
                      <span className="integration-name">Stripe</span>
                      <span className="integration-status connected">Connected</span>
                    </div>
                  </div>
                  <button className="btn btn-ghost">Configure</button>
                </div>
                <div className="integration-item">
                  <div className="integration-info">
                    <div className="integration-icon aws">A</div>
                    <div>
                      <span className="integration-name">AWS S3</span>
                      <span className="integration-status connected">Connected</span>
                    </div>
                  </div>
                  <button className="btn btn-ghost">Configure</button>
                </div>
                <div className="integration-item">
                  <div className="integration-info">
                    <div className="integration-icon sendgrid">SG</div>
                    <div>
                      <span className="integration-name">SendGrid</span>
                      <span className="integration-status disconnected">Not Connected</span>
                    </div>
                  </div>
                  <button className="btn btn-primary">Connect</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="settings-form">
            <div className="form-section">
              <h3>Billing Information</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label className="label">Company Name</label>
                  <input type="text" className="input" placeholder="StreamFlow Inc." />
                </div>
                <div className="form-field">
                  <label className="label">Tax ID</label>
                  <input type="text" className="input" placeholder="XX-XXXXXXX" />
                </div>
                <div className="form-field full-width">
                  <label className="label">Billing Address</label>
                  <textarea className="input" rows={3} placeholder="Enter billing address..." />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Payment Method</h3>
              <div className="payment-method">
                <div className="payment-card">
                  <div className="card-icon">V</div>
                  <div className="card-info">
                    <span className="card-number">•••• •••• •••• 4242</span>
                    <span className="card-expiry">Expires 12/25</span>
                  </div>
                </div>
                <button className="btn btn-secondary">Update</button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="settings-section">
      <div className="settings-container">
        {/* Header */}
        <div 
          className="settings-header"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease'
          }}
        >
          <h1>Settings</h1>
          <p>Configure your platform preferences.</p>
        </div>

        {/* Settings Layout */}
        <div className="settings-layout">
          {/* Sidebar */}
          <div 
            className="settings-sidebar"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s'
            }}
          >
            <div className="settings-tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="tab-icon" />
                    <span>{tab.label}</span>
                    <ChevronRight className="tab-arrow" />
                  </button>
                );
              })}
            </div>

            <div className="sidebar-footer">
              <button className="logout-btn" onClick={onLogout}>
                <LogOut /> Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div 
            className="settings-content"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s'
            }}
          >
            <div className="content-card">
              {renderTabContent()}
              
              <div className="settings-actions">
                <button className="btn btn-secondary">Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>
                  <Save /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .settings-section {
          min-height: 100vh;
          padding: 28px 0 56px;
          background: var(--bg-primary);
        }

        .settings-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .settings-header {
          margin-bottom: 26px;
          padding: 26px 30px;
          border-radius: 28px;
          border: 1px solid var(--border);
          background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), rgba(50, 18, 23, 0.58);
          backdrop-filter: blur(26px);
          box-shadow: var(--shadow-soft);
        }

        .settings-header h1 {
          font-size: 36px;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .settings-header p {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .settings-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 24px;
        }

        .settings-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .settings-tabs {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), rgba(50, 18, 23, 0.58);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 8px;
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-soft);
        }

        .settings-tab {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .settings-tab:hover {
          background: rgba(247, 237, 239, 0.05);
          color: var(--text-primary);
        }

        .settings-tab.active {
          background: rgba(128, 0, 32, 0.14);
          color: var(--accent);
        }

        .tab-icon {
          width: 18px;
          height: 18px;
        }

        .tab-arrow {
          width: 16px;
          height: 16px;
          margin-left: auto;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .settings-tab.active .tab-arrow {
          opacity: 1;
        }

        .sidebar-footer {
          margin-top: auto;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--error);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: var(--error);
        }

        .settings-content {
          min-height: 600px;
        }

        .content-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), rgba(50, 18, 23, 0.58);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 32px;
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-soft);
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-section h3 {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-field.full-width {
          grid-column: span 2;
        }

        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          border-bottom: 1px solid var(--border);
        }

        .toggle-row:last-child {
          border-bottom: none;
        }

        .toggle-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .toggle-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .toggle-desc {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .toggle {
          width: 48px;
          height: 26px;
          background: var(--bg-tertiary);
          border-radius: 13px;
          position: relative;
          cursor: pointer;
          border: none;
          transition: background 0.3s ease;
        }

        .toggle.active {
          background: var(--accent);
        }

        .toggle-slider {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: transform 0.3s ease;
        }

        .toggle.active .toggle-slider {
          transform: translateX(22px);
        }

        .logo-upload {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .logo-preview {
          width: 120px;
          height: 120px;
          background: var(--bg-primary);
          border: 2px dashed var(--border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .logo-preview img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .logo-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
        }

        .logo-placeholder svg {
          width: 32px;
          height: 32px;
        }

        .logo-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .upload-hint {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .color-input {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .color-input input[type="color"] {
          width: 48px;
          height: 48px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          background: transparent;
        }

        .favicon-upload {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .favicon-preview {
          width: 48px;
          height: 48px;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .favicon-placeholder {
          font-size: 18px;
          font-weight: 700;
          color: var(--accent);
        }

        .danger-zone h3 {
          color: var(--error);
        }

        .danger-actions {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .danger-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
        }

        .danger-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .danger-desc {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .btn-danger {
          padding: 8px 16px;
          background: var(--error);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-danger:hover {
          background: #b91c1c;
        }

        .api-key-field {
          display: flex;
          gap: 12px;
        }

        .api-key-field .input {
          font-family: monospace;
          font-size: 13px;
        }

        .webhook-field {
          position: relative;
        }

        .webhook-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: var(--text-secondary);
        }

        .webhook-field .input {
          padding-left: 44px;
        }

        .integrations-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .integration-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 10px;
        }

        .integration-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .integration-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          color: white;
        }

        .integration-icon.stripe {
          background: #800020;
        }

        .integration-icon.aws {
          background: #9f1d35;
        }

        .integration-icon.sendgrid {
          background: #68101e;
        }

        .integration-name {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .integration-status {
          display: block;
          font-size: 12px;
        }

        .integration-status.connected {
          color: var(--success);
        }

        .integration-status.disconnected {
          color: var(--text-secondary);
        }

        .payment-method {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 10px;
        }

        .payment-card {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .card-icon {
          width: 48px;
          height: 32px;
          background: #4a0f19;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          font-weight: 700;
        }

        .card-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .card-number {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .card-expiry {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .settings-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }

        .settings-actions .btn {
          gap: 8px;
        }

        .filter-select {
          padding: 10px 16px;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text-primary);
          font-size: 14px;
          cursor: pointer;
          outline: none;
          width: 100%;
        }

        @media (max-width: 1024px) {
          .settings-layout {
            grid-template-columns: 1fr;
          }

          .settings-sidebar {
            order: 2;
          }

          .settings-content {
            order: 1;
          }

          .sidebar-footer {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-field.full-width {
            grid-column: span 1;
          }

          .logo-upload {
            flex-direction: column;
            align-items: flex-start;
          }

          .api-key-field {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}
