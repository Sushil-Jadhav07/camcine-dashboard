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
  Webhook,
  User,
  Wallet,
  Trash2,
  Eye,
  EyeOff,
  Building2,
  MapPin,
  Languages,
} from 'lucide-react';
import type { UserRole } from '../App';

interface SettingsSectionProps {
  onLogout: () => void;
  userRole: UserRole;
  userId: string;
}

type SettingsTab =
  | 'account'
  | 'general'
  | 'branding'
  | 'security'
  | 'notifications'
  | 'integrations'
  | 'billing'
  | 'payout';

interface TabDef {
  id: SettingsTab;
  label: string;
  icon: React.ElementType;
}

const allTabs: TabDef[] = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'general', label: 'General', icon: Settings },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'payout', label: 'Payout Settings', icon: Wallet },
];

const pageTitleByRole: Record<UserRole, string> = {
  admin: 'Platform Settings',
  manager: 'My Account',
  user: 'My Account',
  actor: 'My Account',
};

function getTabsForRole(role: UserRole): TabDef[] {
  switch (role) {
    case 'admin':
      return allTabs.filter((t) =>
        ['general', 'branding', 'security', 'notifications', 'integrations', 'billing'].includes(t.id)
      );
    case 'manager':
      return allTabs.filter((t) =>
        ['account', 'security', 'notifications', 'payout'].includes(t.id)
      );
    case 'user':
      return allTabs.filter((t) =>
        ['account', 'security', 'notifications'].includes(t.id)
      );
    case 'actor':
      return allTabs.filter((t) =>
        ['account', 'security', 'notifications'].includes(t.id)
      );
    default:
      return allTabs.filter((t) =>
        ['general', 'branding', 'security', 'notifications', 'integrations', 'billing'].includes(t.id)
      );
  }
}

