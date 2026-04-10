const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  enrollCourse,
  getMyEnrollments,
  getEnrollment,
  updateProgress,
  unenroll,
  getAllEnrollments,
} = require('../controllers/enrollment.controller');

const { protect, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

// ─── Validation rules ──────────────────────────────────────

const enrollValidation = [
  body('courseId')
    .notEmpty().withMessage('Course ID is required.')
    .isMongoId().withMessage('Invalid course ID format.'),
];

const progressValidation = [
  body('lessonTitle').trim().notEmpty().withMessage('Lesson title is required.'),
  body('sectionTitle').trim().notEmpty().withMessage('Section title is required.'),
];

// ─── Routes ───────────────────────────────────────────────

// @route  GET  /api/enrollments          → Admin: all enrollments
// @route  POST /api/enrollments          → Student: enroll in course
router
  .route('/')
  .get(protect, authorize('admin'), getAllEnrollments)
  .post(protect, authorize('student'), enrollValidation, validate, enrollCourse);

// @route  GET /api/enrollments/my        → Student: my enrollments
router.get('/my', protect, getMyEnrollments);

// @route  GET    /api/enrollments/:id    → Get single enrollment
// @route  DELETE /api/enrollments/:id    → Unenroll
router
  .route('/:id')
  .get(protect, getEnrollment)
  .delete(protect, unenroll);

// @route  PUT /api/enrollments/:id/progress  → Update lesson progress
router.put('/:id/progress', protect, progressValidation, validate, updateProgress);

module.exports = router;
