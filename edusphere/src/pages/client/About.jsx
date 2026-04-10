import React from 'react';
import { Link } from 'react-router-dom';

const About = () => (
  <div className="about-page page-enter" style={{ paddingTop: 'var(--navbar-h)', minHeight: '100vh' }}>
    {/* Hero */}
    <div className="about-hero">
      <div className="about-orb about-orb-1" />
      <div className="about-orb about-orb-2" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <span className="section-tag">Our Story</span>
        <h1>Empowering Learners,<br /><span className="gradient-text">One Course at a Time</span></h1>
        <p>EduSphere was born from a simple belief: quality education should be accessible to everyone, everywhere. We're on a mission to democratize learning through technology.</p>
      </div>
    </div>

    <div className="container" style={{ padding: '64px 24px' }}>
      {/* Mission */}
      <div className="about-section">
        <div className="about-section-inner">
          <div className="about-text">
            <span className="section-tag">Our Mission</span>
            <h2>Building the Future of <span className="gradient-text">Online Learning</span></h2>
            <p>Founded in 2020, EduSphere has grown from a small startup to a global platform serving learners in 150+ countries. We believe that the best learning happens when world-class content meets an engaging, modern experience.</p>
            <p>Our platform combines cutting-edge technology with expert-crafted content to deliver a learning experience that's not just effective — it's genuinely enjoyable.</p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '28px', flexWrap: 'wrap' }}>
              <Link to="/courses" className="btn btn-primary">Explore Courses</Link>
              <Link to="/register" className="btn btn-secondary">Join Free</Link>
            </div>
          </div>
          <div className="about-visual">
            <div className="about-card-stack">
              {[
                { icon: '🌍', text: '150+ Countries', color: '#00d4ff' },
                { icon: '📚', text: '500+ Courses', color: '#7c3aed' },
                { icon: '🏆', text: '#1 EdTech Platform', color: '#00e5a0' },
              ].map(c => (
                <div key={c.text} className="about-float-card" style={{ '--c': c.color }}>
                  <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="about-values">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-tag">What Drives Us</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginTop: '8px' }}>Our Core <span className="gradient-text">Values</span></h2>
        </div>
        <div className="grid-3">
          {[
            { icon: '🎯', title: 'Accessibility', desc: 'We believe great education shouldn\'t be limited by geography or financial means. Our courses are priced fairly and available worldwide.' },
            { icon: '⚡', title: 'Quality First', desc: 'Every course goes through rigorous review before publishing. We maintain the highest standards so you can trust every lesson.' },
            { icon: '🤝', title: 'Community', desc: 'Learning is better together. Our community forums, study groups, and live sessions connect millions of learners globally.' },
            { icon: '🔄', title: 'Always Updating', desc: 'Tech moves fast. Our instructors continuously update their courses to keep you on the cutting edge of every field.' },
            { icon: '📈', title: 'Career-Focused', desc: 'Every curriculum is designed with real career outcomes in mind, vetted by hiring managers at top companies.' },
            { icon: '🛡️', title: 'Trust & Safety', desc: 'Your data, your learning, your privacy. We maintain strict standards to keep your information safe and your experience secure.' },
          ].map(v => (
            <div key={v.title} className="value-card">
              <div className="value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="about-timeline">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="section-tag">Our Journey</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginTop: '8px' }}>From Startup to <span className="gradient-text">Global Platform</span></h2>
        </div>
        <div className="timeline">
          {[
            { year: '2020', title: 'Founded', desc: 'EduSphere launches with 10 courses and a dream to make education accessible.' },
            { year: '2021', title: '10K Students', desc: 'Hit our first 10,000 students milestone. Expanded to 50 courses across 5 categories.' },
            { year: '2022', title: 'Global Expansion', desc: 'Expanded to 50+ countries. Launched mobile apps for iOS and Android.' },
            { year: '2023', title: '100K+ Learners', desc: 'Crossed 100,000 active students. Introduced live sessions and 1-on-1 mentoring.' },
            { year: '2024', title: 'AI Integration', desc: 'Launched AI-powered personalized learning paths and adaptive quiz system.' },
            { year: '2025', title: '120K+ Strong', desc: 'Today, with 120,000+ learners and 500+ courses, we\'re just getting started.' },
          ].map((t, i) => (
            <div key={t.year} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
              <div className="tl-content">
                <span className="tl-year gradient-text">{t.year}</span>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
              </div>
              <div className="tl-dot" />
            </div>
          ))}
        </div>
      </div>

      {/* Contact section */}
      <div className="contact-section">
        <h2>Get in <span className="gradient-text">Touch</span></h2>
        <p>Have questions? We'd love to hear from you. Our team typically responds within 24 hours.</p>
        <div className="contact-grid">
          {[
            { icon: '📧', title: 'Email Us', info: 'hello@edusphere.com', sub: 'We reply within 24 hours' },
            { icon: '💬', title: 'Live Chat', info: 'Available 24/7', sub: 'Instant support anytime' },
            { icon: '📞', title: 'Call Us', info: '+91 98765 43210', sub: 'Mon–Fri, 9am–6pm IST' },
          ].map(c => (
            <div key={c.title} className="contact-card">
              <div className="contact-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p className="contact-info">{c.info}</p>
              <p className="contact-sub">{c.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <style>{`
      .about-hero { padding: 80px 0; text-align: center; background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary)); border-bottom: 1px solid var(--border-color); position: relative; overflow: hidden; }
      .about-orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.1; }
      .about-orb-1 { width: 500px; height: 500px; background: var(--accent-primary); top: -200px; right: -100px; }
      .about-orb-2 { width: 400px; height: 400px; background: var(--accent-secondary); bottom: -200px; left: -100px; }
      .about-hero h1 { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 800; letter-spacing: -0.02em; margin: 12px 0; }
      .about-hero p { color: var(--text-secondary); max-width: 580px; margin: 0 auto; font-size: 1.05rem; line-height: 1.7; }
      .about-section { margin-bottom: 80px; }
      .about-section-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
      .about-text .section-tag { display: block; margin-bottom: 12px; }
      .about-text h2 { font-family: var(--font-display); font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 16px; }
      .about-text p { color: var(--text-secondary); line-height: 1.7; margin-bottom: 12px; font-size: 0.95rem; }
      .about-visual { display: flex; justify-content: center; }
      .about-card-stack { display: flex; flex-direction: column; gap: 12px; }
      .about-float-card { display: flex; align-items: center; gap: 12px; padding: 16px 24px; background: var(--bg-card); border: 1px solid rgba(255,255,255,0.1); border-left: 3px solid var(--c); border-radius: var(--radius-md); box-shadow: var(--shadow-card); transition: var(--transition); }
      .about-float-card:nth-child(2) { margin-left: 32px; }
      .about-float-card:nth-child(3) { margin-left: 64px; }
      .about-float-card:hover { transform: translateX(8px); }
      .about-values { margin-bottom: 80px; }
      .value-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 28px; transition: var(--transition); }
      .value-card:hover { border-color: rgba(0,212,255,0.25); transform: translateY(-4px); }
      .value-icon { font-size: 2rem; margin-bottom: 14px; }
      .value-card h3 { font-family: var(--font-display); font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
      .value-card p { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.65; }
      .about-timeline { margin-bottom: 80px; }
      .timeline { position: relative; padding: 20px 0; }
      .timeline::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: linear-gradient(180deg, var(--accent-primary), var(--accent-secondary)); transform: translateX(-50%); }
      .timeline-item { display: flex; align-items: center; margin-bottom: 40px; }
      .timeline-item.left { flex-direction: row-reverse; }
      .tl-content { width: calc(50% - 40px); padding: 20px 24px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); }
      .timeline-item.left .tl-content { margin-right: 40px; text-align: right; }
      .timeline-item.right .tl-content { margin-left: 40px; }
      .tl-year { font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; display: block; margin-bottom: 4px; }
      .tl-content h3 { font-family: var(--font-display); font-size: 1rem; font-weight: 700; margin-bottom: 6px; }
      .tl-content p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; }
      .tl-dot { width: 16px; height: 16px; border-radius: 50%; background: var(--accent-primary); border: 3px solid var(--bg-primary); flex-shrink: 0; position: relative; z-index: 1; }
      .contact-section { text-align: center; }
      .contact-section h2 { font-family: var(--font-display); font-size: 2rem; font-weight: 800; margin-bottom: 8px; }
      .contact-section > p { color: var(--text-secondary); margin-bottom: 40px; }
      .contact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
      .contact-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 32px; transition: var(--transition); }
      .contact-card:hover { border-color: rgba(0,212,255,0.25); transform: translateY(-4px); }
      .contact-icon { font-size: 2.5rem; margin-bottom: 14px; }
      .contact-card h3 { font-family: var(--font-display); font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
      .contact-info { font-weight: 600; font-size: 0.95rem; margin-bottom: 4px; color: var(--accent-primary); }
      .contact-sub { font-size: 0.8rem; color: var(--text-muted); }
      @media (max-width: 1024px) { .about-section-inner { grid-template-columns: 1fr; } .timeline::before { left: 20px; } .timeline-item, .timeline-item.left { flex-direction: row; } .tl-content, .timeline-item.left .tl-content, .timeline-item.right .tl-content { width: calc(100% - 60px); margin-left: 40px; margin-right: 0; text-align: left; } .tl-dot { margin-left: 0; } .contact-grid { grid-template-columns: 1fr; } }
      @media (max-width: 640px) { .about-float-card:nth-child(2), .about-float-card:nth-child(3) { margin-left: 0; } }
    `}</style>
  </div>
);

export default About;