export function SettingsSection({ onLogout, userRole, userId }: SettingsSectionProps) {
  const roleTabs = getTabsForRole(userRole);
  const [activeTab, setActiveTab] = useState<SettingsTab>(roleTabs[0]?.id ?? 'general');
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [settings, setSettings] = useState({
    siteName: 'Camcine',
    timezone: 'UTC+5:30',
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
    webhookUrl: 'https://api.camcine.com/webhooks',
  });

  // Account tab state
  const [account, setAccount] = useState({
    displayName: userId || 'User',
    languagePref: 'Hindi',
    regionPref: 'Maharashtra',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Payout tab state
  const [payout] = useState({
    accountNumber: '•••• •••• 1234',
    ifsc: 'HDFC0001234',
    bankName: 'HDFC Bank',
    accountHolder: 'Ravi Mehta',
    upiId: 'ravi.mehta@upi',
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // When role tabs change (shouldn't happen at runtime but safety), reset tab
  useEffect(() => {
    if (!roleTabs.find((t) => t.id === activeTab)) {
      setActiveTab(roleTabs[0]?.id ?? 'general');
    }
  }, [userRole]);

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const renderAccountTab = () => (
    <div className="settings-form">
      {/* Profile photo */}
      <div className="form-section">
        <h3>Profile</h3>
        <div className="profile-photo-row">
          <div className="profile-avatar">
            <User className="avatar-icon" />
          </div>
          <div className="profile-photo-actions">
            <button className="btn btn-secondary">
              <Upload /> Upload Photo
            </button>
            <span className="upload-hint">JPG or PNG, max 2MB</span>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label className="label">Display Name</label>
            <input
              type="text"
              className="input"
              value={account.displayName}
              onChange={(e) => setAccount({ ...account, displayName: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label className="label">Email</label>
            <input
              type="text"
              className="input input-readonly"
              value="j***@gmail.com"
              readOnly
            />
          </div>
          <div className="form-field">
            <label className="label">Phone</label>
            <input
              type="text"
              className="input input-readonly"
              value="+91 98***1234"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="form-section">
        <h3>Preferences</h3>
        <div className="form-grid">
          <div className="form-field">
            <label className="label">
              <Languages className="label-icon" /> Language
            </label>
            <select
              className="filter-select"
              value={account.languagePref}
              onChange={(e) => setAccount({ ...account, languagePref: e.target.value })}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Tamil</option>
              <option>Telugu</option>
              <option>Bengali</option>
            </select>
          </div>
          <div className="form-field">
            <label className="label">
              <MapPin className="label-icon" /> Region
            </label>
            <select
              className="filter-select"
              value={account.regionPref}
              onChange={(e) => setAccount({ ...account, regionPref: e.target.value })}
            >
              {[
                'Andhra Pradesh','Assam','Bihar','Delhi','Goa','Gujarat','Haryana',
                'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
                'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha',
                'Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
                'Uttar Pradesh','Uttarakhand','West Bengal',
              ].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="form-section">
        <h3>Change Password</h3>
        <div className="form-grid">
          <div className="form-field">
            <label className="label">Current Password</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                value={account.currentPassword}
                onChange={(e) => setAccount({ ...account, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
              <button className="pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <div className="form-field">
            <label className="label">New Password</label>
            <input
              type="password"
              className="input"
              value={account.newPassword}
              onChange={(e) => setAccount({ ...account, newPassword: e.target.value })}
              placeholder="Min 8 characters"
            />
          </div>
          <div className="form-field">
            <label className="label">Confirm New Password</label>
            <input
              type="password"
              className="input"
              value={account.confirmPassword}
              onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })}
              placeholder="Re-enter new password"
            />
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="form-section danger-zone">
        <h3>Danger Zone</h3>
        <div className="danger-item">
          <div>
            <span className="danger-label">Delete Account</span>
            <span className="danger-desc">
              Permanently delete your account and all associated data. This cannot be undone.
            </span>
          </div>
          {!deleteConfirm ? (
            <button className="btn btn-danger" onClick={() => setDeleteConfirm(true)}>
              <Trash2 /> Delete
            </button>
          ) : (
            <div className="delete-confirm-row">
              <span className="danger-desc">Are you sure?</span>
              <button className="btn btn-danger" onClick={() => alert('Account deletion requested.')}>
                Confirm Delete
              </button>
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPayoutTab = () => (
    <div className="settings-form">
      {/* Bank details */}
      <div className="form-section">
        <h3>
          <Building2 className="section-icon" /> Bank Account
        </h3>
        <div className="form-grid">
          <div className="form-field">
            <label className="label">Account Number</label>
            <input type="text" className="input input-readonly" value={payout.accountNumber} readOnly />
          </div>
          <div className="form-field">
            <label className="label">IFSC Code</label>
            <input type="text" className="input input-readonly" value={payout.ifsc} readOnly />
          </div>
          <div className="form-field">
            <label className="label">Bank Name</label>
            <input type="text" className="input input-readonly" value={payout.bankName} readOnly />
          </div>
          <div className="form-field">
            <label className="label">Account Holder Name</label>
            <input type="text" className="input input-readonly" value={payout.accountHolder} readOnly />
          </div>
        </div>
        <button className="btn btn-secondary" style={{ marginTop: 4 }}>
          Update Bank Details
        </button>
      </div>

      {/* UPI */}
      <div className="form-section">
        <h3>UPI (Alternative Payout)</h3>
        <div className="form-field" style={{ maxWidth: 360 }}>
          <label className="label">UPI ID</label>
          <input type="text" className="input input-readonly" value={payout.upiId} readOnly />
        </div>
      </div>

      {/* Info cards */}
      <div className="form-section">
        <h3>Payout Information</h3>
        <div className="payout-info-grid">
          <div className="payout-info-card">
            <span className="payout-info-label">TDS Deduction</span>
            <span className="payout-info-value">10% deducted at source as per Indian tax law</span>
          </div>
          <div className="payout-info-card">
            <span className="payout-info-label">Payout Schedule</span>
            <span className="payout-info-value">Monthly — 1st of every month</span>
          </div>
          <div className="payout-info-card">
            <span className="payout-info-label">Minimum Payout Threshold</span>
            <span className="payout-info-value">₹500</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountTab();

      case 'payout':
        return renderPayoutTab();

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
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="label">Timezone</label>
                  <select
                    className="filter-select"
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  >
                    <option value="UTC+5:30">India (UTC+5:30)</option>
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC+0">UTC</option>
                    <option value="UTC+1">Central European (UTC+1)</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="label">Language</label>
                  <select
                    className="filter-select"
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="ta">Tamil</option>
                    <option value="te">Telugu</option>
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
                  onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
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
                  <span className="upload-hint">Recommended: 512×512px PNG</span>
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
                      onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
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
                  <div className="favicon-placeholder">C</div>
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
                  <span className="toggle-desc">
                    {userRole === 'admin'
                      ? 'Require 2FA for all admin accounts'
                      : 'Add an extra layer of security to your account'}
                  </span>
                </div>
                <button
                  className={`toggle ${settings.twoFactor ? 'active' : ''}`}
                  onClick={() => setSettings({ ...settings, twoFactor: !settings.twoFactor })}
                >
                  <div className="toggle-slider" />
                </button>
              </div>
            </div>
            <div className="form-section">
              <h3>Session Settings</h3>
              <div className="form-field" style={{ maxWidth: 240 }}>
                <label className="label">Session Timeout (minutes)</label>
                <input
                  type="number"
                  className="input"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })
                  }
                  min={5}
                  max={120}
                />
              </div>
            </div>
            {userRole === 'admin' && (
              <div className="form-section danger-zone">
                <h3>Danger Zone</h3>
                <div className="danger-item">
                  <div>
                    <span className="danger-label">Reset API Keys</span>
                    <span className="danger-desc">This will invalidate all existing API keys</span>
                  </div>
                  <button className="btn btn-danger">Reset</button>
                </div>
              </div>
            )}
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
                  onClick={() =>
                    setSettings({ ...settings, emailNotifications: !settings.emailNotifications })
                  }
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
                  onClick={() =>
                    setSettings({ ...settings, marketingEmails: !settings.marketingEmails })
                  }
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
                  onClick={() =>
                    setSettings({ ...settings, pushNotifications: !settings.pushNotifications })
                  }
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
                  <input type="text" className="input" value={settings.apiKey} readOnly />
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
                    onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="form-section">
              <h3>Connected Services</h3>
              <div className="integrations-list">
                {[
                  { abbr: 'R', name: 'Razorpay', status: true, cls: 'razorpay' },
                  { abbr: 'A', name: 'AWS S3', status: true, cls: 'aws' },
                  { abbr: 'SG', name: 'SendGrid', status: false, cls: 'sendgrid' },
                ].map((s) => (
                  <div key={s.name} className="integration-item">
                    <div className="integration-info">
                      <div className={`integration-icon ${s.cls}`}>{s.abbr}</div>
                      <div>
                        <span className="integration-name">{s.name}</span>
                        <span className={`integration-status ${s.status ? 'connected' : 'disconnected'}`}>
                          {s.status ? 'Connected' : 'Not Connected'}
                        </span>
                      </div>
                    </div>
                    <button className={`btn ${s.status ? 'btn-ghost' : 'btn-primary'}`}>
                      {s.status ? 'Configure' : 'Connect'}
                    </button>
                  </div>
                ))}
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
                  <input type="text" className="input" placeholder="Camcine Media Pvt. Ltd." />
                </div>
                <div className="form-field">
                  <label className="label">GSTIN</label>
                  <input type="text" className="input" placeholder="27AAAAA0000A1Z5" />
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
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <h1>{pageTitleByRole[userRole]}</h1>
          <p>
            {userRole === 'admin'
              ? 'Configure platform-wide preferences and integrations.'
              : 'Manage your profile, security and notification preferences.'}
          </p>
        </div>

        {/* Settings Layout */}
        <div className="settings-layout">
          {/* Sidebar */}
          <div
            className="settings-sidebar"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
            }}
          >
            <div className="settings-tabs">
              {roleTabs.map((tab) => {
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
              transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s',
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
          flex-shrink: 0;
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
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-icon {
          width: 18px;
          height: 18px;
          color: var(--accent);
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

        .label {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .label-icon {
          width: 14px;
          height: 14px;
        }

        .input {
          padding: 10px 14px;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
        }

        .input:focus {
          border-color: var(--accent);
        }

        .input-readonly {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .input::placeholder {
          color: var(--text-secondary);
          opacity: 0.7;
        }

        textarea.input {
          resize: vertical;
          font-family: inherit;
        }

        /* Profile photo */
        .profile-photo-row {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .profile-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(128, 0, 32, 0.14);
          border: 2px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .avatar-icon {
          width: 32px;
          height: 32px;
          color: var(--accent);
        }

        .profile-photo-actions {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        /* Password field */
        .password-field {
          position: relative;
        }

        .pw-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pw-toggle svg {
          width: 18px;
          height: 18px;
        }

        /* Payout info cards */
        .payout-info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .payout-info-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 18px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: rgba(128, 0, 32, 0.06);
        }

        .payout-info-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .payout-info-value {
          font-size: 14px;
          color: var(--text-primary);
          font-weight: 500;
        }

        /* Toggle */
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
          background: var(--bg-tertiary, #2a1a1e);
          border-radius: 13px;
          position: relative;
          cursor: pointer;
          border: none;
          transition: background 0.3s ease;
          flex-shrink: 0;
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

        /* Danger zone */
        .danger-zone h3 {
          color: var(--error);
          border-color: rgba(239, 68, 68, 0.25);
        }

        .danger-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
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

        .delete-confirm-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        /* Branding */
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

        .color-picker-row {}

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

        /* Integrations */
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

        .integration-icon.razorpay { background: #800020; }
        .integration-icon.aws { background: #9f1d35; }
        .integration-icon.sendgrid { background: #68101e; }

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

        .integration-status.connected { color: var(--success); }
        .integration-status.disconnected { color: var(--text-secondary); }

        /* Billing */
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

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn svg {
          width: 16px;
          height: 16px;
        }

        .btn-primary {
          background: var(--accent);
          color: white;
        }

        .btn-primary:hover {
          background: #9a0025;
        }

        .btn-secondary {
          background: rgba(255,255,255,0.06);
          border: 1px solid var(--border);
          color: var(--text-primary);
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.1);
        }

        .btn-ghost {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-secondary);
        }

        .btn-ghost:hover {
          color: var(--text-primary);
          border-color: rgba(255,255,255,0.2);
        }

        .btn-danger {
          background: var(--error, #ef4444);
          color: white;
          border: none;
        }

        .btn-danger:hover {
          background: #b91c1c;
        }

        /* Filter select */
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

        /* Actions bar */
        .settings-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
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

          .payout-info-grid {
            grid-template-columns: 1fr;
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