const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const env = require('../config/env');

const getTokenFromRequest = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }

  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return null;
};

// ─── Protect: Verify JWT token ─────────────────────────────
exports.protect = async (req, res, next) => {
  const token = getTokenFromRequest(req);

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Access denied. Please log in to continue.', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, env.jwtSecret);

    // Get user from database (verify user still exists and is active)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new ErrorResponse('User no longer exists.', 401));
    }

    if (!user.isActive) {
      return next(new ErrorResponse('Your account has been deactivated. Contact support.', 401));
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ErrorResponse('Invalid token. Please log in again.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ErrorResponse('Session expired. Please log in again.', 401));
    }
    return next(new ErrorResponse('Authentication failed.', 401));
  }
};

// ─── Authorize: Role-based access control ──────────────────
// Usage: authorize('admin') or authorize('admin', 'instructor')
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('Not authenticated.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Access denied. Role '${req.user.role}' is not authorized for this action.`,
          403
        )
      );
    }

    next();
  };
};

// ─── Optional Auth: Attach user if token present, don't fail if not ──
exports.optionalAuth = async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) return next(); // No token — continue as guest

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = await User.findById(decoded.id).select('-password');
  } catch (err) {
    // Invalid token — continue as guest without throwing error
  }

  next();
};
