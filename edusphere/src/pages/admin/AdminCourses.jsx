import React, { useState, useEffect } from 'react';
import { coursesAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const AdminCourses = () => {
  const { showToast } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const initForm = { title: '', instructor: '', category: 'Web Development', level: 'Beginner', price: '', description: '' };
  const [form, setForm] = useState(initForm);
  const [errors, setErrors] = useState({});

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await coursesAPI.getAll({ limit: 50 });
      setCourses(data.data || []);
    } catch (err) {
      showToast('Failed to load courses.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor.toLowerCase().includes(search.toLowerCase())
  );

  const validateForm = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.instructor.trim()) errs.instructor = 'Instructor is required.';
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) errs.price = 'Valid price is required.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    return errs;
  };

  const openAdd = () => { setForm(initForm); setEditCourse(null); setErrors({}); setShowModal(true); };
  const openEdit = (c) => {
    setForm({ title: c.title, instructor: c.instructor, category: c.category, level: c.level, price: String(c.price), description: c.description });
    setEditCourse(c);
    setErrors({});
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editCourse) {
        await coursesAPI.update(editCourse._id, payload);
        showToast('Course updated successfully!', 'success');
      } else {
        await coursesAPI.create(payload);
        showToast('Course created successfully!', 'success');
      }
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await coursesAPI.delete(deleteId);
      showToast('Course deleted.', 'info');
      setDeleteId(null);
      fetchCourses();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const levelColor = { Beginner: 'badge-green', Intermediate: 'badge-blue', Advanced: 'badge-purple' };

  return (
    <div className="admin-courses page-enter">
      <div className="admin-page-header">
        <div>
          <h1>Course <span className="gradient-text">Management</span></h1>
          <p>Manage all courses — add, edit, or remove content from the platform.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add New Course</button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, maxWidth: '400px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)', pointerEvents: 'none', width: '18px', height: '18px' }}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input type="search" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '44px' }} />
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{filtered.length} courses</span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Course</th><th>Instructor</th><th>Category</th><th>Level</th><th>Price</th><th>Students</th><th>Rating</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${c.color || '#00d4ff'}20`, border: `1px solid ${c.color || '#00d4ff'}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>📚</div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-primary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{c.instructor}</td>
                  <td><span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{c.category}</span></td>
                  <td><span className={`badge ${levelColor[c.level]}`} style={{ fontSize: '0.7rem' }}>{c.level}</span></td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{c.price?.toLocaleString()}</td>
                  <td>{(c.totalStudents || 0).toLocaleString()}</td>
                  <td>⭐ {c.averageRating || 0}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => openEdit(c)}>Edit</button>
                      <button className="btn btn-danger btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setDeleteId(c._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No courses found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem' }}>{editCourse ? 'Edit Course' : 'Add New Course'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSave} noValidate>
              <div className="form-group">
                <label>Course Title</label>
                <input type="text" className={`form-control ${errors.title ? 'error' : ''}`} placeholder="e.g. Advanced React Development" value={form.title} onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setErrors(x => ({ ...x, title: '' })); }} />
                {errors.title && <span className="error-msg">⚠ {errors.title}</span>}
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Instructor Name</label>
                  <input type="text" className={`form-control ${errors.instructor ? 'error' : ''}`} placeholder="Dr. John Doe" value={form.instructor} onChange={e => { setForm(f => ({ ...f, instructor: e.target.value })); setErrors(x => ({ ...x, instructor: '' })); }} />
                  {errors.instructor && <span className="error-msg">⚠ {errors.instructor}</span>}
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" className={`form-control ${errors.price ? 'error' : ''}`} placeholder="4999" value={form.price} onChange={e => { setForm(f => ({ ...f, price: e.target.value })); setErrors(x => ({ ...x, price: '' })); }} />
                  {errors.price && <span className="error-msg">⚠ {errors.price}</span>}
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-control" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {['Web Development', 'Data Science', 'Design', 'Cloud Computing', 'Security', 'Mobile Development', 'DevOps', 'Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Level</label>
                  <select className="form-control" value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
                    {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className={`form-control ${errors.description ? 'error' : ''}`} rows={3} placeholder="Course description (min 20 characters)..." value={form.description} onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setErrors(x => ({ ...x, description: '' })); }} style={{ resize: 'vertical' }} />
                {errors.description && <span className="error-msg">⚠ {errors.description}</span>}
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? '⏳ Saving...' : editCourse ? 'Update Course' : 'Add Course'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '8px' }}>Delete Course?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>This will permanently delete the course and all student enrollments.</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
        .admin-page-header h1 { font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: 4px; }
        .admin-page-header p { color: var(--text-secondary); font-size: 0.88rem; }
        select.form-control { background: rgba(255,255,255,0.05); cursor: pointer; }
        select.form-control option { background: var(--bg-card); color: var(--text-primary); }
      `}</style>
    </div>
  );
};

export default AdminCourses;
