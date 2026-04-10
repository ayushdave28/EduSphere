const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load env vars
dotenv.config();

// Load models
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// ─── Sample Data ───────────────────────────────────────────
const users = [
  {
    name: 'Admin User',
    email: 'admin@edusphere.com',
    password: 'admin123',
    role: 'admin',
    bio: 'Platform administrator',
  },
  {
    name: 'Alex Johnson',
    email: 'student@edusphere.com',
    password: 'student123',
    role: 'student',
    bio: 'Passionate learner exploring web development.',
    location: 'Mumbai, India',
  },
  {
    name: 'Dr. Sarah Mitchell',
    email: 'sarah@edusphere.com',
    password: 'instructor123',
    role: 'instructor',
    bio: 'Full-stack developer with 12+ years of experience at top tech companies.',
    location: 'Bangalore, India',
  },
  {
    name: 'Prof. James Chen',
    email: 'james@edusphere.com',
    password: 'instructor123',
    role: 'instructor',
    bio: 'Data scientist at Google, PhD from MIT. Passionate about making ML accessible.',
    location: 'Hyderabad, India',
  },
];

const courses = [
  {
    title: 'Full-Stack Web Development with MERN',
    description:
      'Master MongoDB, Express, React, and Node.js to build modern full-stack web applications from scratch. This comprehensive course covers everything from setting up your development environment to deploying production-ready applications.',
    instructor: 'Dr. Sarah Mitchell',
    category: 'Web Development',
    level: 'Intermediate',
    price: 4999,
    originalPrice: 8999,
    color: '#00d4ff',
    tags: ['React', 'Node.js', 'MongoDB', 'Express'],
    duration: '48 hours',
    isFeatured: true,
    isBestseller: true,
    averageRating: 4.8,
    totalStudents: 12450,
    totalReviews: 2340,
    whatYouLearn: [
      'Build full-stack MERN applications',
      'Design and implement REST APIs',
      'Work with MongoDB and Mongoose',
      'Implement JWT authentication',
      'Deploy to cloud platforms',
    ],
    requirements: [
      'Basic JavaScript knowledge',
      'Understanding of HTML & CSS',
      'Familiarity with command line',
    ],
    curriculum: [
      {
        section: 'Getting Started',
        lessons: [
          { title: 'Course Introduction', duration: '5 min', isPreview: true },
          { title: 'Environment Setup', duration: '15 min', isPreview: true },
          { title: 'JavaScript ES6+ Refresher', duration: '45 min' },
        ],
      },
      {
        section: 'React Fundamentals',
        lessons: [
          { title: 'JSX & Components', duration: '30 min' },
          { title: 'Props & State', duration: '40 min' },
          { title: 'Hooks Deep Dive', duration: '60 min' },
          { title: 'React Router', duration: '35 min' },
        ],
      },
      {
        section: 'Node.js & Express',
        lessons: [
          { title: 'REST APIs with Express', duration: '50 min' },
          { title: 'Middleware', duration: '25 min' },
          { title: 'JWT Authentication', duration: '45 min' },
        ],
      },
      {
        section: 'MongoDB',
        lessons: [
          { title: 'Schema Design with Mongoose', duration: '40 min' },
          { title: 'CRUD Operations', duration: '35 min' },
          { title: 'Aggregation Pipeline', duration: '55 min' },
        ],
      },
    ],
  },
  {
    title: 'Advanced Python for Data Science',
    description:
      'Deep dive into Python for machine learning, data analysis, and visualization with real-world projects. Go from data wrangling with Pandas to building machine learning models with scikit-learn and TensorFlow.',
    instructor: 'Prof. James Chen',
    category: 'Data Science',
    level: 'Advanced',
    price: 5999,
    originalPrice: 10999,
    color: '#7c3aed',
    tags: ['Python', 'Pandas', 'TensorFlow', 'Jupyter'],
    duration: '60 hours',
    isFeatured: true,
    isBestseller: false,
    averageRating: 4.9,
    totalStudents: 18900,
    totalReviews: 3120,
    whatYouLearn: [
      'Advanced Python programming techniques',
      'Data analysis with Pandas and NumPy',
      'Machine learning with scikit-learn',
      'Deep learning with TensorFlow',
      'Data visualization with Matplotlib',
    ],
    requirements: [
      'Basic Python knowledge',
      'High school mathematics',
      'Anaconda/Jupyter installed',
    ],
    curriculum: [
      {
        section: 'Python Advanced Concepts',
        lessons: [
          { title: 'Decorators & Context Managers', duration: '40 min', isPreview: true },
          { title: 'Generators & Iterators', duration: '35 min' },
        ],
      },
      {
        section: 'Data Analysis',
        lessons: [
          { title: 'NumPy Arrays & Operations', duration: '45 min' },
          { title: 'Pandas DataFrames', duration: '60 min' },
          { title: 'Matplotlib & Seaborn', duration: '50 min' },
        ],
      },
      {
        section: 'Machine Learning',
        lessons: [
          { title: 'Scikit-learn Fundamentals', duration: '55 min' },
          { title: 'Model Evaluation & Tuning', duration: '45 min' },
          { title: 'Neural Networks with TensorFlow', duration: '90 min' },
        ],
      },
    ],
  },
  {
    title: 'UI/UX Design Masterclass',
    description:
      'Learn Figma, design systems, and user research to create stunning, user-centered digital products. Master the entire design process from wireframing to high-fidelity prototypes.',
    instructor: 'Dr. Sarah Mitchell',
    category: 'Design',
    level: 'Beginner',
    price: 3499,
    originalPrice: 6999,
    color: '#ff3d9a',
    tags: ['Figma', 'Prototyping', 'UX Research', 'Design Systems'],
    duration: '36 hours',
    isFeatured: false,
    isBestseller: true,
    averageRating: 4.7,
    totalStudents: 9200,
    totalReviews: 1890,
    whatYouLearn: [
      'Master Figma for UI design',
      'Conduct effective UX research',
      'Build scalable design systems',
      'Create interactive prototypes',
    ],
    requirements: ['No prior design experience needed', 'A computer with internet access'],
    curriculum: [
      {
        section: 'Design Foundations',
        lessons: [
          { title: 'Color Theory', duration: '25 min', isPreview: true },
          { title: 'Typography Principles', duration: '30 min' },
          { title: 'Layout & Composition', duration: '35 min' },
        ],
      },
      {
        section: 'Figma Mastery',
        lessons: [
          { title: 'Components & Variants', duration: '45 min' },
          { title: 'Auto Layout', duration: '40 min' },
          { title: 'Prototyping & Interactions', duration: '50 min' },
        ],
      },
    ],
  },
  {
    title: 'Cloud Architecture with AWS',
    description:
      'Design, deploy and manage scalable cloud solutions using Amazon Web Services core services. Prepare for the AWS Solutions Architect certification with hands-on projects.',
    instructor: 'Prof. James Chen',
    category: 'Cloud Computing',
    level: 'Advanced',
    price: 6999,
    originalPrice: 12999,
    color: '#ff6b35',
    tags: ['AWS', 'EC2', 'S3', 'Lambda', 'Docker'],
    duration: '52 hours',
    isFeatured: true,
    isBestseller: false,
    averageRating: 4.8,
    totalStudents: 7800,
    totalReviews: 1560,
    whatYouLearn: [
      'Core AWS services (EC2, S3, RDS, Lambda)',
      'Design highly available architectures',
      'Implement serverless applications',
      'Containerization with Docker & ECS',
    ],
    requirements: ['Basic networking knowledge', 'Linux command line familiarity', 'AWS free tier account'],
    curriculum: [
      {
        section: 'AWS Fundamentals',
        lessons: [
          { title: 'IAM & Security', duration: '40 min', isPreview: true },
          { title: 'EC2 & Auto Scaling', duration: '55 min' },
          { title: 'S3 & CloudFront', duration: '45 min' },
        ],
      },
      {
        section: 'Serverless Architecture',
        lessons: [
          { title: 'AWS Lambda Functions', duration: '50 min' },
          { title: 'API Gateway', duration: '40 min' },
          { title: 'DynamoDB', duration: '45 min' },
        ],
      },
    ],
  },
  {
    title: 'Cybersecurity & Ethical Hacking',
    description:
      'Learn penetration testing, vulnerability assessment, and how to secure modern applications. Get hands-on experience with real tools used by security professionals.',
    instructor: 'Dr. Sarah Mitchell',
    category: 'Security',
    level: 'Intermediate',
    price: 5499,
    originalPrice: 9999,
    color: '#00e5a0',
    tags: ['Kali Linux', 'Penetration Testing', 'Network Security'],
    duration: '44 hours',
    isFeatured: false,
    isBestseller: false,
    averageRating: 4.6,
    totalStudents: 10300,
    totalReviews: 2100,
    whatYouLearn: [
      'Penetration testing methodology',
      'Network vulnerability assessment',
      'Web application security',
      'Cryptography fundamentals',
    ],
    requirements: ['Basic networking knowledge', 'Linux fundamentals', 'Curiosity and ethical mindset'],
    curriculum: [
      {
        section: 'Security Fundamentals',
        lessons: [
          { title: 'CIA Triad & Threat Modeling', duration: '30 min', isPreview: true },
          { title: 'Cryptography Basics', duration: '45 min' },
        ],
      },
      {
        section: 'Ethical Hacking',
        lessons: [
          { title: 'Reconnaissance Techniques', duration: '40 min' },
          { title: 'Exploitation with Metasploit', duration: '60 min' },
          { title: 'Web App Pentesting', duration: '55 min' },
        ],
      },
    ],
  },
  {
    title: 'Mobile App Development with React Native',
    description:
      'Build cross-platform iOS and Android apps using React Native and Expo framework. Ship real apps to the App Store and Google Play.',
    instructor: 'Prof. James Chen',
    category: 'Mobile Development',
    level: 'Intermediate',
    price: 4499,
    originalPrice: 7999,
    color: '#00d4ff',
    tags: ['React Native', 'Expo', 'iOS', 'Android'],
    duration: '40 hours',
    isFeatured: false,
    isBestseller: true,
    averageRating: 4.7,
    totalStudents: 8600,
    totalReviews: 1780,
    whatYouLearn: [
      'Build iOS and Android apps with one codebase',
      'Navigation with React Navigation',
      'State management with Redux',
      'Push notifications and native APIs',
    ],
    requirements: ['React.js knowledge required', 'JavaScript ES6+', 'Node.js installed'],
    curriculum: [
      {
        section: 'React Native Basics',
        lessons: [
          { title: 'Setting Up Expo', duration: '20 min', isPreview: true },
          { title: 'Core Components', duration: '40 min' },
          { title: 'Navigation', duration: '50 min' },
        ],
      },
      {
        section: 'Advanced Features',
        lessons: [
          { title: 'Native APIs & Permissions', duration: '45 min' },
          { title: 'Push Notifications', duration: '35 min' },
          { title: 'App Store Deployment', duration: '30 min' },
        ],
      },
    ],
  },
];

