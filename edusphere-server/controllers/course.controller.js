const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const ErrorResponse = require('../utils/errorResponse');

// ─────────────────────────────────────────────────────────────
// @desc    Get all courses (with search, filter, sort, pagination)
// @route   GET /api/courses
// @access  Public
// ─────────────────────────────────────────────────────────────
exports.getCourses = async (req, res, next) => {
  try {
    let query = { isPublished: true };

    // ── Search ───────────────────────────────
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // ── Category filter ───────────────────────
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // ── Level filter ──────────────────────────
    if (req.query.level && req.query.level !== 'All') {
      query.level = req.query.level;
    }

    // ── Price range filter ────────────────────
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // ── Featured filter ───────────────────────
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }

    // ── Sorting ───────────────────────────────
    let sortBy = '-createdAt'; // default: newest first
    if (req.query.sort === 'popular') sortBy = '-totalStudents';
    else if (req.query.sort === 'rating') sortBy = '-averageRating';
    else if (req.query.sort === 'price-low') sortBy = 'price';
    else if (req.query.sort === 'price-high') sortBy = '-price';
    else if (req.query.sort === 'newest') sortBy = '-createdAt';

    // ── Pagination ────────────────────────────
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Execute query
    const [courses, total] = await Promise.all([
      Course.find(query).sort(sortBy).skip(skip).limit(limit).select('-curriculum -ratings'),
      Course.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
// ─────────────────────────────────────────────────────────────
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse('Course not found.', 404));
    }

    // Check if requesting user is enrolled (if logged in)
    let isEnrolled = false;
    if (req.user) {
      const enrollment = await Enrollment.findOne({
        student: req.user.id,
        course: course._id,
      });
      isEnrolled = !!enrollment;
    }

    res.status(200).json({
      success: true,
      data: course,
      isEnrolled,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin only)
// ─────────────────────────────────────────────────────────────
exports.createCourse = async (req, res, next) => {
  try {
    // Attach the admin as instructor if not provided
    if (!req.body.instructorId) {
      req.body.instructorId = req.user.id;
    }

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Admin only)
// ─────────────────────────────────────────────────────────────
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse('Course not found.', 404));
    }

    // Prevent changing instructorId through update
    delete req.body.instructorId;
    delete req.body.slug;
    delete req.body.totalStudents;

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully.',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Admin only)
// ─────────────────────────────────────────────────────────────
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse('Course not found.', 404));
    }

    // Delete all enrollments for this course
    await Enrollment.deleteMany({ course: req.params.id });

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course and all associated enrollments deleted successfully.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Add a rating/review to a course
// @route   POST /api/courses/:id/reviews
// @access  Private (enrolled students only)
// ─────────────────────────────────────────────────────────────
exports.addReview = async (req, res, next) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return next(new ErrorResponse('Rating must be between 1 and 5.', 400));
    }

    const course = await Course.findById(req.params.id);
    if (!course) return next(new ErrorResponse('Course not found.', 404));

    // Check if student is enrolled
    const enrollment = await Enrollment.findOne({ student: req.user.id, course: course._id });
    if (!enrollment) {
      return next(new ErrorResponse('You must be enrolled in this course to leave a review.', 403));
    }

    // Check if already reviewed
    const alreadyReviewed = course.ratings.find(
      (r) => r.user.toString() === req.user.id.toString()
    );
    if (alreadyReviewed) {
      return next(new ErrorResponse('You have already reviewed this course.', 400));
    }

    course.ratings.push({ user: req.user.id, rating: Number(rating), review: review || '' });
    course.calculateAverageRating();
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully.',
      data: { averageRating: course.averageRating, totalReviews: course.totalReviews },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Get all categories with counts
// @route   GET /api/courses/categories
// @access  Public
// ─────────────────────────────────────────────────────────────
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Course.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
