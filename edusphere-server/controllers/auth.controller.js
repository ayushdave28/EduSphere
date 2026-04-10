const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendTokenResponse = require('../utils/sendTokenResponse');

// ─────────────────────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Prevent direct admin registration from public API
    const allowedRoles = ['student', 'instructor'];
    const assignedRole = allowedRoles.includes(role) ? role : 'student';

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(new ErrorResponse('An account with this email already exists.', 400));
    }

    // Create user (password hashed by pre-save middleware)
    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
    });

    sendTokenResponse(user, 201, res, 'Account created successfully! Welcome to EduSphere.');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password are provided
    if (!email || !password) {
      return next(new ErrorResponse('Please provide both email and password.', 400));
    }

    // Find user and explicitly include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid email or password.', 401));
    }

    // Check if account is active
    if (!user.isActive) {
      return next(new ErrorResponse('Your account has been deactivated. Please contact support.', 401));
    }

    // Compare entered password with hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid email or password.', 401));
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res, `Welcome back, ${user.name}!`);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
// ─────────────────────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('enrolledCourses', 'title thumbnail color price');

    if (!user) {
      return next(new ErrorResponse('User not found.', 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
// ─────────────────────────────────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.user.id },
      });

      if (existingUser) {
        return next(new ErrorResponse('Another account already uses this email address.', 400));
      }
    }

    // Only allow safe fields to be updated
    const allowedFields = {
      name: req.body.name,
      email: email ? email.toLowerCase() : undefined,
      bio: req.body.bio,
      phone: req.body.phone,
      location: req.body.location,
    };

    // Remove undefined fields
    Object.keys(allowedFields).forEach(
      (key) => allowedFields[key] === undefined && delete allowedFields[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, allowedFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
// ─────────────────────────────────────────────────────────────
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(new ErrorResponse('Please provide current and new password.', 400));
    }

    if (newPassword.length < 8) {
      return next(new ErrorResponse('New password must be at least 8 characters.', 400));
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return next(new ErrorResponse('Current password is incorrect.', 401));
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password updated successfully.');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Logout user (clear cookie)
// @route   POST /api/auth/logout
// @access  Private
// ─────────────────────────────────────────────────────────────
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 5 * 1000), // expires in 5 seconds
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};
