import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const validate = (email, password) => {
  const errs = {};
  if (!email) errs.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address.';
  if (!password) errs.password = 'Password is required.';
  else if (password.length < 6) errs.password = 'Password must be at least 6 characters.';
  return errs;
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form.email, form.password);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // simulate
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate(result.role === 'admin' ? '/admin' : (from === '/login' ? '/dashboard' : from), { replace: true });
    } else {
      setServerError(result.error);
    }
  };

  const fillDemo = (role) => {
    if (role === 'student') setForm({ email: 'student@edusphere.com', password: 'student123' });
    else setForm({ email: 'admin@edusphere.com', password: 'admin123' });
    setErrors({});
    setServerError('');
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1"/>
        <div className="auth-orb auth-orb-2"/>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <svg viewBox="0 0 32 32" fill="none" width="36" height="36">
                <circle cx="16" cy="16" r="14" stroke="url(#al1)" strokeWidth="2"/>
                <path d="M10 16l4 4 8-8" stroke="url(#al1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs><linearGradient id="al1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#00d4ff"/><stop offset="1" stopColor="#7c3aed"/></linearGradient></defs>
              </svg>
              <span>Edu<span style={{color:'var(--accent-primary)'}}>Sphere</span></span>
            </Link>
            <h1>Welcome Back</h1>
            <p>Sign in to continue your learning journey</p>
          </div>

          {/* Demo creds */}
          <div className="demo-creds">
            <span>Try demo:</span>
            <button type="button" className="demo-btn" onClick={() => fillDemo('student')}>Student</button>
            <button type="button" className="demo-btn demo-admin" onClick={() => fillDemo('admin')}>Admin</button>
          </div>

          {serverError && (
            <div className="alert alert-error">
              <span>⚠</span> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-icon-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input
                  type="email" id="email" name="email"
                  className={`form-control with-icon ${errors.email ? 'error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="error-msg">⚠ {errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
              </label>
              <div className="input-icon-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <input
                  type={showPass ? 'text' : 'password'} id="password" name="password"
                  className={`form-control with-icon ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <span className="error-msg">⚠ {errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'8px'}} disabled={loading}>
              {loading ? <><span className="btn-spinner"/>Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register">Create one free →</Link>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; padding: 80px 24px 40px; }
        .auth-bg { position: fixed; inset: 0; z-index: 0; }
        .auth-orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.12; }
        .auth-orb-1 { width: 500px; height: 500px; background: var(--accent-primary); top: -100px; right: -100px; }
        .auth-orb-2 { width: 400px; height: 400px; background: var(--accent-secondary); bottom: -100px; left: -100px; }
        .auth-container { position: relative; z-index: 1; width: 100%; max-width: 460px; }
        .auth-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 40px; box-shadow: var(--shadow-card); }
        .auth-header { text-align: center; margin-bottom: 28px; }
        .auth-logo { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; margin-bottom: 24px; }
        .auth-header h1 { font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: 8px; }
        .auth-header p { color: var(--text-secondary); font-size: 0.9rem; }
        .demo-creds { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; padding: 12px 16px; background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.15); border-radius: var(--radius-sm); font-size: 0.82rem; color: var(--text-muted); }
        .demo-btn { padding: 4px 12px; border-radius: 6px; border: 1px solid var(--accent-primary); background: transparent; color: var(--accent-primary); font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: var(--transition); }
        .demo-btn:hover { background: rgba(0,212,255,0.1); }
        .demo-admin { border-color: var(--accent-secondary); color: #a78bfa; }
        .demo-admin:hover { background: rgba(124,58,237,0.1); }
        .alert { padding: 12px 16px; border-radius: var(--radius-sm); font-size: 0.88rem; display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
        .alert-error { background: rgba(255,61,154,0.1); border: 1px solid rgba(255,61,154,0.3); color: var(--accent-pink); }
        .input-icon-wrapper { position: relative; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
        .form-control.with-icon { padding-left: 44px; }
        .pass-toggle { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 14px; }
        label { display: flex; justify-content: space-between; align-items: center; }
        .forgot-link { font-size: 0.8rem; color: var(--accent-primary); }
        .btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(0,0,0,0.3); border-top-color: var(--bg-primary); border-radius: 50%; animation: spin-slow 0.8s linear infinite; }
        .auth-footer { text-align: center; margin-top: 24px; font-size: 0.88rem; color: var(--text-muted); }
        .auth-footer a { color: var(--accent-primary); font-weight: 600; }
      `}</style>
    </div>
  );
};

export default Login;
