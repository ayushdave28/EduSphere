const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  logout,
} = require('../controllers/auth.controller');

const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

// ─── Validation rules ──────────────────────────────────────

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters.')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters.'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/(?=.*[A-Z])/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/(?=.*[0-9])/).withMessage('Password must contain at least one number.'),
];

const loginValidation = [
  body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('Invalid email format.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

// ─── Routes ───────────────────────────────────────────────

// @route  POST /api/auth/register
router.post('/register', registerValidation, validate, register);

// @route  POST /api/auth/login
router.post('/login', loginValidation, validate, login);

// @route  POST /api/auth/logout
router.post('/logout', protect, logout);

// @route  GET /api/auth/me
router.get('/me', protect, getMe);

// @route  PUT /api/auth/updateprofile
router.put('/updateprofile', protect, [
  body('name').optional().trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters.'),
  body('email').optional().trim().isEmail().withMessage('Please provide a valid email address.').normalizeEmail(),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters.'),
], validate, updateProfile);

// @route  PUT /api/auth/updatepassword
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
