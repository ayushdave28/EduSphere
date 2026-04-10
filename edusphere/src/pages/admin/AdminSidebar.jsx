import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: '⊞', exact: true },
    { to: '/admin/courses', label: 'Courses', icon: '📚' },
    { to: '/admin/students', label: 'Students', icon: '👥' },
    { to: '/admin/instructors', label: 'Instructors', icon: '🎓' },
    { to: '/admin/analytics', label: 'Analytics', icon: '📊' },
    { to: '/admin/settings', label: 'Settings', icon: '⚙' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Overlay */}
      {open && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem' }}>
            <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
              <circle cx="16" cy="16" r="14" stroke="url(#sg1)" strokeWidth="2" />
              <path d="M10 16l4 4 8-8" stroke="url(#sg1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs><linearGradient id="sg1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#00d4ff" /><stop offset="1" stopColor="#7c3aed" /></linearGradient></defs>
            </svg>
            Edu<span style={{ color: 'var(--accent-primary)' }}>Sphere</span>
          </Link>
          <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>Admin</span>
        </div>

        <div className="divider" style={{ margin: '0' }} />

        {/* Nav */}
        <nav className="sidebar-nav">
          <p className="nav-section-label">Main Menu</p>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="sidebar-user">
          <div className="su-avatar">{user?.name?.charAt(0)}</div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrator</p>
          </div>
          <button onClick={handleLogout} title="Logout" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem', padding: '4px' }}>
            ⎋
          </button>
        </div>
      </aside>

      <style>{`
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 99; }
        .sidebar-logo { padding: 20px; display: flex; align-items: center; justify-content: space-between; }
        .sidebar-nav { padding: 12px; flex: 1; overflow-y: auto; }
        .nav-section-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); padding: 8px 12px; margin-bottom: 4px; }
        .sidebar-link { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-sm); font-size: 0.88rem; color: var(--text-secondary); transition: all 0.2s; margin-bottom: 2px; }
        .sidebar-link:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
        .sidebar-link.active { background: rgba(0,212,255,0.1); color: var(--accent-primary); font-weight: 600; }
        .sidebar-link.active .sidebar-icon { filter: none; }
        .sidebar-icon { font-size: 1rem; width: 20px; text-align: center; }
        .sidebar-user { padding: 16px; border-top: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px; }
        .su-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; color: var(--bg-primary); flex-shrink: 0; }
      `}</style>
    </>
  );
};

export default AdminSidebar;
