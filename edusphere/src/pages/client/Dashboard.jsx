import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { enrollmentsAPI } from '../../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [activeTab, setActiveTab] = useState('my-courses');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await enrollmentsAPI.getMy();
        setEnrollments(data.data || []);
      } catch (err) {
        console.error('Failed to fetch enrollments:', err.message);
      } finally {
        setLoadingEnrollments(false);
      }
    };
    fetchEnrollments();
  }, []);

  const announcements = [
    { id: 1, title: 'New React 18 Content Added', course: 'Full-Stack MERN', time: '2 hours ago', icon: '📢' },
    { id: 2, title: 'Live Session: Data Visualization', course: 'Python Data Science', time: '1 day ago', icon: '🎥' },
    { id: 3, title: 'Assignment Due Tomorrow', course: 'UI/UX Masterclass', time: '3 hours ago', icon: '📝' },
  ];

  const achievements = [
    { icon: '🎯', title: 'Quick Learner', desc: 'Completed 5 lessons in one day' },
    { icon: '🔥', title: '7-Day Streak', desc: 'Logged in 7 days in a row' },
    { icon: '⭐', title: 'First Course', desc: 'Enrolled in your first course' },
  ];

  return (
    <div className="dashboard page-enter" style={{ paddingTop: 'var(--navbar-h)', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="dash-header">
        <div className="container">
          <div className="dash-header-inner">
            <div>
              <h1>Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋</h1>
              <p>Continue your learning journey. You're doing great!</p>
            </div>
            <Link to="/courses" className="btn btn-primary">+ Explore Courses</Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        <div className="grid-4" style={{ marginBottom: '32px' }}>
          {[
            { label: 'Enrolled Courses', value: enrollments.length, icon: '📚', color: 'var(--accent-primary)' },
            { label: 'Hours Learned', value: '48h', icon: '⏱', color: 'var(--accent-secondary)' },
            { label: 'Certificates', value: enrollments.filter(e => e.isCompleted).length, icon: '🏅', color: 'var(--accent-green)' },
            { label: 'Current Streak', value: '7 days', icon: '🔥', color: 'var(--accent-orange)' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="scard-top">
                <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.value}</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
              {['my-courses', 'announcements', 'achievements'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '10px 20px', background: 'none', border: 'none', color: activeTab === t ? 'var(--accent-primary)' : 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: activeTab === t ? 600 : 400, cursor: 'pointer', borderBottom: activeTab === t ? '2px solid var(--accent-primary)' : '2px solid transparent', marginBottom: '-1px', transition: 'all 0.2s' }}>
                  {t === 'my-courses' ? 'My Courses' : t === 'announcements' ? 'Announcements' : 'Achievements'}
                </button>
              ))}
            </div>

            {activeTab === 'my-courses' && (
              <div>
                {loadingEnrollments ? (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div className="spinner" style={{ margin: '0 auto' }} />
                    <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>Loading your courses...</p>
                  </div>
                ) : enrollments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
                    <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px' }}>No courses yet</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Enroll in your first course to start learning!</p>
                    <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {enrollments.map(enrollment => (
                      <div key={enrollment._id} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px', transition: 'var(--transition)' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', background: `radial-gradient(circle, ${enrollment.course?.color || '#00d4ff'}20, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border-color)', fontSize: '2rem' }}>📖</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{enrollment.course?.title || 'Course'}</h3>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{enrollment.course?.instructor}</p>
                          <div className="progress-bar"><div className="progress-fill" style={{ width: `${enrollment.progress || 0}%` }} /></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            <span>{enrollment.progress || 0}% complete</span>
                            <span>{enrollment.isCompleted ? '✅ Completed' : 'In Progress'}</span>
                          </div>
                        </div>
                        <Link to={`/courses/${enrollment.course?._id}`} className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>Continue</Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'announcements' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {announcements.map(a => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '1.4rem', flexShrink: 0 }}>{a.icon}</div>
                    <div style={{ flex: 1 }}><h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '2px' }}>{a.title}</h4><p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{a.course} · {a.time}</p></div>
                    <button className="btn btn-secondary btn-sm">View</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="grid-3">
                {achievements.map(a => (
                  <div key={a.title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{a.icon}</div>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>{a.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '16px' }}>Learning Streak</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>7</span>
                <span style={{ fontSize: '1.1rem' }}>Days 🔥</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Keep it up! You're on a roll.</p>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '16px' }}>Quick Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[{ label: '📜 My Certificates', to: '/profile' }, { label: '👤 Edit Profile', to: '/profile' }, { label: '🔔 Notifications', to: '#' }, { label: '⚙ Settings', to: '#' }].map(l => (
                  <Link key={l.label} to={l.to} style={{ padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', transition: 'all 0.2s' }}>{l.label}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
