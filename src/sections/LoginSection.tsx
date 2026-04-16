import { useState, useEffect } from 'react';
import { ChevronDown, Eye, EyeOff, Film, Lock, User } from 'lucide-react';
import type { LoginPayload, UserRole } from '../App';

interface LoginSectionProps {
  onLogin: (payload: LoginPayload) => void;
}

const credentials: Record<UserRole, { id: string; password: string }> = {
  admin: { id: 'admin001', password: 'admin123' },
  vendor: { id: 'vendor001', password: 'vendor123' },
  user: { id: 'user001', password: 'user123' },
  actor: { id: 'actor001', password: 'actor123' },
};

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  vendor: 'Vendor',
  user: 'User',
  actor: 'Actor',
};

export function LoginSection({ onLogin }: LoginSectionProps) {
  const [role, setRole] = useState<UserRole>('admin');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const expectedCredentials = credentials[role];
      setIsLoading(false);

      if (
        loginId.trim() === expectedCredentials.id &&
        password === expectedCredentials.password
      ) {
        onLogin({ role, userId: loginId.trim() });
        return;
      }

      setErrorMessage(`Invalid ${roleLabels[role].toLowerCase()} ID or password.`);
    }, 1500);
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setLoginId(credentials[selectedRole].id);
    setPassword(credentials[selectedRole].password);
    setErrorMessage('');
    setIsRoleDropdownOpen(false);
  };

  return (
    <section className="login-section">
      {/* Background */}
      <div 
        className="login-bg"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(1.06)',
          transition: 'opacity 0.9s ease, transform 0.9s ease'
        }}
      />
      <div className="login-overlay" />

      {/* Login Card */}
      <div 
        className="login-card"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -40%) scale(0.98)',
          transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s'
        }}
      >
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <Film />
          </div>
          <h1 className="login-title">Camcine</h1>
        </div>

        <div className="login-header">
          <h2>Welcome back</h2>
          <p>Select a role and sign in with your assigned ID.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="label">Role</label>
            <div className="role-dropdown">
              <button
                type="button"
                className={`role-dropdown-trigger ${isRoleDropdownOpen ? 'open' : ''}`}
                onClick={() => setIsRoleDropdownOpen((isOpen) => !isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isRoleDropdownOpen}
              >
                <span>{roleLabels[role]}</span>
                <ChevronDown className="role-dropdown-icon" />
              </button>

              {isRoleDropdownOpen && (
                <div className="role-dropdown-menu" role="listbox">
                  {(Object.keys(roleLabels) as UserRole[]).map((roleOption) => (
                    <button
                      key={roleOption}
                      type="button"
                      className={`role-dropdown-option ${role === roleOption ? 'selected' : ''}`}
                      onClick={() => handleRoleSelect(roleOption)}
                      role="option"
                      aria-selected={role === roleOption}
                    >
                      {roleLabels[roleOption]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="login-field">
            <label className="label">ID</label>
            <div className="login-input-wrapper">
              <User className="login-input-icon" />
              <input
                type="text"
                className="input"
                placeholder={`${role}001`}
                value={loginId}
                onChange={(e) => {
                  setLoginId(e.target.value);
                  setErrorMessage('');
                }}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label className="label">Password</label>
            <div className="login-input-wrapper">
              <Lock className="login-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                required
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="login-error" role="alert">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="login-spinner" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <button className="login-link">Forgot password?</button>
        </div>
      </div>

      {/* Ambient Particles */}
      <div className="login-particles">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${15 + i * 15}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      <style>{`
        .login-section {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-bg {
          position: absolute;
          inset: 0;
          background-image: url('/login_bg.jpg');
          background-size: cover;
          background-position: center;
        }

        .login-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(22, 7, 9, 0.64) 0%,
            rgba(22, 7, 9, 0.84) 50%,
            rgba(22, 7, 9, 0.96) 100%
          );
        }

        .login-card {
          position: absolute;
          left: 50%;
          top: 52%;
          transform: translate(-50%, -50%);
          width: 460px;
          max-width: 92vw;
          background: linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03)), rgba(50, 18, 23, 0.64);
          backdrop-filter: blur(30px) saturate(130%);
          border: 1px solid rgba(255, 235, 239, 0.16);
          border-radius: 32px;
          padding: 42px 36px;
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.38), 0 18px 40px rgba(128, 0, 32, 0.18);
          z-index: 10;
          overflow: hidden;
        }

        .login-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent 40%);
          pointer-events: none;
        }

        .login-logo {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          margin-bottom: 28px;
        }

        .login-logo-icon {
          width: 74px;
          height: 74px;
          background: linear-gradient(135deg, var(--accent), var(--accent-hover));
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 20px 36px rgba(128, 0, 32, 0.32);
        }

        .login-logo-icon svg {
          width: 32px;
          height: 32px;
        }

        .login-title {
          font-family: 'Sora', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .login-header h2 {
          font-size: 32px;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .login-header p {
          color: var(--text-secondary);
          font-size: 15px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .login-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .login-input-icon {
          position: absolute;
          left: 14px;
          width: 18px;
          height: 18px;
          color: var(--text-secondary);
        }

        .login-input-wrapper .input {
          padding-left: 44px;
          padding-right: 44px;
        }

        .role-dropdown {
          position: relative;
        }

        .role-dropdown-trigger {
          width: 100%;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 16px;
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }

        .role-dropdown-trigger:hover,
        .role-dropdown-trigger.open {
          border-color: rgba(128, 0, 32, 0.35);
          background: rgba(255, 255, 255, 0.07);
          box-shadow: 0 0 0 4px rgba(128, 0, 32, 0.1);
        }

        .role-dropdown-icon {
          width: 18px;
          height: 18px;
          color: var(--text-secondary);
          transition: transform 0.2s ease;
        }

        .role-dropdown-trigger.open .role-dropdown-icon {
          transform: rotate(180deg);
        }

        .role-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          padding: 6px;
          background: rgba(19, 23, 30, 0.96);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.32);
          backdrop-filter: blur(18px);
          z-index: 20;
        }

        .role-dropdown-option {
          width: 100%;
          padding: 11px 12px;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .role-dropdown-option:hover {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-primary);
        }

        .role-dropdown-option.selected {
          background: rgba(128, 0, 32, 0.14);
          color: var(--text-primary);
        }

        .login-password-toggle {
          position: absolute;
          right: 12px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .login-password-toggle:hover {
          color: var(--text-primary);
          background: rgba(247, 237, 239, 0.05);
        }

        .login-password-toggle svg {
          width: 18px;
          height: 18px;
        }

        .login-submit {
          width: 100%;
          margin-top: 10px;
          height: 52px;
          border-radius: 18px;
        }

        .login-error {
          padding: 12px 14px;
          border: 1px solid rgba(226, 79, 99, 0.35);
          border-radius: 14px;
          background: rgba(226, 79, 99, 0.1);
          color: #ffb8c2;
          font-size: 13px;
          font-weight: 600;
        }

        .login-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-footer {
          text-align: center;
          margin-top: 26px;
        }

        .login-link {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 14px;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .login-link:hover {
          color: var(--accent);
        }

        .login-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--accent);
          border-radius: 50%;
          opacity: 0.2;
          animation: float-particle linear infinite;
        }

        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.15;
          }
          25% {
            transform: translate(6px, -4px);
            opacity: 0.35;
          }
          50% {
            transform: translate(-4px, 6px);
            opacity: 0.25;
          }
          75% {
            transform: translate(-6px, -6px);
            opacity: 0.3;
          }
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 34px 22px;
            border-radius: 26px;
          }

          .login-header h2 {
            font-size: 26px;
          }
        }
      `}</style>
    </section>
  );
}
