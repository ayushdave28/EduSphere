import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authAPI, enrollmentsAPI, tokenStorage } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Restore session from token on app load
  useEffect(() => {
    const restoreSession = async () => {
      const token = tokenStorage.get();
      if (!token) { setLoading(false); return; }
      try {
        const data = await authAPI.getMe();
        setUser(data.user);
      } catch (err) {
        tokenStorage.remove();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      tokenStorage.save(data.token);
      setUser(data.user);
      showToast(data.message || `Welcome back, ${data.user.name}!`, 'success');
      return { success: true, role: data.user.role };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [showToast]);

  const register = useCallback(async (name, email, password) => {
    try {
      const data = await authAPI.register(name, email, password);
      tokenStorage.save(data.token);
      setUser(data.user);
      showToast(data.message || `Welcome to EduSphere, ${name}!`, 'success');
      return { success: true, role: data.user.role };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [showToast]);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch (err) { /* silent */ }
    tokenStorage.remove();
    setUser(null);
    showToast('Logged out successfully.', 'info');
  }, [showToast]);

  const updateProfile = useCallback(async (updates) => {
    try {
      const data = await authAPI.updateProfile(updates);
      setUser(data.user);
      showToast('Profile updated successfully!', 'success');
      return { success: true, user: data.user };
    } catch (error) {
      showToast(error.message, 'error');
      return { success: false, error: error.message };
    }
  }, [showToast]);

  const updatePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      const data = await authAPI.updatePassword(currentPassword, newPassword);
      tokenStorage.save(data.token);
      showToast('Password updated successfully!', 'success');
      if (data.user) {
        setUser(data.user);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [showToast]);

  const enrollCourse = useCallback(async (courseId) => {
    try {
      const data = await enrollmentsAPI.enroll(courseId);
      setUser(prev => ({
        ...prev,
        enrolledCourses: [...(prev.enrolledCourses || []), courseId],
      }));
      showToast(data.message || 'Enrolled successfully!', 'success');
      return { success: true, enrollment: data.data };
    } catch (error) {
      showToast(error.message, 'error');
      return { success: false, error: error.message };
    }
  }, [showToast]);

  const isEnrolled = useCallback((courseId) => {
    if (!user || !user.enrolledCourses) return false;
    return user.enrolledCourses.some(id => id.toString() === courseId.toString());
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout,
      updateProfile, updatePassword, enrollCourse,
      isEnrolled, showToast, toast,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
