# 🎓 EduSphere — Backend Server

> **AWT (01CE1412) Project | Phase 2: Backend Development & Database Connectivity**

---

## ✅ Phase 2 Rubric Points Covered

| Requirement | Status | Implementation |
|---|---|---|
| **Node.js & Express REST APIs** | ✅ Done | 15+ endpoints across 4 route files |
| **Database Schema Design** | ✅ Done | 3 Mongoose schemas: User, Course, Enrollment |
| **CRUD Operations** | ✅ Done | Full Create/Read/Update/Delete for all resources |
| **Error Handling** | ✅ Done | Global error middleware + custom ErrorResponse class |

---

## 📁 Folder Structure

```
edusphere-server/
├── config/
│   └── db.js                  ← MongoDB connection
├── controllers/
│   ├── auth.controller.js     ← Register, Login, Profile, Password
│   ├── course.controller.js   ← Full CRUD + Reviews + Categories
│   ├── enrollment.controller.js ← Enroll, Progress, Unenroll
│   └── user.controller.js     ← Admin user management + Dashboard stats
├── middleware/
│   ├── auth.middleware.js     ← JWT protect + authorize + optionalAuth
│   ├── error.middleware.js    ← Global error handler
│   └── validate.middleware.js ← express-validator wrapper
├── models/
│   ├── User.js               ← Schema with bcrypt hashing + JWT method
│   ├── Course.js             ← Schema with curriculum, ratings, indexes
│   └── Enrollment.js         ← Schema with lesson progress tracking
├── routes/
│   ├── auth.routes.js        ← /api/auth/*
│   ├── course.routes.js      ← /api/courses/*
│   ├── enrollment.routes.js  ← /api/enrollments/*
│   └── user.routes.js        ← /api/users/* (admin only)
├── utils/
│   ├── errorResponse.js      ← Custom error class
│   ├── sendTokenResponse.js  ← JWT token helper
│   └── seeder.js             ← Database seeder with sample data
├── .env                      ← Environment variables (DO NOT commit)
├── .env.example              ← Safe template for GitHub
├── .gitignore
├── server.js                 ← Entry point
└── package.json
```

---

## 🚀 Setup Instructions

### Step 1 — Prerequisites
- Node.js v16+ installed ([nodejs.org](https://nodejs.org))
- MongoDB running (local OR Atlas cloud)

### Step 2 — Install Dependencies
```bash
cd edusphere-server
npm install
```

### Step 3 — Configure Environment
Open `.env` and set your MongoDB URI:

**Option A — Local MongoDB (MongoDB installed on your PC):**
```
MONGO_URI=mongodb://localhost:27017/edusphere
```

**Option B — MongoDB Atlas (Cloud, recommended):**
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create free account → Create cluster → Get connection string
3. Replace in `.env`:
```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/edusphere
```

### Step 4 — Seed the Database
```bash
npm run seed
```
This creates 2 demo users + 6 sample courses + 3 enrollments.

### Step 5 — Start the Server
```bash
npm run dev
```

**You should see:**
```
══════════════════════════════════════════════════
  🎓 EduSphere Server
══════════════════════════════════════════════════
  ✅ Status:      Running
  🌐 Port:        5000
  🔧 Mode:        development
  🔗 URL:         http://localhost:5000
  📡 API Base:    http://localhost:5000/api
══════════════════════════════════════════════════

✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@edusphere.com | admin123 |
| **Student** | student@edusphere.com | student123 |

---

## 📡 All API Endpoints

### Auth Routes `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login + get JWT token |
| POST | `/api/auth/logout` | Private | Logout (clear cookie) |
| GET | `/api/auth/me` | Private | Get current user |
| PUT | `/api/auth/updateprofile` | Private | Update name/bio/phone/location |
| PUT | `/api/auth/updatepassword` | Private | Change password |

### Course Routes `/api/courses`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/courses` | Public | Get all courses (search, filter, sort, paginate) |
| POST | `/api/courses` | Admin | Create new course |
| GET | `/api/courses/categories` | Public | Get categories with counts |
| GET | `/api/courses/:id` | Public | Get single course |
| PUT | `/api/courses/:id` | Admin | Update course |
| DELETE | `/api/courses/:id` | Admin | Delete course |
| POST | `/api/courses/:id/reviews` | Student | Add rating & review |

### Enrollment Routes `/api/enrollments`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/enrollments` | Student | Enroll in a course |
| GET | `/api/enrollments` | Admin | Get all enrollments |
| GET | `/api/enrollments/my` | Student | Get my enrolled courses |
| GET | `/api/enrollments/:id` | Private | Get single enrollment |
| PUT | `/api/enrollments/:id/progress` | Student | Update lesson progress |
| DELETE | `/api/enrollments/:id` | Private | Unenroll from course |

### User Routes `/api/users` (Admin only)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users` | Admin | Get all users |
| GET | `/api/users/stats` | Admin | Dashboard statistics |
| GET | `/api/users/:id` | Admin | Get single user |
| PUT | `/api/users/:id` | Admin | Update user (role, status) |
| DELETE | `/api/users/:id` | Admin | Delete user |

---

## 🧪 Testing with Postman

### 1. Register
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test Student",
  "email": "test@gmail.com",
  "password": "Test@1234"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@edusphere.com",
  "password": "admin123"
}
```
→ Copy the `token` from the response.

### 3. Protected Route (use token)
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer <paste_token_here>
```

### 4. Get All Courses
```
GET http://localhost:5000/api/courses
GET http://localhost:5000/api/courses?category=Web Development
GET http://localhost:5000/api/courses?sort=rating&level=Beginner
```

### 5. Create Course (Admin)
```
POST http://localhost:5000/api/courses
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Beginner JavaScript Bootcamp",
  "description": "Learn JavaScript from scratch with hands-on projects.",
  "instructor": "John Doe",
  "category": "Web Development",
  "level": "Beginner",
  "price": 2999
}
```

---

## 🔒 Security Features Implemented

- **Helmet** — Sets secure HTTP headers
- **CORS** — Only allows requests from localhost:3000
- **Rate Limiting** — 100 requests/10 min per IP; 20 requests/15 min on auth routes
- **MongoDB Sanitize** — Prevents NoSQL injection attacks
- **bcryptjs** — Passwords hashed with salt rounds of 12
- **JWT** — Tokens expire after 30 days
- **Input Validation** — express-validator on all POST/PUT routes

---

## 🛠️ Available Scripts

```bash
npm run dev    # Start with nodemon (auto-restart on file changes)
npm start      # Start in production mode
npm run seed   # Seed database with sample data
node utils/seeder.js -d   # Destroy all database data
```

---

*EduSphere Backend — Built with Node.js + Express + MongoDB*
