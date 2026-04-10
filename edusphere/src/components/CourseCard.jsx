import React from 'react';
import { Link } from 'react-router-dom';

const levelColors = { Beginner: 'badge-green', Intermediate: 'badge-blue', Advanced: 'badge-purple' };

const CourseCard = ({ course }) => {
  const discount = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);

  return (
    <div className="course-card card">
      <div className="course-thumb" style={{ '--c': course.color }}>
        <div className="course-thumb-inner">
          <svg viewBox="0 0 80 60" fill="none" width="80">
            <rect width="80" height="60" rx="8" fill={`${course.color}15`}/>
            <rect x="20" y="15" width="40" height="5" rx="2.5" fill={course.color} opacity="0.7"/>
            <rect x="20" y="25" width="30" height="4" rx="2" fill={course.color} opacity="0.4"/>
            <rect x="20" y="34" width="35" height="4" rx="2" fill={course.color} opacity="0.4"/>
            <circle cx="60" cy="42" r="10" fill={`${course.color}30`} stroke={course.color} strokeWidth="2"/>
            <path d="M57 42l2 2 4-4" stroke={course.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {course.bestseller && <span className="course-badge bestseller">Bestseller</span>}
        {course.featured && !course.bestseller && <span className="course-badge featured">Featured</span>}
        <span className="discount-badge">-{discount}%</span>
      </div>

      <div className="course-body">
        <div className="course-meta-row">
          <span className={`badge ${levelColors[course.level]}`}>{course.level}</span>
          <span className="course-category">{course.category}</span>
        </div>

        <h3 className="course-title">{course.title}</h3>
        <p className="course-instructor">by {course.instructor}</p>

        <div className="course-rating">
          <span className="rating-score">{course.rating}</span>
          <div className="stars">
            {[1,2,3,4,5].map(i => (
              <span key={i} className="star" style={{color: i <= Math.floor(course.rating) ? 'var(--accent-orange)' : 'var(--text-muted)'}}>★</span>
            ))}
          </div>
          <span className="rating-count">({course.reviews.toLocaleString()})</span>
        </div>

        <div className="course-stats">
          <span>📚 {course.lessons} lessons</span>
          <span>⏱ {course.duration}</span>
          <span>👥 {course.students.toLocaleString()}</span>
        </div>

        <div className="course-footer">
          <div className="course-price">
            <span className="price-current">₹{course.price.toLocaleString()}</span>
            <span className="price-original">₹{course.originalPrice.toLocaleString()}</span>
          </div>
          <Link to={`/courses/${course.id}`} className="btn btn-primary btn-sm">Enroll Now</Link>
        </div>
      </div>

      <style>{`
        .course-card { cursor: pointer; }
        .course-thumb {
          height: 160px;
          background: linear-gradient(135deg, var(--bg-secondary), var(--bg-card));
          display: flex; align-items: center; justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .course-thumb::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at 70% 70%, var(--c, #00d4ff)20 0%, transparent 60%);
        }
        .course-thumb-inner { position: relative; z-index: 1; }
        .course-badge {
          position: absolute; top: 12px; left: 12px;
          font-size: 0.7rem; font-weight: 700;
          padding: 3px 10px; border-radius: 100px;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .bestseller { background: var(--accent-orange); color: white; }
        .featured { background: var(--accent-secondary); color: white; }
        .discount-badge {
          position: absolute; top: 12px; right: 12px;
          background: var(--accent-green); color: var(--bg-primary);
          font-size: 0.7rem; font-weight: 700;
          padding: 3px 8px; border-radius: 4px;
        }
        .course-body { padding: 20px; }
        .course-meta-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .course-category { font-size: 0.75rem; color: var(--text-muted); }
        .course-title {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.4;
          margin-bottom: 6px;
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .course-instructor { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 10px; }
        .course-rating { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
        .rating-score { font-weight: 700; font-size: 0.9rem; color: var(--accent-orange); }
        .rating-count { font-size: 0.8rem; color: var(--text-muted); }
        .course-stats { display: flex; gap: 12px; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 16px; flex-wrap: wrap; }
        .course-footer { display: flex; align-items: center; justify-content: space-between; }
        .price-current { font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; color: var(--text-primary); }
        .price-original { font-size: 0.85rem; color: var(--text-muted); text-decoration: line-through; margin-left: 6px; }
      `}</style>
    </div>
  );
};

export default CourseCard;
