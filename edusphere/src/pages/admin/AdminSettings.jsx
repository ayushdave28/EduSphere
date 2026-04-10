import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminSettings = () => {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('general');

  const [generalForm, setGeneralForm] = useState({ siteName: 'EduSphere', siteEmail: 'admin@edusphere.com', supportEmail: 'support@edusphere.com', currency: 'INR', timezone: 'Asia/Kolkata' });
  const [saving, setSaving] = useState(false);

  const [generalErrors, setGeneralErrors] = useState({});

  const validateGeneral = () => {
    const errs = {};
    if (!generalForm.siteName.trim()) errs.siteName = 'Site name is required.';
    if (!generalForm.siteEmail.trim()) errs.siteEmail = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(generalForm.siteEmail)) errs.siteEmail = 'Invalid email address.';
    return errs;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validateGeneral();
    if (Object.keys(errs).length) { setGeneralErrors(errs); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    showToast('Settings saved successfully!', 'success');
  };

  const tabs = [
    { key: 'general', label: '⚙ General' },
    { key: 'payment', label: '💳 Payment' },
    { key: 'email', label: '📧 Email' },
    { key: 'security', label: '🔒 Security' },
    { key: 'maintenance', label: '🔧 Maintenance' },
  ];

  return (
    <div className="admin-settings page-enter">
      <div className="admin-page-header">
        <div>
          <h1>Site <span className="gradient-text">Settings</span></h1>
          <p>Configure platform settings, payment options, and more.</p>
        </div>
      </div>

      <div className="settings-layout">
        {/* Tabs sidebar */}
        <div className="settings-nav">
          {tabs.map(t => (
            <button key={t.key} className={`settings-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-card">
              <h2>General Settings</h2>
              <form onSubmit={handleSave} noValidate>
                <div className="form-group">
                  <label>Site Name</label>
                  <input type="text" className={`form-control ${generalErrors.siteName ? 'error' : ''}`} value={generalForm.siteName} onChange={e => { setGeneralForm(f => ({ ...f, siteName: e.target.value })); setGeneralErrors(x => ({ ...x, siteName: '' })); }} />
                  {generalErrors.siteName && <span className="error-msg">⚠ {generalErrors.siteName}</span>}
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Admin Email</label>
                    <input type="email" className={`form-control ${generalErrors.siteEmail ? 'error' : ''}`} value={generalForm.siteEmail} onChange={e => { setGeneralForm(f => ({ ...f, siteEmail: e.target.value })); setGeneralErrors(x => ({ ...x, siteEmail: '' })); }} />
                    {generalErrors.siteEmail && <span className="error-msg">⚠ {generalErrors.siteEmail}</span>}
                  </div>
                  <div className="form-group">
                    <label>Support Email</label>
                    <input type="email" className="form-control" value={generalForm.supportEmail} onChange={e => setGeneralForm(f => ({ ...f, supportEmail: e.target.value }))} />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Currency</label>
                    <select className="form-control" value={generalForm.currency} onChange={e => setGeneralForm(f => ({ ...f, currency: e.target.value }))}>
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Timezone</label>
                    <select className="form-control" value={generalForm.timezone} onChange={e => setGeneralForm(f => ({ ...f, timezone: e.target.value }))}>
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? '⏳ Saving...' : '✓ Save Settings'}</button>
              </form>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="settings-card">
              <h2>Payment Settings</h2>
              <div className="form-group">
                <label>Payment Gateway</label>
                <select className="form-control"><option>Razorpay</option><option>Stripe</option><option>PayPal</option></select>
              </div>
              <div className="form-group">
                <label>Razorpay Key ID</label>
                <input type="text" className="form-control" placeholder="rzp_live_xxxxxxxxxxxx" />
              </div>
              <div className="form-group">
                <label>Razorpay Key Secret</label>
                <input type="password" className="form-control" placeholder="••••••••••••••••" />
              </div>
              <div className="form-group">
                <label>Platform Fee (%)</label>
                <input type="number" className="form-control" defaultValue={10} min={0} max={50} />
              </div>
              <button className="btn btn-primary" onClick={() => showToast('Payment settings saved!', 'success')}>Save Payment Settings</button>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="settings-card">
              <h2>Email Configuration</h2>
              <div className="grid-2">
                <div className="form-group"><label>SMTP Host</label><input type="text" className="form-control" defaultValue="smtp.gmail.com" /></div>
                <div className="form-group"><label>SMTP Port</label><input type="number" className="form-control" defaultValue={587} /></div>
              </div>
              <div className="form-group"><label>SMTP Username</label><input type="email" className="form-control" placeholder="your@gmail.com" /></div>
              <div className="form-group"><label>SMTP Password</label><input type="password" className="form-control" placeholder="••••••••" /></div>
              <div className="form-group"><label>From Name</label><input type="text" className="form-control" defaultValue="EduSphere Team" /></div>
              <button className="btn btn-primary" onClick={() => showToast('Email config saved!', 'success')}>Save Email Config</button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-card">
              <h2>Security Settings</h2>
              {[
                { label: 'Require email verification on signup', key: 'emailVerify' },
                { label: 'Enable two-factor authentication option', key: '2fa' },
                { label: 'Auto-lock account after 5 failed logins', key: 'autoLock' },
                { label: 'Enable CAPTCHA on login page', key: 'captcha' },
                { label: 'Force HTTPS redirects', key: 'https' },
                { label: 'Log all admin actions', key: 'auditLog' },
              ].map(s => (
                <div key={s.key} className="settings-toggle-row">
                  <span>{s.label}</span>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked={['emailVerify', 'autoLock', 'https', 'auditLog'].includes(s.key)} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              ))}
              <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => showToast('Security settings saved!', 'success')}>Save Security Settings</button>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="settings-card">
              <h2>Maintenance Mode</h2>
              <div className="maintenance-warning">
                <span style={{ fontSize: '2rem' }}>⚠️</span>
                <div>
                  <strong>Warning: Maintenance mode will make the site inaccessible to students.</strong>
                  <p>Only admins will be able to access the platform while maintenance mode is active.</p>
                </div>
              </div>
              <div className="settings-toggle-row" style={{ marginBottom: '20px' }}>
                <div>
                  <span style={{ fontWeight: 600 }}>Enable Maintenance Mode</span>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Temporarily disable public access to the platform</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="form-group">
                <label>Maintenance Message</label>
                <textarea className="form-control" rows={3} defaultValue="We're currently performing scheduled maintenance. We'll be back online shortly. Thank you for your patience!" style={{ resize: 'vertical' }} />
              </div>
              <button className="btn btn-danger" onClick={() => showToast('Maintenance settings updated!', 'info')}>Update Maintenance Settings</button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
        .admin-page-header h1 { font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: 4px; }
        .admin-page-header p { color: var(--text-secondary); font-size: 0.88rem; }
        .settings-layout { display: grid; grid-template-columns: 220px 1fr; gap: 24px; }
        .settings-nav { display: flex; flex-direction: column; gap: 4px; }
        .settings-tab { padding: 12px 16px; background: none; border: none; border-radius: var(--radius-sm); text-align: left; font-size: 0.88rem; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
        .settings-tab:hover { background: rgba(255,255,255,0.04); color: var(--text-primary); }
        .settings-tab.active { background: rgba(0,212,255,0.1); color: var(--accent-primary); font-weight: 600; }
        .settings-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 32px; }
        .settings-card h2 { font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; margin-bottom: 24px; }
        .settings-toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--border-color); font-size: 0.9rem; color: var(--text-secondary); }
        .settings-toggle-row:last-of-type { border-bottom: none; }
        .toggle { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .toggle-slider { position: absolute; cursor: pointer; inset: 0; background: var(--border-color); border-radius: 24px; transition: 0.3s; }
        .toggle-slider::before { content: ''; position: absolute; height: 18px; width: 18px; left: 3px; bottom: 3px; background: var(--text-muted); border-radius: 50%; transition: 0.3s; }
        .toggle input:checked + .toggle-slider { background: var(--accent-primary); }
        .toggle input:checked + .toggle-slider::before { transform: translateX(20px); background: white; }
        .maintenance-warning { background: rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.3); border-radius: var(--radius-sm); padding: 16px; display: flex; gap: 16px; align-items: flex-start; margin-bottom: 24px; }
        .maintenance-warning strong { display: block; color: var(--accent-orange); margin-bottom: 4px; font-size: 0.9rem; }
        .maintenance-warning p { font-size: 0.82rem; color: var(--text-secondary); }
        select.form-control { background: rgba(255,255,255,0.05); cursor: pointer; }
        select.form-control option { background: var(--bg-card); color: var(--text-primary); }
        @media (max-width: 768px) { .settings-layout { grid-template-columns: 1fr; } .settings-nav { flex-direction: row; flex-wrap: wrap; } }
      `}</style>
    </div>
  );
};

export default AdminSettings;
