import React, { useState } from 'react';

const monthlyData = [
  { month: 'Oct', revenue: 320000, students: 820 },
  { month: 'Nov', revenue: 450000, students: 1100 },
  { month: 'Dec', revenue: 380000, students: 950 },
  { month: 'Jan', revenue: 620000, students: 1450 },
  { month: 'Feb', revenue: 710000, students: 1680 },
  { month: 'Mar', revenue: 840000, students: 1920 },
];

const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
const maxStudents = Math.max(...monthlyData.map(d => d.students));

const categoryData = [
  { name: 'Web Dev', value: 35, color: '#00d4ff' },
  { name: 'Data Science', value: 25, color: '#7c3aed' },
  { name: 'Design', value: 18, color: '#ff3d9a' },
  { name: 'Cloud', value: 12, color: '#ff6b35' },
  { name: 'Security', value: 10, color: '#00e5a0' },
];

const AdminAnalytics = () => {
  const [period, setPeriod] = useState('6months');

  return (
    <div className="admin-analytics page-enter">
      <div className="admin-page-header">
        <div>
          <h1>Analytics & <span className="gradient-text">Insights</span></h1>
          <p>Track platform performance, revenue trends, and student engagement.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['1month', '3months', '6months', '1year'].map(p => (
            <button key={p} className="btn btn-sm" style={{ background: period === p ? 'var(--accent-primary)' : 'var(--bg-card)', border: `1px solid ${period === p ? 'var(--accent-primary)' : 'var(--border-color)'}`, color: period === p ? 'var(--bg-primary)' : 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', padding: '6px 14px', fontSize: '0.8rem', fontWeight: period === p ? 700 : 400 }} onClick={() => setPeriod(p)}>
              {p === '1month' ? '1M' : p === '3months' ? '3M' : p === '6months' ? '6M' : '1Y'}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        {[
          { label: 'Total Revenue', value: '₹28.4L', change: '+22.4%', color: 'var(--accent-green)' },
          { label: 'New Students', value: '7,920', change: '+18.6%', color: 'var(--accent-primary)' },
          { label: 'Course Completions', value: '1,240', change: '+31.2%', color: 'var(--accent-secondary)' },
          { label: 'Avg. Session', value: '47 min', change: '+5.1%', color: 'var(--accent-orange)' },
        ].map(k => (
          <div key={k.label} className="stat-card">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: k.color, marginBottom: '4px' }}>{k.value}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', background: 'rgba(0,229,160,0.1)', padding: '2px 7px', borderRadius: '100px', fontWeight: 600 }}>↑ {k.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-grid">
        {/* Revenue Chart */}
        <div className="admin-card" style={{ gridColumn: 'span 2' }}>
          <div className="admin-card-header">
            <h3>Monthly Revenue</h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--accent-green)' }}>↑ +22.4% vs last period</span>
          </div>
          <div className="bar-chart">
            {monthlyData.map(d => (
              <div key={d.month} className="bar-col">
                <div className="bar-value">₹{(d.revenue / 100000).toFixed(1)}L</div>
                <div className="bar-wrapper">
                  <div className="bar-fill" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} />
                </div>
                <div className="bar-label">{d.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Enrollment by Category</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categoryData.map(c => (
              <div key={c.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.name}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: c.color }}>{c.value}%</span>
                </div>
                <div className="progress-bar">
                  <div style={{ height: '100%', borderRadius: '3px', background: c.color, width: `${c.value}%`, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student growth chart */}
        <div className="admin-card" style={{ gridColumn: 'span 2' }}>
          <div className="admin-card-header">
            <h3>Student Growth</h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--accent-primary)' }}>New enrollments per month</span>
          </div>
          <div className="line-chart">
            <svg viewBox="0 0 600 160" preserveAspectRatio="none" style={{ width: '100%', height: '160px' }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Area */}
              <path
                d={`M 0 ${160 - (monthlyData[0].students / maxStudents) * 140} ${monthlyData.map((d, i) => `L ${(i / (monthlyData.length - 1)) * 600} ${160 - (d.students / maxStudents) * 140}`).join(' ')} L 600 160 L 0 160 Z`}
                fill="url(#lineGrad)"
              />
              {/* Line */}
              <polyline
                points={monthlyData.map((d, i) => `${(i / (monthlyData.length - 1)) * 600},${160 - (d.students / maxStudents) * 140}`).join(' ')}
                fill="none"
                stroke="#00d4ff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dots */}
              {monthlyData.map((d, i) => (
                <circle
                  key={i}
                  cx={(i / (monthlyData.length - 1)) * 600}
                  cy={160 - (d.students / maxStudents) * 140}
                  r="5"
                  fill="#00d4ff"
                  stroke="#0a1628"
                  strokeWidth="2"
                />
              ))}
            </svg>
            <div className="line-chart-labels">
              {monthlyData.map(d => <span key={d.month}>{d.month}</span>)}
            </div>
          </div>
        </div>

        {/* Top performing courses */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Top Performers</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { title: 'Full-Stack MERN', revenue: '₹2.1L', growth: '+24%' },
              { title: 'Python Data Science', revenue: '₹1.8L', growth: '+18%' },
              { title: 'AWS Cloud', revenue: '₹1.4L', growth: '+31%' },
              { title: 'UI/UX Masterclass', revenue: '₹0.9L', growth: '+12%' },
            ].map((c, i) => (
              <div key={c.title} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-muted)', fontSize: '1rem', width: '20px' }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '2px' }}>{c.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.revenue} revenue</div>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)', fontWeight: 600 }}>↑ {c.growth}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .admin-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
        .admin-page-header h1 { font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: 4px; }
        .admin-page-header p { color: var(--text-secondary); font-size: 0.88rem; }
        .analytics-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
        .admin-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; }
        .admin-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .admin-card-header h3 { font-family: var(--font-display); font-size: 1rem; font-weight: 700; }
        .bar-chart { display: flex; align-items: flex-end; gap: 12px; height: 180px; padding-top: 24px; }
        .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
        .bar-value { font-size: 0.7rem; color: var(--text-muted); margin-bottom: 4px; white-space: nowrap; }
        .bar-wrapper { flex: 1; width: 100%; display: flex; align-items: flex-end; }
        .bar-fill { width: 100%; border-radius: 4px 4px 0 0; background: linear-gradient(180deg, var(--accent-primary), rgba(0,212,255,0.4)); transition: height 0.8s ease; min-height: 4px; }
        .bar-label { font-size: 0.75rem; color: var(--text-muted); margin-top: 6px; }
        .line-chart { position: relative; }
        .line-chart-labels { display: flex; justify-content: space-between; margin-top: 8px; }
        .line-chart-labels span { font-size: 0.75rem; color: var(--text-muted); }
        @media (max-width: 1200px) { .analytics-grid { grid-template-columns: 1fr; } .admin-card[style*="span 2"] { grid-column: span 1; } }
      `}</style>
    </div>
  );
};

export default AdminAnalytics;