// ─── Import Data ────────────────────────────────────────────
const importData = async () => {
  try {
    console.log('🌱 Starting database seed...'.cyan.bold);

    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();
    await Enrollment.deleteMany();
    console.log('🗑️  Cleared existing data'.yellow);

    // Insert users (passwords will be hashed by pre-save middleware)
    const createdUsers = await User.create(users);
    const adminUser = createdUsers.find((u) => u.role === 'admin');
    const studentUser = createdUsers.find((u) => u.role === 'student');
    const instructorUser = createdUsers.find((u) => u.role === 'instructor');

    console.log(`👥 Created ${createdUsers.length} users`.green);

    // Insert courses with instructor reference
    const coursesWithInstructor = courses.map((c) => ({
      ...c,
      instructorId: instructorUser._id,
    }));

    const createdCourses = await Course.insertMany(coursesWithInstructor);
    console.log(`📚 Created ${createdCourses.length} courses`.green);

    // Create sample enrollments for the demo student
    const enrollments = createdCourses.slice(0, 3).map((course) => ({
      student: studentUser._id,
      course: course._id,
      amountPaid: course.price,
      progress: Math.floor(Math.random() * 80) + 10,
    }));

    await Enrollment.insertMany(enrollments);

    // Update student's enrolled courses
    await User.findByIdAndUpdate(studentUser._id, {
      enrolledCourses: createdCourses.slice(0, 3).map((c) => c._id),
    });

    console.log(`📋 Created ${enrollments.length} enrollments`.green);

    console.log('\n✅ Database seeded successfully!'.green.bold);
    console.log('─'.repeat(40).cyan);
    console.log('📧 Demo Accounts:'.cyan.bold);
    console.log('   Admin:   admin@edusphere.com / admin123'.white);
    console.log('   Student: student@edusphere.com / student123'.white);
    console.log('─'.repeat(40).cyan);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeder Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// ─── Destroy Data ───────────────────────────────────────────
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Course.deleteMany();
    await Enrollment.deleteMany();
    console.log('🗑️  All data destroyed!'.red.bold);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// Run: node utils/seeder.js        → import data
// Run: node utils/seeder.js -d     → destroy data
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
