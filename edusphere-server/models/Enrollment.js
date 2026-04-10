const mongoose = require('mongoose');

const LessonProgressSchema = new mongoose.Schema({
  lessonTitle: { type: String, required: true },
  sectionTitle: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
});

const EnrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedLessons: {
      type: [LessonProgressSchema],
      default: [],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'refunded'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ───────────────────────────────────────────────
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true }); // Prevent duplicate enrollments
EnrollmentSchema.index({ student: 1 });
EnrollmentSchema.index({ course: 1 });

// ─── Method: Calculate progress percentage ─────────────────
EnrollmentSchema.methods.calculateProgress = function (totalLessons) {
  if (!totalLessons || totalLessons === 0) return 0;
  const completed = this.completedLessons.filter((l) => l.completed).length;
  this.progress = Math.round((completed / totalLessons) * 100);
  this.isCompleted = this.progress === 100;
  if (this.isCompleted && !this.completedAt) {
    this.completedAt = new Date();
  }
  return this.progress;
};

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
