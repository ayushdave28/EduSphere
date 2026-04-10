// ============================================================
//  EduSphere API Service
//  All HTTP requests to the backend go through this file
// ============================================================

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ─── Helper: Get auth token from localStorage ─────────────
const getToken = () => localStorage.getItem('edusphere_token');

// ─── Helper: Build headers ────────────────────────────────
const getHeaders = (withAuth = true) => {
  const headers = { 'Content-Type': 'application/json' };
  if (withAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// ─── Helper: Handle API response ──────────────────────────
const handleResponse = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    // Throw the server's error message
    throw new Error(data.error || `Server error: ${response.status}`);
  }
  return data;
};

// ─── Helper: Generic request function ─────────────────────
const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: getHeaders(options.auth !== false),
    credentials: 'include',
    ...options,
  };
  delete config.auth; // Remove our custom flag before passing to fetch

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Make sure the backend is running on port 5000.');
    }
    throw error;
  }
};

// ============================================================
//  AUTH API
// ============================================================

export const authAPI = {
  // Register new user
  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ name, email, password }),
    }),

  // Login
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ email, password }),
    }),

  // Logout
  logout: () =>
    request('/auth/logout', { method: 'POST' }),

  // Get current logged in user
  getMe: () =>
    request('/auth/me'),

  // Update profile
  updateProfile: (profileData) =>
    request('/auth/updateprofile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  // Update password
  updatePassword: (currentPassword, newPassword) =>
    request('/auth/updatepassword', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// ============================================================
//  COURSES API
// ============================================================

export const coursesAPI = {
  // Get all courses with optional filters
  // params: { search, category, level, sort, page, limit, featured }
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== 'All'))
    ).toString();
    return request(`/courses${queryString ? `?${queryString}` : ''}`, { auth: false });
  },

  // Get single course by ID
  getById: (id) =>
    request(`/courses/${id}`, { auth: false }),

  // Get all categories
  getCategories: () =>
    request('/courses/categories', { auth: false }),

  // Create course (Admin only)
  create: (courseData) =>
    request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }),

  // Update course (Admin only)
  update: (id, courseData) =>
    request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    }),

  // Delete course (Admin only)
  delete: (id) =>
    request(`/courses/${id}`, { method: 'DELETE' }),

  // Add review to course
  addReview: (id, rating, review) =>
    request(`/courses/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, review }),
    }),
};

// ============================================================
//  ENROLLMENTS API
// ============================================================

export const enrollmentsAPI = {
  // Enroll in a course
  enroll: (courseId) =>
    request('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    }),

  // Get my enrollments
  getMy: () =>
    request('/enrollments/my'),

  // Get single enrollment
  getById: (id) =>
    request(`/enrollments/${id}`),

  // Update lesson progress
  updateProgress: (enrollmentId, lessonTitle, sectionTitle, completed = true) =>
    request(`/enrollments/${enrollmentId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ lessonTitle, sectionTitle, completed }),
    }),

  // Unenroll from a course
  unenroll: (enrollmentId) =>
    request(`/enrollments/${enrollmentId}`, { method: 'DELETE' }),

  // Get all enrollments (Admin only)
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return request(`/enrollments${queryString ? `?${queryString}` : ''}`);
  },
};

// ============================================================
//  USERS API (Admin only)
// ============================================================

export const usersAPI = {
  // Get all users
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return request(`/users${queryString ? `?${queryString}` : ''}`);
  },

  // Get single user
  getById: (id) =>
    request(`/users/${id}`),

  // Update user
  update: (id, userData) =>
    request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  // Delete user
  delete: (id) =>
    request(`/users/${id}`, { method: 'DELETE' }),

  // Get dashboard stats
  getDashboardStats: () =>
    request('/users/stats'),
};

// ============================================================
//  TOKEN STORAGE HELPERS (used by AuthContext)
// ============================================================

export const tokenStorage = {
  save: (token) => localStorage.setItem('edusphere_token', token),
  get: () => localStorage.getItem('edusphere_token'),
  remove: () => localStorage.removeItem('edusphere_token'),
};
