# 🎓 EduSphere — Online Course Management System

> **AWT (01CE1412) Project | Semester 4 | Computer Engineering**
> Faculty: Prof. Kunal Khimani, Prof. Kajal Tanchak, Prof. Sweta Khatana, Prof. Rupesh Kanojiya, Prof. Charmy Vora

---

## 📌 Project Overview

**EduSphere** is a full-stack Online Course Management System built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). It provides a comprehensive platform for students to discover and enroll in courses, and for admins to manage the entire platform.

---

## 🚀 Phase 1 Completed: Frontend Design & Development

### ✅ Requirements Met (15 Marks Criteria)

| Requirement | Status | Details |
|---|---|---|
| React component-based UI | ✅ Done | Modular components: Navbar, Footer, CourseCard, Toast, ProtectedRoute |
| Client-side UI | ✅ Done | Home, Courses, Course Detail, Dashboard, Profile, Instructors, About |
| Admin-side UI | ✅ Done | Dashboard, Courses CRUD, Students, Instructors, Analytics, Settings |
| Responsive Design | ✅ Done | Mobile-first CSS, breakpoints at 640px, 768px, 1024px, 1200px |
| Forms & Validation | ✅ Done | Login, Register (with strength meter), Forgot Password, Course Form, Profile Form, all with error handling |
| Routing (React Router v6) | ✅ Done | Nested routes, protected routes, role-based access, 404 page |

---

## 🗂️ Project Structure

```
edusphere/
├── public/
│   └── index.html
├── src/
│   ├── components/           # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── CourseCard.jsx
│   │   ├── Toast.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx   # Global auth state (React Context API)
│   ├── pages/
│   │   ├── client/           # Student-facing pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── CourseDetail.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Instructors.jsx
│   │   │   └── About.jsx
│   │   └── admin/            # Admin-facing pages
│   │       ├── AdminLayout.jsx
│   │       ├── AdminSidebar.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminCourses.jsx
│   │       ├── AdminStudents.jsx
│   │       ├── AdminInstructors.jsx
│   │       ├── AdminAnalytics.jsx
│   │       └── AdminSettings.jsx
│   ├── styles/
│   │   └── global.css        # Global CSS variables + utility classes
│   ├── utils/
│   │   └── mockData.js       # Mock data for courses, instructors, stats
│   ├── App.jsx               # Root component + all routes
│   └── index.js              # Entry point
└── package.json
```

---

## 🛠️ How to Run

### Prerequisites
- Node.js v16 or higher
- npm v8 or higher

### Installation & Start

```bash
# 1. Navigate to project folder
cd edusphere

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# App runs at http://localhost:3000
```

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Student** | student@edusphere.com | student123 |
| **Admin** | admin@edusphere.com | admin123 |

> Demo credentials are pre-filled via the "Try demo" buttons on the login page.

---

## 🎨 Design Highlights

- **Dark theme** with deep navy blue palette
- **Custom CSS variables** for consistent theming
- **Google Fonts**: Syne (display) + DM Sans (body)
- **Glassmorphism** cards with backdrop blur
- **Gradient accents**: Cyan (#00d4ff) + Purple (#7c3aed)
- **Animations**: fade-in-up, floating orbs, marquee ticker
- **Micro-interactions**: hover states, button transforms, glow shadows

---

## 📄 Pages & Features

### Client Side
| Page | Route | Features |
|---|---|---|
| Home | `/` | Hero section, stats, featured courses, how-it-works, testimonials, CTA |
| Courses | `/courses` | Search, filter by category/level, sort, grid display |
| Course Detail | `/courses/:id` | Full details, curriculum accordion, enroll button |
| Dashboard | `/dashboard` | Enrolled courses, progress bars, announcements, achievements |
| Profile | `/profile` | Edit profile, change password, notification preferences |
| Instructors | `/instructors` | All instructors, stats, become-an-instructor CTA |
| About | `/about` | Mission, values, timeline, contact info |
| Login | `/login` | Email + password validation, show/hide password, demo credentials |
| Register | `/register` | Full validation + password strength meter |
| Forgot Password | `/forgot-password` | Email form + success state |

### Admin Side (requires admin login)
| Page | Route | Features |
|---|---|---|
| Dashboard | `/admin` | KPI cards, recent enrollments table, top courses chart, quick actions |
| Courses | `/admin/courses` | CRUD table, Add/Edit modal with validation, Delete confirm modal |
| Students | `/admin/students` | Table with bulk select, status filter, student detail modal |
| Instructors | `/admin/instructors` | Instructor table, invite modal with validation |
| Analytics | `/admin/analytics` | Bar chart (revenue), line chart (students), category distribution |
| Settings | `/admin/settings` | General, Payment, Email, Security, Maintenance tabs |

---

## 🔄 Routing Architecture

```
/ (public)
├── /courses
├── /courses/:id
├── /instructors
├── /about
├── /login
├── /register
├── /forgot-password
├── /dashboard (ProtectedRoute: student only)
├── /profile (ProtectedRoute: any logged-in user)
└── /admin (ProtectedRoute: admin only)
    ├── /admin/courses
    ├── /admin/students
    ├── /admin/instructors
    ├── /admin/analytics
    └── /admin/settings
```

---

## 📅 Submission Deadlines

| Phase | Deadline | Status |
|---|---|---|
| Project Definition | 31/01/2026 | ✅ Completed |
| **Frontend Design & Development** | **15/03/2026** | **✅ Completed** |
| Backend Development & Database | 31/03/2026 | 🔄 In Progress |
| Authentication & Security | 08/04/2026 | 📅 Upcoming |
| Final Submission & Deployment | 10/04/2026 | 📅 Upcoming |

---

## 🔮 Upcoming Phases

### Phase 2: Backend (Node.js + Express + MongoDB)
- REST API endpoints for courses, users, enrollments
- MongoDB schema design with Mongoose
- CRUD operations with proper error handling

### Phase 3: Authentication & Security
- JWT-based authentication
- bcrypt password hashing
- Role-based access control middleware
- Environment variables with dotenv

### Phase 4: Deployment
- Deploy frontend to Netlify/Vercel
- Deploy backend to Railway/Render
- GitHub repository with complete README
- Live application link

---

*Built with ❤️ using React.js | EduSphere — Learn Without Limits*
