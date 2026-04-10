import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../../components/CourseCard';
import { COURSES, STATS, INSTRUCTORS } from '../../utils/mockData';

const Home = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const move = (e) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = el.getBoundingClientRect();
      const x = ((clientX - left) / width - 0.5) * 20;
      const y = ((clientY - top) / height - 0.5) * 20;
      el.style.setProperty('--rx', `${y}deg`);
      el.style.setProperty('--ry', `${x}deg`);
    };
    el.addEventListener('mousemove', move);
    return () => el.removeEventListener('mousemove', move);
  }, []);

  const featuredCourses = COURSES.filter(c => c.featured).slice(0, 3);

  return (
    <div className="home-page page-enter">
      {/* Hero */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg">
          <div className="orb orb-1"/>
          <div className="orb orb-2"/>
          <div className="orb orb-3"/>
          <div className="grid-lines"/>
        </div>
        <div className="container hero-content">
          <div className="hero-tag">
            <span className="tag-dot"/> 
            <span>🚀 Join 120,000+ learners worldwide</span>
          </div>
          <h1 className="hero-title">
            Transform Your<br/>
            <span className="gradient-text">Career With</span><br/>
            Expert-Led Courses
          </h1>
          <p className="hero-subtitle">
            Master in-demand skills with world-class instructors. From web development to data science — your learning journey starts here.
          </p>
          <div className="hero-cta">
            <Link to="/courses" className="btn btn-primary btn-lg">
              Explore Courses
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">Start Free Trial</Link>
          </div>

          <div className="hero-stats">
            {[
              { value: STATS.totalStudents, label: 'Students' },
              { value: STATS.totalCourses, label: 'Courses' },
              { value: STATS.totalInstructors, label: 'Instructors' },
              { value: STATS.satisfaction, label: 'Satisfaction' },
            ].map(s => (
              <div key={s.label} className="hero-stat">
                <span className="stat-value gradient-text">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating cards */}
        <div className="hero-float">
          <div className="float-card float-1">
            <div className="float-icon">🎯</div>
            <div><strong>New Course</strong><br/><small>React Advanced</small></div>
          </div>
          <div className="float-card float-2">
            <div className="float-icon">⭐</div>
            <div><strong>4.9 Rating</strong><br/><small>Top Rated</small></div>
          </div>
          <div className="float-card float-3">
            <div className="float-icon">🏆</div>
            <div><strong>Certificate</strong><br/><small>Industry Recognized</small></div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-section">
        <div className="marquee-track">
          {['React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'TypeScript', 'Figma', 'Machine Learning', 'Kubernetes', 'GraphQL', 'TailwindCSS'].map((t, i) => (
            <span key={i} className="marquee-item">{t}</span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why EduSphere?</span>
            <h2 className="section-title">Everything You Need to <span className="gradient-text">Succeed</span></h2>
            <p className="section-sub">Built for the modern learner — powerful features that adapt to your schedule and goals.</p>
          </div>
          <div className="grid-3 features-grid">
            {[
              { icon: '🎓', title: 'Expert Instructors', desc: 'Learn from industry veterans with years of real-world experience at top companies.' },
              { icon: '📱', title: 'Learn Anywhere', desc: 'Access your courses on any device. Download for offline viewing when on the go.' },
              { icon: '🏅', title: 'Certified Learning', desc: 'Earn industry-recognized certificates that employers actually value.' },
              { icon: '🔄', title: 'Lifetime Access', desc: 'Pay once, access forever. Plus free updates as courses are refreshed.' },
              { icon: '💬', title: 'Live Q&A Sessions', desc: 'Get real-time answers from instructors during live weekly sessions.' },
              { icon: '🤝', title: 'Career Support', desc: 'Job placement assistance, resume reviews, and interview prep included.' },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="section courses-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Top Picks</span>
            <h2 className="section-title">Featured <span className="gradient-text">Courses</span></h2>
            <p className="section-sub">Handpicked by our team — the most impactful courses in trending technologies.</p>
          </div>
          <div className="grid-3">
            {featuredCourses.map(c => <CourseCard key={c.id} course={c}/>)}
          </div>
          <div className="section-cta">
            <Link to="/courses" className="btn btn-secondary">View All 500+ Courses →</Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section how-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The Process</span>
            <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>
          </div>
          <div className="how-steps">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up free in 30 seconds — no credit card needed to get started.', icon: '👤' },
              { step: '02', title: 'Pick a Course', desc: 'Browse 500+ courses and choose what matches your goals and skill level.', icon: '🎯' },
              { step: '03', title: 'Learn & Practice', desc: 'Watch videos, complete projects, and test your knowledge with quizzes.', icon: '💻' },
              { step: '04', title: 'Get Certified', desc: 'Earn your certificate and showcase it on LinkedIn or your resume.', icon: '🏆' },
            ].map((s, i) => (
              <div key={s.step} className="how-step">
                <div className="step-number">{s.step}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < 3 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="section instructors-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Meet the Experts</span>
            <h2 className="section-title">Top <span className="gradient-text">Instructors</span></h2>
          </div>
          <div className="grid-3">
            {INSTRUCTORS.map(inst => (
              <div key={inst.id} className="instructor-card card">
                <div className="inst-avatar" style={{background: `hsl(${inst.id * 80}, 70%, 50%)`}}>
                  {inst.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <h3>{inst.name}</h3>
                <p>{inst.bio}</p>
                <div className="inst-stats">
                  <span>📚 {inst.courses} courses</span>
                  <span>👥 {inst.students.toLocaleString()} students</span>
                  <span>⭐ {inst.rating}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/instructors" className="btn btn-secondary">View All Instructors →</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Student Success Stories</span>
            <h2 className="section-title">What Our Students <span className="gradient-text">Say</span></h2>
          </div>
          <div className="grid-3">
            {[
              { name: 'Priya Sharma', role: 'Software Engineer @ Google', text: 'EduSphere transformed my career. The MERN course was so comprehensive — I landed my dream job within 3 months!', rating: 5 },
              { name: 'Rohit Mehta', role: 'Data Scientist @ Microsoft', text: 'The Python & ML course is exceptional. Real projects, expert feedback, and a community that actually helps.', rating: 5 },
              { name: 'Ananya Patel', role: 'UX Designer @ Flipkart', text: 'Finally a platform where instructors truly care. The design masterclass opened doors I never thought possible.', rating: 5 },
            ].map(t => (
              <div key={t.name} className="testimonial-card card">
                <div className="test-stars">{'★'.repeat(t.rating)}</div>
                <p className="test-text">"{t.text}"</p>
                <div className="test-author">
                  <div className="test-avatar">{t.name[0]}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-content">
            <div className="cta-orb"/>
            <h2>Ready to Level Up<br/><span className="gradient-text">Your Skills?</span></h2>
            <p>Join thousands of learners who transformed their careers with EduSphere. Start free today.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">Start Learning Free</Link>
              <Link to="/courses" className="btn btn-secondary btn-lg">Browse Courses</Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* Hero */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding-top: var(--navbar-h);
        }
        .hero-bg { position: absolute; inset: 0; z-index: 0; }
        .orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.15;
          animation: float 6s ease-in-out infinite;
        }
        .orb-1 { width: 600px; height: 600px; background: var(--accent-primary); top: -200px; right: -100px; }
        .orb-2 { width: 400px; height: 400px; background: var(--accent-secondary); bottom: 100px; left: -100px; animation-delay: 2s; }
        .orb-3 { width: 300px; height: 300px; background: var(--accent-green); top: 40%; right: 20%; animation-delay: 4s; }
        .grid-lines {
          position: absolute; inset: 0;
          background-image: linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px);
          background-size: 60px 60px;
          opacity: 0.3;
        }
        .hero-content {
          position: relative; z-index: 1;
          padding-top: 80px; padding-bottom: 80px;
          max-width: 700px;
        }
        .hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 100px;
          padding: 8px 16px;
          font-size: 0.85rem;
          color: var(--accent-primary);
          margin-bottom: 24px;
          animation: fadeInUp 0.6s ease;
        }
        .tag-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-primary); animation: pulse-glow 2s infinite; }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
          animation: fadeInUp 0.6s 0.1s ease both;
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 520px;
          line-height: 1.7;
          margin-bottom: 36px;
          animation: fadeInUp 0.6s 0.2s ease both;
        }
        .hero-cta { display: flex; gap: 16px; margin-bottom: 48px; flex-wrap: wrap; animation: fadeInUp 0.6s 0.3s ease both; }
        .hero-stats { display: flex; gap: 40px; flex-wrap: wrap; animation: fadeInUp 0.6s 0.4s ease both; }
        .hero-stat { display: flex; flex-direction: column; gap: 2px; }
        .stat-value { font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; }
        .stat-label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .hero-float { position: absolute; right: 10%; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 16px; }
        .float-card {
          display: flex; align-items: center; gap: 12px;
          background: rgba(15, 31, 56, 0.8);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          animation: float 4s ease-in-out infinite;
          font-size: 0.82rem;
        }
        .float-card strong { display: block; color: var(--text-primary); }
        .float-card small { color: var(--text-muted); }
        .float-1 { animation-delay: 0s; }
        .float-2 { animation-delay: 1.5s; }
        .float-3 { animation-delay: 3s; }
        .float-icon { font-size: 1.4rem; }
        /* Marquee */
        .marquee-section { overflow: hidden; padding: 20px 0; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); background: var(--bg-secondary); }
        .marquee-track { display: flex; gap: 40px; animation: marquee 20s linear infinite; width: max-content; }
        .marquee-item { font-family: var(--font-display); font-weight: 600; color: var(--text-muted); font-size: 0.9rem; white-space: nowrap; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        /* Section headers */
        .section-header { text-align: center; margin-bottom: 48px; }
        .section-tag { display: inline-block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--accent-primary); margin-bottom: 12px; }
        .section-title { font-family: var(--font-display); font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 12px; }
        .section-sub { color: var(--text-secondary); max-width: 540px; margin: 0 auto; font-size: 1rem; }
        .section-cta { text-align: center; margin-top: 40px; }
        /* Features */
        .features-section { background: var(--bg-secondary); }
        .feature-card {
          padding: 28px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          transition: var(--transition);
        }
        .feature-card:hover { border-color: rgba(0,212,255,0.3); transform: translateY(-4px); box-shadow: var(--shadow-glow); }
        .feature-icon { font-size: 2rem; margin-bottom: 16px; }
        .feature-card h3 { font-family: var(--font-display); font-weight: 700; font-size: 1.05rem; margin-bottom: 8px; }
        .feature-card p { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; }
        /* How steps */
        .how-section { background: var(--bg-primary); }
        .how-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; position: relative; }
        .how-step { text-align: center; padding: 32px 20px; position: relative; }
        .step-number { font-family: var(--font-display); font-size: 3rem; font-weight: 900; color: var(--border-color); line-height: 1; margin-bottom: 8px; }
        .step-icon { font-size: 2.5rem; margin-bottom: 16px; }
        .how-step h3 { font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; margin-bottom: 8px; }
        .how-step p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; }
        .step-arrow { position: absolute; top: 40px; right: -12px; font-size: 1.5rem; color: var(--accent-primary); z-index: 1; }
        /* Instructors */
        .instructor-card { padding: 28px; text-align: center; }
        .inst-avatar { width: 72px; height: 72px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.3rem; color: white; margin: 0 auto 16px; }
        .instructor-card h3 { font-family: var(--font-display); font-weight: 700; font-size: 1.05rem; margin-bottom: 8px; }
        .instructor-card p { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px; }
        .inst-stats { display: flex; gap: 12px; justify-content: center; font-size: 0.78rem; color: var(--text-muted); flex-wrap: wrap; }
        /* Testimonials */
        .testimonials-section { background: var(--bg-secondary); }
        .testimonial-card { padding: 28px; }
        .test-stars { color: var(--accent-orange); font-size: 1.1rem; margin-bottom: 16px; letter-spacing: 2px; }
        .test-text { font-size: 0.92rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 20px; font-style: italic; }
        .test-author { display: flex; align-items: center; gap: 12px; }
        .test-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--bg-primary); flex-shrink: 0; }
        .test-author strong { display: block; font-size: 0.9rem; }
        .test-author span { font-size: 0.8rem; color: var(--text-muted); }
        /* CTA */
        .cta-banner { padding: 80px 0; background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary)); border-top: 1px solid var(--border-color); position: relative; overflow: hidden; }
        .cta-content { text-align: center; position: relative; z-index: 1; }
        .cta-orb { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%); pointer-events: none; }
        .cta-content h2 { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 16px; }
        .cta-content p { color: var(--text-secondary); font-size: 1rem; margin-bottom: 32px; max-width: 440px; margin-left: auto; margin-right: auto; }
        .cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        /* Responsive */
        @media (max-width: 1024px) { .hero-float { display: none; } }
        @media (max-width: 768px) { .how-steps { grid-template-columns: 1fr 1fr; } .step-arrow { display: none; } }
        @media (max-width: 480px) { .how-steps { grid-template-columns: 1fr; } .hero-stats { gap: 24px; } }
      `}</style>
    </div>
  );
};

export default Home;
