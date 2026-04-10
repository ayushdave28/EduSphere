import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="url(#g1)" strokeWidth="2"/>
              <path d="M10 16l4 4 8-8" stroke="url(#g1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00d4ff"/>
                  <stop offset="1" stopColor="#7c3aed"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span>Edu<span className="logo-accent">Sphere</span></span>
        </Link>

        {/* Nav links */}
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/courses" onClick={() => setMenuOpen(false)}>Courses</NavLink>
          <NavLink to="/instructors" onClick={() => setMenuOpen(false)}>Instructors</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
          {user && user.role === 'student' && (
            <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>My Learning</NavLink>
          )}
        </div>

        {/* Right */}
        <div className="nav-right">
          {user ? (
            <div className="nav-user" onClick={() => setDropOpen(!dropOpen)}>
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user.name.split(' ')[0]}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
              {dropOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                    <span className={`badge badge-${user.role === 'admin' ? 'purple' : 'blue'}`}>{user.role}</span>
                  </div>
                  <div className="dropdown-divider"/>
                  {user.role === 'admin' ? (
                    <Link to="/admin" className="dropdown-item" onClick={() => setDropOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                      Admin Panel
                    </Link>
                  ) : (
                    <>
                      <Link to="/dashboard" className="dropdown-item" onClick={() => setDropOpen(false)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                        Dashboard
                      </Link>
                      <Link to="/profile" className="dropdown-item" onClick={() => setDropOpen(false)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Profile
                      </Link>
                    </>
                  )}
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={menuOpen ? 'open' : ''}></span>
            <span className={menuOpen ? 'open' : ''}></span>
            <span className={menuOpen ? 'open' : ''}></span>
          </button>
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          padding: 16px 0;
          transition: all 0.3s ease;
        }
        .navbar.scrolled {
          background: rgba(5, 11, 24, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          padding: 12px 0;
        }
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }
        .logo-icon svg { width: 32px; height: 32px; }
        .logo-accent { color: var(--accent-primary); }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          flex: 1;
          justify-content: center;
        }
        .nav-links a {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: color 0.2s;
          position: relative;
        }
        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0; right: 0;
          height: 2px;
          background: var(--accent-primary);
          border-radius: 2px;
          transform: scaleX(0);
          transition: transform 0.2s;
        }
        .nav-links a:hover, .nav-links a.active { color: var(--text-primary); }
        .nav-links a:hover::after, .nav-links a.active::after { transform: scaleX(1); }
        .nav-right { display: flex; align-items: center; gap: 12px; }
        .nav-auth { display: flex; align-items: center; gap: 10px; }
        .nav-user {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          position: relative;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          transition: background 0.2s;
        }
        .nav-user:hover { background: rgba(255,255,255,0.05); }
        .user-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          display: flex; align-items: center; justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--bg-primary);
        }
        .user-name { font-size: 0.9rem; font-weight: 500; }
        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          min-width: 220px;
          box-shadow: var(--shadow-card);
          animation: fadeInUp 0.2s ease;
          overflow: hidden;
        }
        .dropdown-header {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .dropdown-header strong { font-size: 0.95rem; color: var(--text-primary); }
        .dropdown-header span:not(.badge) { font-size: 0.8rem; color: var(--text-muted); }
        .dropdown-divider { height: 1px; background: var(--border-color); }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          font-size: 0.9rem;
          color: var(--text-secondary);
          transition: all 0.2s;
          width: 100%;
          background: none;
          border: none;
          text-align: left;
        }
        .dropdown-item:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
        .dropdown-item.danger:hover { background: rgba(255, 61, 154, 0.1); color: var(--accent-pink); }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .hamburger span {
          display: block;
          width: 22px; height: 2px;
          background: var(--text-primary);
          border-radius: 2px;
          transition: all 0.3s;
        }
        @media (max-width: 768px) {
          .hamburger { display: flex; }
          .nav-links {
            display: none;
            position: absolute;
            top: 100%; left: 0; right: 0;
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-color);
            flex-direction: column;
            padding: 24px;
            gap: 20px;
          }
          .nav-links.open { display: flex; }
          .nav-auth .btn:first-child { display: none; }
          .user-name { display: none; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
