import React, { useState, useEffect, useCallback } from 'react';
import CourseCard from '../../components/CourseCard';
import { coursesAPI } from '../../utils/api';

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Design', 'Cloud Computing', 'Security', 'Mobile Development'];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [sort, setSort] = useState('popular');
  const [searchInput, setSearchInput] = useState('');

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sort };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (level !== 'All') params.level = level;

      const data = await coursesAPI.getAll(params);
      setCourses(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to fetch courses:', err.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, level, sort]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="courses-page page-enter" style={{ paddingTop: 'var(--navbar-h)', minHeight: '100vh' }}>
      <div className="courses-header">
        <div className="container">
          <h1>Explore <span className="gradient-text">Courses</span></h1>
          <p>Discover {total} expert-led courses in the most in-demand technologies</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div className="search-bar" style={{ flex: 1, maxWidth: '400px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)', pointerEvents: 'none', width: '18px', height: '18px' }}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input type="search" placeholder="Search courses, instructors, skills..." value={searchInput} onChange={e => setSearchInput(e.target.value)} style={{ paddingLeft: '44px' }} />
          </div>
          <select className="filter-select" value={level} onChange={e => setLevel(e.target.value)} style={{ padding: '12px 16px', background: 'var(--bg-card)', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '0.88rem', cursor: 'pointer' }}>
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
          </select>
          <select className="filter-select" value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '12px 16px', background: 'var(--bg-card)', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '0.88rem', cursor: 'pointer' }}>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{total} courses</span>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{ padding: '8px 18px', borderRadius: '100px', border: `1.5px solid ${category === cat ? 'var(--accent-primary)' : 'var(--border-color)'}`, background: category === cat ? 'var(--accent-primary)' : 'transparent', color: category === cat ? 'var(--bg-primary)' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: category === cat ? 700 : 400, cursor: 'pointer', transition: 'all 0.2s' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
            <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>Loading courses...</p>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid-3">
            {courses.map(c => <CourseCard key={c._id} course={{ ...c, id: c._id, rating: c.averageRating, reviews: c.totalReviews, students: c.totalStudents, featured: c.isFeatured, bestseller: c.isBestseller }} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>No courses found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Try adjusting your search or filters</p>
            <button className="btn btn-secondary" onClick={() => { setSearchInput(''); setSearch(''); setCategory('All'); setLevel('All'); }}>Clear Filters</button>
          </div>
        )}
      </div>

      <style>{`
        .courses-header { background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary)); border-bottom: 1px solid var(--border-color); padding: 48px 0; text-align: center; }
        .courses-header h1 { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }
        .courses-header p { color: var(--text-secondary); font-size: 1rem; }
        select option { background: var(--bg-card); color: var(--text-primary); }
      `}</style>
    </div>
  );
};

export default Courses;
