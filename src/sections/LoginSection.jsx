import { useEffect, useState } from 'react';
import { ChevronDown, Eye, EyeOff, Film, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { UserRole } from '../constants/sections';

const roleLabels = {
  [UserRole.ADMIN]: 'Admin',
  [UserRole.MANAGER]: 'Manager',
  [UserRole.USER]: 'User',
  [UserRole.ACTOR]: 'Actor',
};

export function LoginSection({ onLogin }) {
  const { login, register, isLoading, error, clearError } = useAuth();
  const [loginType, setLoginType] = useState('email');
  const [role, setRole] = useState(UserRole.USER);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    role: UserRole.USER,
    age: '',
  });

  useEffect(() => {
    clearError();
  }, [loginType, isRegisterMode]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const credentials = loginType === 'email' ? { email: loginId, password } : { id: loginId, password };
    const result = await login(credentials);
    if (result.success) {
      onLogin({
        role: result.user?.role || (loginType === 'email' ? role : UserRole.USER),
        userId: result.user?.id || result.user?.email || loginId.trim(),
      });
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert('Passwords do not match');
      return;
    }
    const result = await register({
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
      password: formData.password,
      role: formData.role,
      age: Number.parseInt(formData.age, 10),
    });
    if (result.success) {
      alert('Registration successful! Please login.');
      setIsRegisterMode(false);
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        password: '',
        confirm_password: '',
        role: UserRole.USER,
        age: '',
      });
    }
  };

  return (
    <section className="login-shell">
      <div className="login-stage">
        <div className="login-promo">
          <div className="login-promo-copy">
            <span className="hero-topline">
              <Film size={14} />
              Gochujang Red / Crimson Blaze
            </span>
            <h1>Run your streaming dashboard inside a richer red studio.</h1>
            <p>
              The flow stays the same. Only the interface has been rebuilt with a more cinematic hierarchy,
              stronger spacing, and a clearer entry point for each role.
            </p>
          </div>
        </div>

        <div className="login-card">
          <div style={{ marginBottom: 24 }}>
            <span className="hero-topline">Camcine access</span>
            <h2>{isRegisterMode ? 'Create Account' : 'Welcome Back'}</h2>
            <p>{isRegisterMode ? 'Register a new account to enter the dashboard.' : 'Sign in with email or ID.'}</p>
          </div>

          {!isRegisterMode ? (
            <form className="login-form" onSubmit={handleLoginSubmit}>
              <div className="segmented">
                <button type="button" className={loginType === 'email' ? 'active' : ''} onClick={() => setLoginType('email')}>
                  Email
                </button>
                <button type="button" className={loginType === 'id' ? 'active' : ''} onClick={() => setLoginType('id')}>
                  ID
                </button>
              </div>

              {loginType === 'email' && (
                <div className="field role-menu">
                  <label>Role</label>
                  <div style={{ position: 'relative' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ width: '100%', justifyContent: 'space-between' }}
                      onClick={() => setIsRoleDropdownOpen((open) => !open)}
                    >
                      {roleLabels[role]}
                      <ChevronDown size={16} />
                    </button>
                    {isRoleDropdownOpen && (
                      <div className="surface-panel" style={{ position: 'absolute', inset: 'calc(100% + 8px) 0 auto', padding: 8, zIndex: 4 }}>
                        {Object.values(UserRole).map((roleOption) => (
                          <button
                            key={roleOption}
                            type="button"
                            className={`tab-button ${role === roleOption ? 'active' : ''}`}
                            onClick={() => {
                              setRole(roleOption);
                              setIsRoleDropdownOpen(false);
                            }}
                          >
                            <span>{roleLabels[roleOption]}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="field">
                <label>{loginType === 'email' ? 'Email' : 'ID'}</label>
                <div className="login-input">
                  <User size={16} />
                  <input
                    className="input"
                    type={loginType === 'email' ? 'email' : 'text'}
                    value={loginId}
                    placeholder={loginType === 'email' ? 'Enter your email' : 'Enter your ID'}
                    onChange={(event) => setLoginId(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>Password</label>
                <div className="login-input">
                  <Lock size={16} />
                  <input
                    className="input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    placeholder="Enter your password"
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && <div className="error-banner">{error}</div>}

              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form className="login-form" onSubmit={handleRegisterSubmit}>
              {[
                ['first_name', 'First Name', 'text', User],
                ['last_name', 'Last Name', 'text', User],
                ['email', 'Email', 'email', Mail],
                ['phone_number', 'Phone Number', 'tel', User],
                ['age', 'Age', 'number', User],
              ].map(([key, label, type, Icon]) => (
                <div key={key} className="field">
                  <label>{label}</label>
                  <div className="login-input">
                    <Icon size={16} />
                    <input
                      className="input"
                      type={type}
                      value={formData[key]}
                      onChange={(event) => setFormData({ ...formData, [key]: event.target.value })}
                      required
                    />
                  </div>
                </div>
              ))}

              <div className="field">
                <label>Role</label>
                <select
                  className="select"
                  value={formData.role}
                  onChange={(event) => setFormData({ ...formData, role: event.target.value })}
                >
                  {Object.values(UserRole).map((roleOption) => (
                    <option key={roleOption} value={roleOption}>
                      {roleLabels[roleOption]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Password</label>
                <div className="login-input">
                  <Lock size={16} />
                  <input
                    className="input"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>Confirm Password</label>
                <div className="login-input">
                  <Lock size={16} />
                  <input
                    className="input"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirm_password}
                    onChange={(event) => setFormData({ ...formData, confirm_password: event.target.value })}
                    required
                  />
                </div>
              </div>

              {error && <div className="error-banner">{error}</div>}

              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Register'}
              </button>
            </form>
          )}

          <div style={{ marginTop: 18 }}>
            <button type="button" className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setIsRegisterMode((value) => !value)}>
              {isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
