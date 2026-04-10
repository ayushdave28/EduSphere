import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const instructorData = [
  { id: 1, name: 'Dr. Sarah Mitchell', email: 'sarah@edusphere.com', courses: 8, students: 45000, rating: 4.9, status: 'active', joined: '2023-01-15', revenue: '₹3.2L' },
  { id: 2, name: 'Prof. James Chen', email: 'james@edusphere.com', courses: 6, students: 62000, rating: 4.8, status: 'active', joined: '2023-03-10', revenue: '₹4.1L' },
  { id: 3, name: 'Emma Rodriguez', email: 'emma@edusphere.com', courses: 5, students: 28000, rating: 4.7, status: 'active', joined: '2023-06-20', revenue: '₹2.0L' },
  { id: 4, name: 'Michael Torres', email: 'michael@edusphere.com', courses: 4, students: 22000, rating: 4.8, status: 'active', joined: '2023-08-05', revenue: '₹1.8L' },
  { id: 5, name: 'Dr. Raj Patel', email: 'raj@edusphere.com', courses: 3, students: 18000, rating: 4.6, status: 'pending', joined: '2024-01-12', revenue: '₹1.2L' },
  { id: 6, name: 'Lisa Wang', email: 'lisa@edusphere.com', courses: 5, students: 26000, rating: 4.7, status: 'active', joined: '2023-11-18', revenue: '₹1.9L' },
];

const AdminInstructors = () => {
  const { showToast } = useAuth();
  const [instructors, setInstructors] = useState(instructorData);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', specialization: '' });
  const [inviteErrors, setInviteErrors] = useState({});

  const validateInvite = () => {
    const errs = {};
    if (!inviteForm.name.trim()) errs.name = 'Name is required.';
    if (!inviteForm.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteForm.email)) errs.email = 'Invalid email.';
    if (!inviteForm.specialization.trim()) errs.specialization = 'Specialization is required.';
    return errs;
  };

  const handleInvite = (e) => {
    e.preventDefault();
    const errs = validateInvite();
    if (Object.keys(errs).length) { setInviteErrors(errs); return; }
    showToast(`Invitation sent to ${inviteForm.email}!`, 'success');
    setShowInviteModal(false);
    setInviteForm({ name: '', email: '', specialization: '' });
  };

  const toggleStatus = (id) => {
    setInstructors(ins => ins.map(i => i.id === id ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' } : i));
  };

  return (
    <div className="admin-instructors page-enter">
      <div className="admin-page-header">
        <div>
          <h1>Instructor <span className="gradient-text">Management</span></h1>
          <p>Manage all instructors, review their performance and control access.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowInviteModal(true)}>+ Invite Instructor</button>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {[
          { label: 'Total Instructors', value: instructors.length, color: 'var(--accent-primary)' },
          { label: 'Active', value: instructors.filter(i => i.status === 'active').length, color: 'var(--accent-green)' },
          { label: 'Total Courses', value: instructors.reduce((a, i) => a + i.courses, 0), color: 'var(--accent-secondary)' },
          { label: 'Avg. Rating', value: (instructors.reduce((a, i) => a + i.rating, 0) / instructors.length).toFixed(1), color: 'var(--accent-orange)' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ padding: '16px 20px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Instructor</th>
              <th>Courses</th>
              <th>Students</th>
              <th>Rating</th>
              <th>Revenue</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map(inst => (
              <tr key={inst.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `hsl(${inst.id * 60}, 60%, 45%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', color: 'white', flexShrink: 0 }}>
                      {inst.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{inst.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inst.email}</div>
                    </div>
                  </div>
                </td>
                <td>{inst.courses}</td>
                <td>{inst.students.toLocaleString()}</td>
                <td>⭐ {inst.rating}</td>
                <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{inst.revenue}</td>
                <td style={{ fontSize: '0.82rem' }}>{inst.joined}</td>
                <td>
                  <span className={`status-badge ${inst.status}`}>{inst.status}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => toggleStatus(inst.id)}>
                      {inst.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                    <button className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem' }}>Invite Instructor</h2>
              <button onClick={() => setShowInviteModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleInvite} noValidate>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className={`form-control ${inviteErrors.name ? 'error' : ''}`} placeholder="Dr. Jane Smith" value={inviteForm.name} onChange={e => { setInviteForm(f => ({ ...f, name: e.target.value })); setInviteErrors(x => ({ ...x, name: '' })); }} />
                {inviteErrors.name && <span className="error-msg">⚠ {inviteErrors.name}</span>}
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className={`form-control ${inviteErrors.email ? 'error' : ''}`} placeholder="jane@example.com" value={inviteForm.email} onChange={e => { setInviteForm(f => ({ ...f, email: e.target.value })); setInviteErrors(x => ({ ...x, email: '' })); }} />
                {inviteErrors.email && <span className="error-msg">⚠ {inviteErrors.email}</span>}
              </div>
              <div className="form-group">
                <label>Specialization</label>
                <input type="text" className={`form-control ${inviteErrors.specialization ? 'error' : ''}`} placeholder="e.g. Machine Learning, Web Development" value={inviteForm.specialization} onChange={e => { setInviteForm(f => ({ ...f, specialization: e.target.value })); setInviteErrors(x => ({ ...x, specialization: '' })); }} />
                {inviteErrors.specialization && <span className="error-msg">⚠ {inviteErrors.specialization}</span>}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                An invitation email with account setup instructions will be sent to this address.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowInviteModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Send Invitation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
        .admin-page-header h1 { font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: 4px; }
        .admin-page-header p { color: var(--text-secondary); font-size: 0.88rem; }
        .status-badge { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 0.72rem; font-weight: 600; text-transform: capitalize; }
        .status-badge.active { background: rgba(0,229,160,0.15); color: var(--accent-green); }
        .status-badge.pending { background: rgba(255,107,53,0.15); color: var(--accent-orange); }
        .status-badge.inactive { background: rgba(139,163,199,0.15); color: var(--text-muted); }
      `}</style>
    </div>
  );
};

export default AdminInstructors;
