import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/sidebar.css';

const NAV_ITEMS = {
  admin: [
    { path: '/admin-dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/users', icon: '👥', label: 'Users' },
    { path: '/admin/internships', icon: '💼', label: 'Internships' },
    { path: '/admin/applications', icon: '📋', label: 'Applications' },
    { path: '/admin/reports', icon: '📈', label: 'Reports' },
    { path: '/system-flow', icon: '🔄', label: 'System Flow' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ],
  company: [
    { path: '/company-dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/internships/create', icon: '➕', label: 'Post Internship' },
    { path: '/internships', icon: '💼', label: 'Internships' },
    { path: '/reports', icon: '📈', label: 'Reports' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ],
  student: [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/internships', icon: '🔍', label: 'Browse' },
    { path: '/my-applications', icon: '📋', label: 'Applications' },
    { path: '/student-hub', icon: '🎓', label: 'Student Hub' },
    { path: '/reports', icon: '📈', label: 'Reports' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ],
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const items = NAV_ITEMS[user.role] || [];

  const roleColors = {
    admin: '#e63946',
    company: '#2a9d8f',
    student: '#4361ee',
  };

  const roleColor = roleColors[user.role] || '#4361ee';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`} style={{ borderTop: `3px solid ${roleColor}` }}>
      {/* Toggle */}
      <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '›' : '‹'}
      </button>

      {/* User Info */}
      {!collapsed && (
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background: roleColor }}>
            {user.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.fullName}</div>
            <div className="sidebar-user-role" style={{ color: roleColor }}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </div>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav className="sidebar-nav">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
              style={isActive ? { borderLeft: `3px solid ${roleColor}`, color: roleColor } : {}}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : ''}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              {!collapsed && <span className="sidebar-item-label">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button className="sidebar-logout" onClick={handleLogout} title={collapsed ? 'Logout' : ''}>
        <span className="sidebar-item-icon">🚪</span>
        {!collapsed && <span className="sidebar-item-label">Logout</span>}
      </button>
    </div>
  );
};

export default Sidebar;
