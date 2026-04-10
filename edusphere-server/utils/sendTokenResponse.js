const env = require('../config/env');

// Helper: Create JWT, set cookie, and send response
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  // Generate JWT token
  const token = user.getSignedJwtToken();

  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + env.jwtCookieExpireDays * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Cannot be accessed by JavaScript
    secure: env.nodeEnv === 'production', // HTTPS only in production
    sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
  };

  // Build safe user object (no password)
  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    bio: user.bio,
    phone: user.phone,
    location: user.location,
    enrolledCourses: user.enrolledCourses,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      message,
      token,
      user: safeUser,
    });
};

module.exports = sendTokenResponse;
