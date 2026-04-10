import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
              <circle cx="16" cy="16" r="14" stroke="url(#fg1)" strokeWidth="2"/>
              <path d="M10 16l4 4 8-8" stroke="url(#fg1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="fg1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00d4ff"/><stop offset="1" stopColor="#7c3aed"/>
                </linearGradient>
              </defs>
            </svg>
            <span style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'1.3rem'}}>Edu<span style={{color:'var(--accent-primary)'}}>Sphere</span></span>
          </div>
          <p>Empowering learners worldwide with cutting-edge courses and expert instructors.</p>
          <div className="social-links">
            {['Twitter','LinkedIn','YouTube','GitHub'].map(s=>(
              <a key={s} href="#" className="social-btn">{s[0]}</a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h4>Courses</h4>
          {['Web Development','Data Science','Design','Cloud Computing','Cybersecurity'].map(c=>(
            <Link key={c} to="/courses">{c}</Link>
          ))}
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          {['About Us','Careers','Blog','Press','Partners'].map(l=>(
            <Link key={l} to="/about">{l}</Link>
          ))}
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          {['Help Center','Contact Us','Privacy Policy','Terms of Service','Cookie Policy'].map(l=>(
            <a key={l} href="#">{l}</a>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 EduSphere. All rights reserved. Built with ❤️ for learners worldwide.</p>
        <div className="footer-badges">
          <span className="badge badge-green">🔒 SSL Secure</span>
          <span className="badge badge-blue">⚡ 99.9% Uptime</span>
        </div>
      </div>
    </div>

    <style>{`
      .footer {
        background: var(--bg-secondary);
        border-top: 1px solid var(--border-color);
        padding: 64px 0 32px;
        margin-top: auto;
      }
      .footer-grid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 48px;
        margin-bottom: 48px;
      }
      .footer-logo { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
      .footer-brand p { color: var(--text-muted); font-size: 0.9rem; line-height: 1.7; margin-bottom: 20px; }
      .social-links { display: flex; gap: 8px; }
      .social-btn {
        width: 36px; height: 36px;
        border-radius: 50%;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        display: flex; align-items: center; justify-content: center;
        color: var(--text-secondary);
        font-size: 0.75rem;
        font-weight: 700;
        transition: var(--transition);
      }
      .social-btn:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
      .footer-col h4 {
        font-family: var(--font-display);
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-primary);
        margin-bottom: 16px;
      }
      .footer-col a {
        display: block;
        color: var(--text-muted);
        font-size: 0.88rem;
        margin-bottom: 10px;
        transition: color 0.2s;
      }
      .footer-col a:hover { color: var(--accent-primary); }
      .footer-bottom {
        border-top: 1px solid var(--border-color);
        padding-top: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
      }
      .footer-bottom p { color: var(--text-muted); font-size: 0.85rem; }
      .footer-badges { display: flex; gap: 8px; }
      @media (max-width: 1024px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 640px) { .footer-grid { grid-template-columns: 1fr; gap: 32px; } }
    `}</style>
  </footer>
);

export default Footer;
