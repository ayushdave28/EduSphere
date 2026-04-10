import React, { useState } from 'react';

const allStudents = [
  { id: 1, name: 'Priya Sharma', email: 'priya@email.com', courses: 3, joined: '2025-01-12', status: 'active', progress: 72 },
  { id: 2, name: 'Rohit Mehta', email: 'rohit@email.com', courses: 2, joined: '2025-01-18', status: 'active', progress: 45 },
  { id: 3, name: 'Ananya Patel', email: 'ananya@email.com', courses: 1, joined: '2025-02-05', status: 'pending', progress: 20 },
  { id: 4, name: 'Karan Shah', email: 'karan@email.com', courses: 4, joined: '2025-02-10', status: 'active', progress: 90 },
  { id: 5, name: 'Sneha Joshi', email: 'sneha@email.com', courses: 1, joined: '2025-02-20', status: 'inactive', progress: 5 },
  { id: 6, name: 'Arjun Verma', email: 'arjun@email.com', courses: 2, joined: '2025-03-01', status: 'active', progress: 60 },
  { id: 7, name: 'Pooja Nair', email: 'pooja@email.com', courses: 3, joined: '2025-03-05', status: 'active', progress: 33 },
  { id: 8, name: 'Dev Kapoor', email: 'dev@email.com', courses: 1, joined: '2025-03-10', status: 'pending', progress: 10 },
];

const AdminStudents = () => {
  const [students, setStudents] = useState(allStudents);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState([]);
  const [viewStudent, setViewStudent] = useState(null);

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || s.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id) => setSelected(sel => sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);
  const toggleAll = () => setSelected(sel => sel.length === filtered.length ? [] : filtered.map(s => s.id));

  const handleStatusChange = (id, status) => setStudents(ss => ss.map(s => s.id === id ? { ...s, status } : s));

  return (
    <div className="admin-students page-enter">
      <div className="admin-page-header">
        <div>
          <h1>Student <span className="gradient-text">Management</span></h1>
          <p>View and manage all registered students on the platform.</p>
        </div>
        <button className="btn btn-primary">+ Add Student</button>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Total Students', value: students.length, color: 'var(--accent-primary)' },
          { label: 'Active', value: students.filter(s => s.status === 'active').length, color: 'var(--accent-green)' },
          { label: 'Pending', value: students.filter(s => s.status === 'pending').length, color: 'var(--accent-orange)' },
          { label: 'Inactive', value: students.filter(s => s.status === 'inactive').length, color: 'var(--text-muted)' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ padding: '16px 20px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, maxWidth: '360px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)', pointerEvents: 'none', width: '18px', height: '18px' }}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input type="search" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '44px' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Active', 'Pending', 'Inactive'].map(s => (
            <button key={s} className={`cat-tab ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)} style={{ padding: '8px 16px', borderRadius: '100px', border: '1.5px solid var(--border-color)', background: 'transparent', color: statusFilter === s ? 'var(--bg-primary)' : 'var(--text-secondary)', fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s', fontWeight: statusFilter === s ? 700 : 400, backgroundColor: statusFilter === s ? 'var(--accent-primary)' : 'transparent', borderColor: statusFilter === s ? 'var(--accent-primary)' : 'var(--border-color)' }}>
              {s}
            </button>
          ))}
        </div>
        {selected.length > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--accent-primary)' }}>{selected.length} selected</span>
        )}
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} style={{ accentColor: 'var(--accent-primary)' }} />
              </th>
              <th>Student</th>
              <th>Courses</th>
              <th>Progress</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>
                  <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleSelect(s.id)} style={{ accentColor: 'var(--accent-primary)' }} />
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: `hsl(${s.id * 50}, 60%, 45%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: 'white', flexShrink: 0 }}>{s.name.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{s.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.email}</div>
                    </div>
                  </div>
                </td>
                <td>{s.courses} enrolled</td>
                <td style={{ minWidth: '120px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="progress-bar" style={{ flex: 1 }}><div className="progress-fill" style={{ width: `${s.progress}%` }} /></div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '30px' }}>{s.progress}%</span>
                  </div>
                </td>
                <td style={{ fontSize: '0.82rem' }}>{s.joined}</td>
                <td>
                  <select
                    value={s.status}
                    onChange={e => handleStatusChange(s.id, e.target.value)}
                    style={{ background: 'transparent', border: 'none', fontSize: '0.82rem', cursor: 'pointer', color: s.status === 'active' ? 'var(--accent-green)' : s.status === 'pending' ? 'var(--accent-orange)' : 'var(--text-muted)' }}
                  >
                    <option value="active">● Active</option>
                    <option value="pending">● Pending</option>
                    <option value="inactive">● Inactive</option>
                  </select>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setViewStudent(s)}>View</button>
                    <button className="btn btn-danger btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Detail Modal */}
      {viewStudent && (
        <div className="modal-overlay" onClick={() => setViewStudent(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem' }}>Student Profile</h2>
              <button onClick={() => setViewStudent(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: `hsl(${viewStudent.id * 50}, 60%, 45%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.5rem', color: 'white', margin: '0 auto 12px' }}>{viewStudent.name.charAt(0)}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{viewStudent.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{viewStudent.email}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Status', value: viewStudent.status },
                { label: 'Courses Enrolled', value: viewStudent.courses },
                { label: 'Joined', value: viewStudent.joined },
                { label: 'Avg Progress', value: `${viewStudent.progress}%` },
              ].map(d => (
                <div key={d.label} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{d.label}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{d.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setViewStudent(null)}>Close</button>
              <button className="btn btn-primary">Send Message</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
        .admin-page-header h1 { font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: 4px; }
        .admin-page-header p { color: var(--text-secondary); font-size: 0.88rem; }
      `}</style>
    </div>
  );
};

export default AdminStudents;
