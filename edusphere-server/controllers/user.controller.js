const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const ErrorResponse = require('../utils/errorResponse');

// ─────────────────────────────────────────────────────────────
// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
// ─────────────────────────────────────────────────────────────
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by role
    if (req.query.role) query.role = req.query.role;

    // Filter by status
    if (req.query.status === 'active') query.isActive = true;
    if (req.query.status === 'inactive') query.isActive = false;

    // Search by name or email
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query).sort('-createdAt').skip(skip).limit(limit).select('-password'),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private (Admin)
// ─────────────────────────────────────────────────────────────
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('enrolledCourses', 'title price category');

    if (!user) {
      return next(new ErrorResponse('User not found.', 404));
    }

    // Get enrollment count and progress
    const enrollments = await Enrollment.find({ student: user._id }).populate('course', 'title');

    res.status(200).json({
      success: true,
      data: user,
      enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Update user (Admin can update role, status etc.)
// @route   PUT /api/users/:id
// @access  Private (Admin)
// ─────────────────────────────────────────────────────────────
exports.updateUser = async (req, res, next) => {
  try {
    // Only allow specific fields to be updated by admin
    const allowedUpdates = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      isActive: req.body.isActive,
      bio: req.body.bio,
    };

    // Remove undefined values
    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const user = await User.findByIdAndUpdate(req.params.id, allowedUpdates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return next(new ErrorResponse('User not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
// ─────────────────────────────────────────────────────────────
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse('User not found.', 404));
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user.id.toString()) {
      return next(new ErrorResponse('You cannot delete your own admin account.', 400));
    }

    // Delete all enrollments for this user
    await Enrollment.deleteMany({ student: user._id });

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User and associated data deleted successfully.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Get admin dashboard stats
// @route   GET /api/users/stats
// @access  Private (Admin)
// ─────────────────────────────────────────────────────────────
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalInstructors,
      totalAdmins,
      totalEnrollments,
      recentEnrollments,
      topCourses,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'instructor' }),
      User.countDocuments({ role: 'admin' }),
      Enrollment.countDocuments(),
      Enrollment.find()
        .populate('student', 'name email')
        .populate('course', 'title price')
        .sort('-enrolledAt')
        .limit(5),
      require('../models/Course').find({ isPublished: true })
        .sort('-totalStudents')
        .limit(5)
        .select('title totalStudents averageRating price category'),
    ]);

    // Calculate total revenue
    const revenueData = await Enrollment.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amountPaid' } } },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Monthly enrollment stats (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Enrollment.aggregate([
      { $match: { enrolledAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$enrolledAt' },
            month: { $month: '$enrolledAt' },
          },
          count: { $sum: 1 },
          revenue: { $sum: '$amountPaid' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: { students: totalStudents, instructors: totalInstructors, admins: totalAdmins },
        totalEnrollments,
        totalRevenue,
        recentEnrollments,
        topCourses,
        monthlyStats,
      },
    });
  } catch (error) {
    next(error);
  }
};
