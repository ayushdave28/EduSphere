import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI, coursesAPI } from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, coursesData] = await Promise.all([
          usersAPI.getDashboardStats(),
          coursesAPI.getAll({ sort: 'popular', limit: 5 }),
        ]);
        setStats(statsData.data);
        setCourses(coursesData.data || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  const kpis = [
    { label: 'Total Students', value: stats?.users?.students?.toLocaleString() || '0', change: '+12.5%', icon: '👥', color: 'var(--accent-primary)' },
    { label: 'Total Courses', value: courses.length || '0', change: '+2 this month', icon: '📚', color: 'var(--accent-secondary)' },
    { label: 'Total Revenue', value: `₹${((stats?.totalRevenue || 0) / 100000).toFixed(1)}L`, change: '+18.2%', icon: '💰', color: 'var(--accent-green)' },
    { label: 'Total Enrollments', value: (stats?.totalEnrollments || 0).toLocaleString(), change: '+8.4%', icon: '📋', color: 'var(--accent-orange)' },
  ];

  return (
    <div className="admin-dashboard page-enter">
      <div className="admin-page-header">
        <div>
          <h1>Dashboard <span className="gradient-text">Overview</span></h1>
          <p>Welcome back! Here's what's happening with EduSphere today.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary btn-sm">📥 Export Report</button>
          <Link to="/admin/courses" className="btn btn-primary btn-sm">+ Add Course</Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        {kpis.map((kpi, i) => (
          <div key={kpi.label} className="stat-card" style={{ animation: `fadeInUp 0.4s ${i * 0.1}s ease both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.8rem' }}>{kpi.icon}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)', background: 'rgba(0,229,160,0.1)', padding: '3px 8px', borderRadius: '100px', fontWeight: 600 }}>↑ {kpi.change}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: kpi.color, marginBottom: '4px' }}>{kpi.value}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Recent Enrollments */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Recent Enrollments</h3>
            <Link to="/admin/students" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.recentEnrollments || []).map((e) => (
                  <tr key={e._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--bg-primary)', flexShrink: 0 }}>
                          {e.student?.name?.charAt(0) || '?'}
                        </div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{e.student?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.course?.title || '—'}</td>
                    <td style={{ fontSize: '0.8rem' }}>{new Date(e.enrolledAt).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 600, color: 'var(--accent-green)', fontSize: '0.85rem' }}>₹{(e.course?.price || 0).toLocaleString()}</td>
                  </tr>
                ))}
                {(!stats?.recentEnrollments || stats.recentEnrollments.length === 0) && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No enrollments yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Courses */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Top Courses</h3>
            <Link to="/admin/courses" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>See all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(stats?.topCourses || courses.slice(0, 5)).map((c, i) => (
              <div key={c._id || i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '4px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0 }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>{c.title}</p>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min(((c.totalStudents || 0) / 20000) * 100, 100)}%` }} /></div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>{(c.totalStudents || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { label: 'Add New Course', icon: '📚', to: '/admin/courses', color: '#00d4ff' },
            { label: 'Manage Students', icon: '👥', to: '/admin/students', color: '#7c3aed' },
            { label: 'View Analytics', icon: '📊', to: '/admin/analytics', color: '#00e5a0' },
            { label: 'Site Settings', icon: '⚙', to: '/admin/settings', color: '#ff6b35' },
          ].map(qa => (
            <Link key={qa.label} to={qa.to} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '20px 12px', background: 'var(--bg-secondary)', border: `1px solid var(--border-color)`, borderRadius: 'var(--radius-md)', transition: 'all 0.2s', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = qa.color; e.currentTarget.style.color = qa.color; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <span style={{ fontSize: '1.5rem' }}>{qa.icon}</span>
              {qa.label}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .admin-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
        .admin-page-header h1 { font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: 4px; }
        .admin-page-header p { color: var(--text-secondary); font-size: 0.88rem; }
        .admin-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; }
        .admin-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .admin-card-header h3 { font-family: var(--font-display); font-size: 1rem; font-weight: 700; }
        @media (max-width: 1200px) { .admin-page-header { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
