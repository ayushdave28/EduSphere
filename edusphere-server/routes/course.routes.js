const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addReview,
  getCategories,
} = require('../controllers/course.controller');

const { protect, authorize, optionalAuth } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

// ─── Validation rules ──────────────────────────────────────

const courseValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Course title is required.')
    .isLength({ min: 5 }).withMessage('Title must be at least 5 characters.')
    .isLength({ max: 120 }).withMessage('Title cannot exceed 120 characters.'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required.')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters.'),
  body('instructor')
    .trim()
    .notEmpty().withMessage('Instructor name is required.'),
  body('category')
    .notEmpty().withMessage('Category is required.')
    .isIn(['Web Development', 'Data Science', 'Design', 'Cloud Computing', 'Security', 'Mobile Development', 'DevOps', 'Other'])
    .withMessage('Invalid category.'),
  body('level')
    .notEmpty().withMessage('Level is required.')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Level must be Beginner, Intermediate, or Advanced.'),
  body('price')
    .notEmpty().withMessage('Price is required.')
    .isNumeric().withMessage('Price must be a number.')
    .custom((val) => val >= 0).withMessage('Price cannot be negative.'),
];

const reviewValidation = [
  body('rating')
    .notEmpty().withMessage('Rating is required.')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
  body('review')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Review cannot exceed 1000 characters.'),
];

// ─── Routes ───────────────────────────────────────────────

// @route  GET /api/courses/categories
router.get('/categories', getCategories);

// @route  GET  /api/courses
// @route  POST /api/courses
router
  .route('/')
  .get(optionalAuth, getCourses)
  .post(protect, authorize('admin'), courseValidation, validate, createCourse);

// @route  GET /api/courses/:id
// @route  PUT /api/courses/:id
// @route  DELETE /api/courses/:id
router
  .route('/:id')
  .get(optionalAuth, getCourse)
  .put(protect, authorize('admin'), validate, updateCourse)
  .delete(protect, authorize('admin'), deleteCourse);

// @route  POST /api/courses/:id/reviews
router.post('/:id/reviews', protect, authorize('student'), reviewValidation, validate, addReview);

module.exports = router;
