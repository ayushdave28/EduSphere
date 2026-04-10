import React from 'react';
import { useAuth } from '../context/AuthContext';

const Toast = () => {
  const { toast } = useAuth();
  if (!toast) return null;

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div className="toast-container">
      <div className={`toast toast-${toast.type}`}>
        <span style={{ fontSize: '16px', fontWeight: 700 }}>{icons[toast.type]}</span>
        {toast.message}
      </div>
    </div>
  );
};

export default Toast;
