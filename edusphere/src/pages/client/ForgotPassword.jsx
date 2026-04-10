import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>
      <div className="auth-container" style={{ maxWidth: '440px' }}>
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <svg viewBox="0 0 32 32" fill="none" width="36" height="36">
                <circle cx="16" cy="16" r="14" stroke="url(#fp1)" strokeWidth="2" />
                <path d="M10 16l4 4 8-8" stroke="url(#fp1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs><linearGradient id="fp1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#00d4ff" /><stop offset="1" stopColor="#7c3aed" /></linearGradient></defs>
              </svg>
              <span>Edu<span style={{ color: 'var(--accent-primary)' }}>Sphere</span></span>
            </Link>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔑</div>
            <h1>Reset Password</h1>
            <p>Enter your email and we'll send you a link to reset your password.</p>
          </div>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✉️</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '8px' }}>Check Your Email</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                We've sent a password reset link to <strong style={{ color: 'var(--accent-primary)' }}>{email}</strong>. Check your inbox and follow the instructions.
              </p>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email" id="email"
                    className={`form-control ${error ? 'error' : ''}`}
                    style={{ paddingLeft: '44px' }}
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    autoComplete="email"
                  />
                </div>
                {error && <span className="error-msg">⚠ {error}</span>}
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? <><span className="btn-spinner" />Sending...</> : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="auth-footer" style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Remember your password? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign in →</Link>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; padding: 80px 24px 40px; }
        .auth-bg { position: fixed; inset: 0; z-index: 0; }
        .auth-orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.12; }
        .auth-orb-1 { width: 400px; height: 400px; background: var(--accent-primary); top: -100px; right: -100px; }
        .auth-orb-2 { width: 350px; height: 350px; background: var(--accent-secondary); bottom: -100px; left: -100px; }
        .auth-container { position: relative; z-index: 1; width: 100%; }
        .auth-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 40px; box-shadow: var(--shadow-card); }
        .auth-header { text-align: center; margin-bottom: 28px; }
        .auth-logo { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; margin-bottom: 24px; }
        .auth-header h1 { font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: 8px; }
        .auth-header p { color: var(--text-secondary); font-size: 0.9rem; }
        .btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(0,0,0,0.3); border-top-color: var(--bg-primary); border-radius: 50%; animation: spin-slow 0.8s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px; }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
