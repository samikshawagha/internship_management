import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div>
        <a href="/">Internship Management System</a>
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '20px' }}>Welcome, {user.fullName}</span>
            <a href="/dashboard">Dashboard</a>
            {user.role === 'company' && <a href="/internships/create">Post Internship</a>}
            {user.role === 'student' && <a href="/internships">Browse</a>}
            <a href="/profile">Profile</a>
            <button className="button" onClick={handleLogout} style={{ marginLeft: '20px' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
