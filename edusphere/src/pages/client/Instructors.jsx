import React from 'react';
import { Link } from 'react-router-dom';
import { INSTRUCTORS, COURSES } from '../../utils/mockData';

const Instructors = () => {
  const allInstructors = [
    ...INSTRUCTORS,
    { id: 4, name: 'Michael Torres', courses: 4, students: 22000, rating: 4.8, bio: 'AWS Solutions Architect with 10+ years of cloud experience.' },
    { id: 5, name: 'Dr. Raj Patel', courses: 3, students: 18000, rating: 4.6, bio: 'Cybersecurity expert and certified ethical hacker.' },
    { id: 6, name: 'Lisa Wang', courses: 5, students: 26000, rating: 4.7, bio: 'React Native developer who\'s shipped 40+ apps to production.' },
  ];

  const colors = ['#00d4ff', '#7c3aed', '#ff3d9a', '#ff6b35', '#00e5a0', '#f59e0b'];

  return (
    <div className="instructors-page page-enter" style={{ paddingTop: 'var(--navbar-h)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="page-hero">
        <div className="container">
          <span className="section-tag">Meet Our Team</span>
          <h1>World-Class <span className="gradient-text">Instructors</span></h1>
          <p>Learn from industry experts who've worked at top companies and bring real-world experience to every lesson.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 24px' }}>
        {/* Stats row */}
        <div className="inst-stats-row">
          {[
            { value: '200+', label: 'Expert Instructors' },
            { value: '4.8', label: 'Average Rating' },
            { value: '2M+', label: 'Students Taught' },
            { value: '95%', label: 'Satisfaction Rate' },
          ].map(s => (
            <div key={s.label} className="inst-stat-box">
              <span className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>{s.value}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '32px' }}>Featured Instructors</h2>

        <div className="grid-3">
          {allInstructors.map((inst, i) => {
            const theirCourses = COURSES.filter(c => c.instructor === inst.name);
            return (
              <div key={inst.id} className="instructor-card card">
                <div className="inst-card-header" style={{ '--c': colors[i % colors.length] }}>
                  <div className="inst-big-av" style={{ background: `${colors[i % colors.length]}30`, border: `2px solid ${colors[i % colors.length]}` }}>
                    {inst.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="inst-card-body">
                  <h3>{inst.name}</h3>
                  <p className="inst-bio">{inst.bio}</p>
                  <div className="inst-meta">
                    <span>⭐ {inst.rating}</span>
                    <span>📚 {inst.courses} courses</span>
                    <span>👥 {inst.students.toLocaleString()}</span>
                  </div>
                  {theirCourses.length > 0 && (
                    <div className="inst-courses-preview">
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Popular Courses</p>
                      {theirCourses.slice(0, 2).map(c => (
                        <Link key={c.id} to={`/courses/${c.id}`} className="inst-course-link">
                          <span style={{ color: colors[i % colors.length] }}>▶</span> {c.title}
                        </Link>
                      ))}
                    </div>
                  )}
                  <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '16px' }}>View Profile</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Become instructor CTA */}
        <div className="become-instructor-cta">
          <div className="cta-orb" />
          <div className="bic-content">
            <span style={{ fontSize: '3rem' }}>🎓</span>
            <h2>Become an Instructor</h2>
            <p>Share your expertise with thousands of eager learners worldwide. Join our community of world-class instructors and earn while you teach.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">Apply to Teach</Link>
              <a href="#" className="btn btn-secondary btn-lg">Learn More</a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .page-hero { background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary)); border-bottom: 1px solid var(--border-color); padding: 60px 0; text-align: center; }
        .page-hero h1 { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; letter-spacing: -0.02em; margin: 12px 0; }
        .page-hero p { color: var(--text-secondary); font-size: 1rem; max-width: 560px; margin: 0 auto; }
        .inst-stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 48px; }
        .inst-stat-box { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 24px; text-align: center; display: flex; flex-direction: column; gap: 6px; }
        .instructor-card { overflow: hidden; }
        .inst-card-header { height: 80px; background: radial-gradient(ellipse at 50% 120%, var(--c, #00d4ff)25, transparent 70%); display: flex; align-items: flex-end; justify-content: center; padding-bottom: 0; position: relative; }
        .inst-big-av { width: 72px; height: 72px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.3rem; color: var(--text-primary); position: relative; top: 36px; z-index: 1; background-color: var(--bg-card); }
        .inst-card-body { padding: 52px 24px 24px; text-align: center; }
        .inst-card-body h3 { font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; margin-bottom: 8px; }
        .inst-bio { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 14px; line-height: 1.6; }
        .inst-meta { display: flex; justify-content: center; gap: 16px; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 16px; flex-wrap: wrap; }
        .inst-courses-preview { text-align: left; border-top: 1px solid var(--border-color); padding-top: 12px; }
        .inst-course-link { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-secondary); padding: 6px 0; transition: color 0.2s; }
        .inst-course-link:hover { color: var(--accent-primary); }
        .become-instructor-cta { margin-top: 64px; position: relative; background: linear-gradient(135deg, var(--bg-secondary), var(--bg-card)); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 64px 32px; text-align: center; overflow: hidden; }
        .bic-content { position: relative; z-index: 1; }
        .bic-content h2 { font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; margin: 16px 0 12px; }
        .bic-content p { color: var(--text-secondary); max-width: 480px; margin: 0 auto 28px; line-height: 1.7; }
        @media (max-width: 1024px) { .inst-stats-row { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .inst-stats-row { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  );
};

export default Instructors;
