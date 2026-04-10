import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { coursesAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user, enrollCourse, isEnrolled, showToast } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await coursesAPI.getById(id);
        setCourse(data.data);
        setEnrolled(data.isEnrolled || false);
      } catch (err) {
        showToast('Course not found.', 'error');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate, showToast]);

  // Also check local state
  useEffect(() => {
    if (course && isEnrolled(course._id)) setEnrolled(true);
  }, [course, isEnrolled]);

  const handleEnroll = async () => {
    if (!user) { showToast('Please login to enroll!', 'info'); navigate('/login'); return; }
    setEnrolling(true);
    const result = await enrollCourse(course._id);
    if (result.success) setEnrolled(true);
    setEnrolling(false);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 'var(--navbar-h)' }}>
      <div className="spinner" />
    </div>
  );

  if (!course) return null;

  const discount = course.originalPrice > course.price
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  const totalLessons = course.curriculum?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;

  return (
    <div className="course-detail page-enter" style={{ paddingTop: 'var(--navbar-h)', minHeight: '100vh' }}>
      {/* Hero */}
      <div className="detail-hero" style={{ '--c': course.color || '#00d4ff' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 80% 50%, ${course.color || '#00d4ff'}15, transparent 60%)`, pointerEvents: 'none' }} />
        <div className="container">
          <div className="detail-hero-inner">
            <div className="detail-hero-content">
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span className="badge badge-blue">{course.category}</span>
                {course.isBestseller && <span className="badge" style={{ background: 'rgba(255,107,53,0.15)', color: 'var(--accent-orange)' }}>Bestseller</span>}
                {course.isFeatured && <span className="badge badge-purple">Featured</span>}
              </div>
              <h1>{course.title}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '20px' }}>{course.description}</p>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {[
                  { v: `${course.averageRating || 0} ⭐`, l: 'Rating' },
                  { v: (course.totalReviews || 0).toLocaleString(), l: 'Reviews' },
                  { v: (course.totalStudents || 0).toLocaleString(), l: 'Students' },
                  { v: course.duration || '0h', l: 'Duration' },
                  { v: totalLessons, l: 'Lessons' },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>{s.v}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Created by <strong style={{ color: 'var(--accent-primary)' }}>{course.instructor}</strong>
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(course.tags || []).map(t => <span key={t} className="badge badge-purple">{t}</span>)}
              </div>
            </div>

            <div className="enroll-card">
              <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', background: `linear-gradient(135deg, ${course.color || '#00d4ff'}20, transparent)`, marginBottom: '20px', fontSize: '3rem' }}>🎓</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>₹{course.price?.toLocaleString()}</span>
                {discount > 0 && <>
                  <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.9rem' }}>₹{course.originalPrice?.toLocaleString()}</span>
                  <span style={{ background: 'rgba(0,229,160,0.15)', color: 'var(--accent-green)', fontSize: '0.8rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>{discount}% OFF</span>
                </>}
              </div>
              <button className={`btn ${enrolled ? 'btn-secondary' : 'btn-primary'}`} style={{ width: '100%', fontSize: '1rem', padding: '14px', marginBottom: '8px' }} onClick={enrolled ? () => navigate('/dashboard') : handleEnroll} disabled={enrolling}>
                {enrolling ? '⏳ Enrolling...' : enrolled ? '✓ Go to My Course' : 'Enroll Now'}
              </button>
              <button className="btn btn-secondary" style={{ width: '100%' }}>Add to Wishlist ♡</button>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Full lifetime access', 'Certificate of completion', 'Access on all devices', '30-day money-back guarantee'].map(p => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--accent-green)' }}>✓</span> {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container" style={{ padding: '48px 24px', maxWidth: '900px' }}>
        {/* What you'll learn */}
        {course.whatYouLearn?.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>What You'll Learn</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {course.whatYouLearn.map(l => (
                <div key={l} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)', padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--accent-green)', flexShrink: 0 }}>✓</span>{l}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="divider" />

        {/* Curriculum */}
        {course.curriculum?.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Course Curriculum</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{course.curriculum.length} sections • {totalLessons} lessons • {course.duration}</p>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              {course.curriculum.map((sec, i) => (
                <div key={i}>
                  <button onClick={() => setActiveSection(activeSection === i ? -1 : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: activeSection === i ? 'rgba(0,212,255,0.05)' : 'var(--bg-secondary)', border: 'none', borderTop: i > 0 ? '1px solid var(--border-color)' : 'none', color: 'var(--text-primary)', fontSize: '0.92rem', fontWeight: 600, cursor: 'pointer' }}>
                    <span>{sec.section}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sec.lessons?.length || 0} lessons {activeSection === i ? '▲' : '▼'}</span>
                  </button>
                  {activeSection === i && (
                    <div style={{ borderTop: '1px solid var(--border-color)' }}>
                      {(sec.lessons || []).map((l, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', fontSize: '0.88rem', color: 'var(--text-secondary)', borderBottom: j < sec.lessons.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                          <span style={{ color: 'var(--accent-primary)', fontSize: '0.7rem' }}>▶</span>
                          <span style={{ flex: 1 }}>{l.title}</span>
                          {l.duration && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.duration}</span>}
                          {l.isPreview && <span className="badge badge-green" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>Preview</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="divider" />

        {/* Requirements */}
        {course.requirements?.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>Requirements</h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {course.requirements.map(r => (
                <li key={r} style={{ display: 'flex', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--accent-primary)', flexShrink: 0 }}>→</span>{r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style>{`
        .detail-hero { padding: 48px 0; background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary)); border-bottom: 1px solid var(--border-color); position: relative; overflow: hidden; }
        .detail-hero-inner { display: grid; grid-template-columns: 1fr 320px; gap: 48px; align-items: start; position: relative; z-index: 1; }
        .detail-hero-content h1 { font-family: var(--font-display); font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 12px; line-height: 1.2; }
        .enroll-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 24px; position: sticky; top: 90px; }
        @media (max-width: 1024px) { .detail-hero-inner { grid-template-columns: 1fr; } .enroll-card { position: static; } }
        @media (max-width: 640px) { .detail-hero-inner > div:first-child > div:nth-child(4) { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default CourseDetail;
