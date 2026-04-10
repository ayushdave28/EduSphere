import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const validate = (form) => {
  const errs = {};
  if (!form.name.trim()) errs.name = 'Full name is required.';
  else if (form.name.trim().length < 3) errs.name = 'Name must be at least 3 characters.';
  if (!form.email) errs.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.';
  if (!form.password) errs.password = 'Password is required.';
  else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.';
  else if (!/(?=.*[A-Z])/.test(form.password)) errs.password = 'Must contain at least one uppercase letter.';
  else if (!/(?=.*[0-9])/.test(form.password)) errs.password = 'Must contain at least one number.';
  if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password.';
  else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
  if (!form.agree) errs.agree = 'You must agree to the Terms of Service.';
  return errs;
};

const getStrength = (pw) => {
  if (!pw) return { level: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { level: 1, label: 'Weak', color: 'var(--accent-pink)' },
    { level: 2, label: 'Fair', color: 'var(--accent-orange)' },
    { level: 3, label: 'Good', color: '#f0e68c' },
    { level: 4, label: 'Strong', color: 'var(--accent-green)' },
  ];
  return map[score - 1] || { level: 0, label: '', color: '' };
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', agree: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = getStrength(form.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const result = await register(form.name.trim(), form.email, form.password);
    setLoading(false);
    if (result.success) navigate(result.role === 'admin' ? '/admin' : '/dashboard');
    else setServerError(result.error);
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1"/>
        <div className="auth-orb auth-orb-2"/>
      </div>

      <div className="auth-container" style={{maxWidth: '480px'}}>
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <svg viewBox="0 0 32 32" fill="none" width="36" height="36">
                <circle cx="16" cy="16" r="14" stroke="url(#rl1)" strokeWidth="2"/>
                <path d="M10 16l4 4 8-8" stroke="url(#rl1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs><linearGradient id="rl1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#00d4ff"/><stop offset="1" stopColor="#7c3aed"/></linearGradient></defs>
              </svg>
              <span>Edu<span style={{color:'var(--accent-primary)'}}>Sphere</span></span>
            </Link>
            <h1>Create Account</h1>
            <p>Start your learning journey today — it's free!</p>
          </div>

          {serverError && <div className="alert alert-error"><span>⚠</span> {serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-icon-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" id="name" name="name" className={`form-control with-icon ${errors.name ? 'error' : ''}`} placeholder="John Doe" value={form.name} onChange={handleChange} autoComplete="name"/>
              </div>
              {errors.name && <span className="error-msg">⚠ {errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-icon-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input type="email" id="email" name="email" className={`form-control with-icon ${errors.email ? 'error' : ''}`} placeholder="you@example.com" value={form.email} onChange={handleChange} autoComplete="email"/>
              </div>
              {errors.email && <span className="error-msg">⚠ {errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-icon-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <input type={showPass ? 'text' : 'password'} id="password" name="password" className={`form-control with-icon ${errors.password ? 'error' : ''}`} placeholder="Min 8 chars, 1 uppercase, 1 number" value={form.password} onChange={handleChange} autoComplete="new-password"/>
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>{showPass ? '🙈' : '👁'}</button>
              </div>
              {form.password && (
                <div className="strength-bar">
                  <div className="strength-segments">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="seg" style={{background: i <= strength.level ? strength.color : 'var(--border-color)'}}/>
                    ))}
                  </div>
                  <span style={{color: strength.color, fontSize:'0.78rem'}}>{strength.label}</span>
                </div>
              )}
              {errors.password && <span className="error-msg">⚠ {errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-icon-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <input type={showConfirm ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" className={`form-control with-icon ${errors.confirmPassword ? 'error' : ''}`} placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} autoComplete="new-password"/>
                <button type="button" className="pass-toggle" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? '🙈' : '👁'}</button>
              </div>
              {errors.confirmPassword && <span className="error-msg">⚠ {errors.confirmPassword}</span>}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange}/>
                <span>I agree to the <a href="#" style={{color:'var(--accent-primary)'}}>Terms of Service</a> and <a href="#" style={{color:'var(--accent-primary)'}}>Privacy Policy</a></span>
              </label>
              {errors.agree && <span className="error-msg">⚠ {errors.agree}</span>}
            </div>

            <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'8px'}} disabled={loading}>
              {loading ? <><span className="btn-spinner"/>Creating Account...</> : 'Create Free Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">Sign in →</Link>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; padding: 80px 24px 40px; }
        .auth-bg { position: fixed; inset: 0; z-index: 0; }
        .auth-orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.12; }
        .auth-orb-1 { width: 500px; height: 500px; background: var(--accent-secondary); top: -100px; left: -100px; }
        .auth-orb-2 { width: 400px; height: 400px; background: var(--accent-primary); bottom: -100px; right: -100px; }
        .auth-container { position: relative; z-index: 1; width: 100%; }
        .auth-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 40px; box-shadow: var(--shadow-card); }
        .auth-header { text-align: center; margin-bottom: 28px; }
        .auth-logo { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; margin-bottom: 24px; }
        .auth-header h1 { font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: 8px; }
        .auth-header p { color: var(--text-secondary); font-size: 0.9rem; }
        .alert { padding: 12px 16px; border-radius: var(--radius-sm); font-size: 0.88rem; display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
        .alert-error { background: rgba(255,61,154,0.1); border: 1px solid rgba(255,61,154,0.3); color: var(--accent-pink); }
        .input-icon-wrapper { position: relative; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
        .form-control.with-icon { padding-left: 44px; }
        .pass-toggle { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 14px; }
        .strength-bar { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
        .strength-segments { display: flex; gap: 4px; flex: 1; }
        .seg { height: 4px; flex: 1; border-radius: 2px; transition: background 0.3s; }
        .checkbox-label { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 0.85rem; color: var(--text-secondary); }
        .checkbox-label input { margin-top: 3px; accent-color: var(--accent-primary); width: 16px; height: 16px; flex-shrink: 0; }
        .btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(0,0,0,0.3); border-top-color: var(--bg-primary); border-radius: 50%; animation: spin-slow 0.8s linear infinite; }
        .auth-footer { text-align: center; margin-top: 24px; font-size: 0.88rem; color: var(--text-muted); }
        .auth-footer a { color: var(--accent-primary); font-weight: 600; }
      `}</style>
    </div>
  );
};

export default Register;
