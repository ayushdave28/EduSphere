const mongoose = require('mongoose');

const CurriculumLessonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  duration: { type: String, default: '0 min' },
  isPreview: { type: Boolean, default: false },
  videoUrl: { type: String, default: '' },
});

const CurriculumSectionSchema = new mongoose.Schema({
  section: { type: String, required: true, trim: true },
  lessons: [CurriculumLessonSchema],
});

const RatingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    instructor: {
      type: String,
      required: [true, 'Instructor name is required'],
      trim: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Web Development',
        'Data Science',
        'Design',
        'Cloud Computing',
        'Security',
        'Mobile Development',
        'DevOps',
        'Other',
      ],
    },
    level: {
      type: String,
      required: [true, 'Level is required'],
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      default: function () {
        return this.price * 2;
      },
    },
    thumbnail: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: '#00d4ff',
    },
    tags: {
      type: [String],
      default: [],
    },
    duration: {
      type: String,
      default: '0 hours',
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    curriculum: {
      type: [CurriculumSectionSchema],
      default: [],
    },
    ratings: {
      type: [RatingSchema],
      default: [],
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    whatYouLearn: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ───────────────────────────────────────────────
CourseSchema.index({ title: 'text', description: 'text', tags: 'text' });
CourseSchema.index({ category: 1 });
CourseSchema.index({ level: 1 });
CourseSchema.index({ price: 1 });
CourseSchema.index({ averageRating: -1 });
CourseSchema.index({ totalStudents: -1 });

// ─── Virtual: Discount percentage ─────────────────────────
CourseSchema.virtual('discountPercent').get(function () {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

// ─── Pre-save: Generate slug from title ───────────────────
CourseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }

  // Recalculate total lessons
  if (this.curriculum && this.curriculum.length > 0) {
    this.totalLessons = this.curriculum.reduce(
      (acc, section) => acc + (section.lessons ? section.lessons.length : 0),
      0
    );
  }

  next();
});

// ─── Method: Calculate and update average rating ──────────
CourseSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalReviews = 0;
  } else {
    const total = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = Math.round((total / this.ratings.length) * 10) / 10;
    this.totalReviews = this.ratings.length;
  }
};

module.exports = mongoose.model('Course', CourseSchema);
