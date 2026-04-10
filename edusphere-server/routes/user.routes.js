const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getDashboardStats,
} = require('../controllers/user.controller');

const { protect, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

// ─── Validation rules ──────────────────────────────────────

const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters.'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(['student', 'instructor', 'admin']).withMessage('Invalid role.'),
];

// ─── All user routes require admin access ─────────────────

// @route  GET /api/users/stats   → Admin dashboard stats
router.get('/stats', protect, authorize('admin'), getDashboardStats);

// @route  GET /api/users         → Get all users
// (no POST here — registration is handled by /api/auth/register)
router.get('/', protect, authorize('admin'), getAllUsers);

// @route  GET    /api/users/:id  → Get single user
// @route  PUT    /api/users/:id  → Update user
// @route  DELETE /api/users/:id  → Delete user
router
  .route('/:id')
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), updateUserValidation, validate, updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
