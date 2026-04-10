const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// ─────────────────────────────────────────────────────────────
// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private (Student)
// ─────────────────────────────────────────────────────────────
exports.enrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return next(new ErrorResponse('Course ID is required.', 400));
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorResponse('Course not found.', 404));
    }

    if (!course.isPublished) {
      return next(new ErrorResponse('This course is not available for enrollment.', 400));
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (existingEnrollment) {
      return next(new ErrorResponse('You are already enrolled in this course.', 400));
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
      amountPaid: course.price,
      paymentStatus: 'completed',
    });

    // Add course to user's enrolledCourses
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { enrolledCourses: courseId },
    });

    // Increment course student count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { totalStudents: 1 },
    });

    // Populate response
    await enrollment.populate('course', 'title thumbnail color price instructor');

    res.status(201).json({
      success: true,
      message: `Successfully enrolled in "${course.title}"!`,
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Get my enrolled courses
// @route   GET /api/enrollments/my
// @access  Private (Student)
// ─────────────────────────────────────────────────────────────
exports.getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('course', 'title thumbnail color price instructor category level duration totalLessons averageRating')
      .sort('-enrolledAt');

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Get single enrollment details
// @route   GET /api/enrollments/:id
// @access  Private
// ─────────────────────────────────────────────────────────────
exports.getEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate(
      'course',
      'title thumbnail color instructor curriculum totalLessons'
    );

    if (!enrollment) {
      return next(new ErrorResponse('Enrollment not found.', 404));
    }

    // Ensure the student can only see their own enrollment
    if (
      enrollment.student.toString() !== req.user.id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(new ErrorResponse('Access denied.', 403));
    }

    // Update last accessed
    enrollment.lastAccessedAt = new Date();
    await enrollment.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Update lesson progress
// @route   PUT /api/enrollments/:id/progress
// @access  Private (Student - own enrollment)
// ─────────────────────────────────────────────────────────────
exports.updateProgress = async (req, res, next) => {
  try {
    const { lessonTitle, sectionTitle, completed } = req.body;

    if (!lessonTitle || !sectionTitle) {
      return next(new ErrorResponse('Lesson title and section title are required.', 400));
    }

    const enrollment = await Enrollment.findById(req.params.id).populate('course', 'totalLessons curriculum');

    if (!enrollment) {
      return next(new ErrorResponse('Enrollment not found.', 404));
    }

    if (enrollment.student.toString() !== req.user.id.toString()) {
      return next(new ErrorResponse('Access denied.', 403));
    }

    // Find or create lesson progress entry
    const existingLesson = enrollment.completedLessons.find(
      (l) => l.lessonTitle === lessonTitle && l.sectionTitle === sectionTitle
    );

    if (existingLesson) {
      existingLesson.completed = completed !== undefined ? completed : true;
      existingLesson.completedAt = completed ? new Date() : null;
    } else {
      enrollment.completedLessons.push({
        lessonTitle,
        sectionTitle,
        completed: completed !== undefined ? completed : true,
        completedAt: new Date(),
      });
    }

    // Recalculate progress
    const totalLessons = enrollment.course.totalLessons || 1;
    enrollment.calculateProgress(totalLessons);
    enrollment.lastAccessedAt = new Date();

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated.',
      data: {
        progress: enrollment.progress,
        isCompleted: enrollment.isCompleted,
        completedLessons: enrollment.completedLessons.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Unenroll from a course
// @route   DELETE /api/enrollments/:id
// @access  Private (Student - own enrollment or Admin)
// ─────────────────────────────────────────────────────────────
exports.unenroll = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return next(new ErrorResponse('Enrollment not found.', 404));
    }

    // Only the student themselves or admin can unenroll
    if (
      enrollment.student.toString() !== req.user.id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(new ErrorResponse('Access denied.', 403));
    }

    // Remove course from user's enrolledCourses
    await User.findByIdAndUpdate(enrollment.student, {
      $pull: { enrolledCourses: enrollment.course },
    });

    // Decrement course student count
    await Course.findByIdAndUpdate(enrollment.course, {
      $inc: { totalStudents: -1 },
    });

    await enrollment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from the course.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Get all enrollments (Admin only)
// @route   GET /api/enrollments
// @access  Private (Admin)
// ─────────────────────────────────────────────────────────────
exports.getAllEnrollments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [enrollments, total] = await Promise.all([
      Enrollment.find()
        .populate('student', 'name email avatar')
        .populate('course', 'title price category')
        .sort('-enrolledAt')
        .skip(skip)
        .limit(limit),
      Enrollment.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: enrollments.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};
