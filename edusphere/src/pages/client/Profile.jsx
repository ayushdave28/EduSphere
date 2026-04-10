import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', bio: '', phone: '', location: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});

  useEffect(() => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
      location: user?.location || '',
    });
  }, [user]);

  const handleChange = (e) => { setForm(f => ({...f, [e.target.name]: e.target.value})); setErrors(x => ({...x, [e.target.name]: ''})); };

  const validateProfile = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email.';
    return errs;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validateProfile();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    await updateProfile({
      name: form.name,
      email: form.email,
      bio: form.bio,
      phone: form.phone,
      location: form.location,
    });
    setSaving(false);
  };

  const validatePw = () => {
    const errs = {};
    if (!pwForm.current) errs.current = 'Current password required.';
    if (!pwForm.newPw) errs.newPw = 'New password required.';
    else if (pwForm.newPw.length < 8) errs.newPw = 'Min 8 characters.';
    else if (!/(?=.*[A-Z])/.test(pwForm.newPw)) errs.newPw = 'Include at least one uppercase letter.';
    else if (!/(?=.*[0-9])/.test(pwForm.newPw)) errs.newPw = 'Include at least one number.';
    if (pwForm.newPw !== pwForm.confirm) errs.confirm = 'Passwords do not match.';
    return errs;
  };

  const handlePwSave = async (e) => {
    e.preventDefault();
    const errs = validatePw();
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    await updatePassword(pwForm.current, pwForm.newPw);
    setSaving(false);
    setPwForm({ current: '', newPw: '', confirm: '' });
  };

  return (
    <div className="profile-page page-enter" style={{paddingTop:'var(--navbar-h)', minHeight:'100vh'}}>
      <div className="container" style={{padding:'40px 24px', maxWidth:'900px'}}>
        <h1 style={{fontFamily:'var(--font-display)',fontSize:'2rem',fontWeight:800,marginBottom:'32px'}}>
          My <span className="gradient-text">Profile</span>
        </h1>

        <div className="profile-layout">
          {/* Avatar sidebar */}
          <div className="profile-sidebar">
            <div className="avatar-section">
              <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h3>{user?.name}</h3>
              <span className="badge badge-blue">{user?.role}</span>
              <p style={{fontSize:'0.82rem',color:'var(--text-muted)',marginTop:'8px'}}>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently joined'}</p>
              <button className="btn btn-secondary btn-sm" style={{marginTop:'12px'}}>Change Photo</button>
            </div>

            <div className="profile-nav">
              {['profile','password','notifications'].map(t => (
                <button key={t} className={`pnav-item ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                  {t === 'profile' ? '👤 Profile Info' : t === 'password' ? '🔒 Change Password' : '🔔 Notifications'}
                </button>
              ))}
            </div>
          </div>

          {/* Main */}
          <div className="profile-main">
            {activeTab === 'profile' && (
              <div className="profile-card">
                <h2>Profile Information</h2>
                <form onSubmit={handleSave} noValidate>
                  <div className="grid-2">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" name="name" className={`form-control ${errors.name ? 'error' : ''}`} value={form.name} onChange={handleChange}/>
                      {errors.name && <span className="error-msg">⚠ {errors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" name="email" className={`form-control ${errors.email ? 'error' : ''}`} value={form.email} onChange={handleChange}/>
                      {errors.email && <span className="error-msg">⚠ {errors.email}</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea name="bio" className="form-control" rows={3} placeholder="Tell us about yourself..." value={form.bio} onChange={handleChange} style={{resize:'vertical'}}/>
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="tel" name="phone" className="form-control" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input type="text" name="location" className="form-control" placeholder="Mumbai, India" value={form.location} onChange={handleChange}/>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? '⏳ Saving...' : '✓ Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="profile-card">
                <h2>Change Password</h2>
                <form onSubmit={handlePwSave} noValidate>
                  {[
                    { label: 'Current Password', name: 'current', key: 'current' },
                    { label: 'New Password', name: 'newPw', key: 'newPw' },
                    { label: 'Confirm New Password', name: 'confirm', key: 'confirm' },
                  ].map(f => (
                    <div key={f.name} className="form-group">
                      <label>{f.label}</label>
                      <input type="password" name={f.name} className={`form-control ${pwErrors[f.key] ? 'error' : ''}`} placeholder="••••••••" value={pwForm[f.name]} onChange={e => { setPwForm(p => ({...p, [e.target.name]: e.target.value})); setPwErrors(x => ({...x, [f.key]: ''})); }}/>
                      {pwErrors[f.key] && <span className="error-msg">⚠ {pwErrors[f.key]}</span>}
                    </div>
                  ))}
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? '⏳ Saving...' : '🔒 Update Password'}</button>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="profile-card">
                <h2>Notification Preferences</h2>
                {[
                  { label: 'Email notifications for new content', key: 'email_content' },
                  { label: 'Course completion reminders', key: 'reminders' },
                  { label: 'Promotional offers & discounts', key: 'promo' },
                  { label: 'Live session reminders', key: 'live' },
                  { label: 'Assignment due alerts', key: 'assignments' },
                ].map(n => (
                  <div key={n.key} className="notif-row">
                    <span>{n.label}</span>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked={n.key !== 'promo'}/>
                      <span className="toggle-slider"/>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .profile-layout { display: grid; grid-template-columns: 240px 1fr; gap: 24px; }
        .profile-sidebar { display: flex; flex-direction: column; gap: 16px; }
        .avatar-section { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; text-align: center; }
        .profile-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.8rem; color: var(--bg-primary); margin: 0 auto 12px; }
        .avatar-section h3 { font-family: var(--font-display); font-weight: 700; font-size: 1rem; margin-bottom: 6px; }
        .profile-nav { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); overflow: hidden; }
        .pnav-item { width: 100%; padding: 14px 16px; background: none; border: none; text-align: left; font-size: 0.88rem; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; border-bottom: 1px solid var(--border-color); }
        .pnav-item:last-child { border-bottom: none; }
        .pnav-item:hover { color: var(--text-primary); background: rgba(255,255,255,0.03); }
        .pnav-item.active { color: var(--accent-primary); background: rgba(0,212,255,0.05); font-weight: 600; }
        .profile-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 32px; }
        .profile-card h2 { font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; margin-bottom: 24px; }
        .notif-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--border-color); font-size: 0.9rem; color: var(--text-secondary); }
        .notif-row:last-child { border-bottom: none; }
        .toggle { position: relative; display: inline-block; width: 44px; height: 24px; }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .toggle-slider { position: absolute; cursor: pointer; inset: 0; background: var(--border-color); border-radius: 24px; transition: 0.3s; }
        .toggle-slider::before { content: ''; position: absolute; height: 18px; width: 18px; left: 3px; bottom: 3px; background: var(--text-muted); border-radius: 50%; transition: 0.3s; }
        .toggle input:checked + .toggle-slider { background: var(--accent-primary); }
        .toggle input:checked + .toggle-slider::before { transform: translateX(20px); background: white; }
        @media (max-width: 768px) { .profile-layout { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default Profile;
