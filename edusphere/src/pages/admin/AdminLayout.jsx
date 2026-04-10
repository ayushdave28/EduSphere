import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Toast from '../../components/Toast';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-content">
        {/* Top bar */}
        <div className="admin-topbar">
          <button className="hamburger-admin" onClick={() => setSidebarOpen(true)}>
            <span /><span /><span />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Admin Panel</span>
            <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--accent-primary)' }}>● Live</span>
          </div>
        </div>

        <Outlet />
      </div>

      <Toast />

      <style>{`
        .admin-topbar { display: none; align-items: center; padding: 12px 20px; background: var(--bg-secondary); border-bottom: 1px solid var(--border-color); margin: -32px -32px 32px; }
        .hamburger-admin { display: flex; flex-direction: column; gap: 4px; background: none; border: none; cursor: pointer; padding: 4px; }
        .hamburger-admin span { display: block; width: 20px; height: 2px; background: var(--text-primary); border-radius: 2px; }
        @media (max-width: 1024px) { .admin-topbar { display: flex; } }
        @media (max-width: 640px) { .admin-content { padding: 16px; } .admin-topbar { margin: -16px -16px 16px; } }
      `}</style>
    </div>
  );
};

export default AdminLayout;
