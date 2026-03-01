import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setExpanded(false);
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'company':
        return '/company-home';
      case 'admin':
        return '/admin-dashboard';
      case 'student':
      default:
        return '/dashboard';
    }
  };

  const getRoleBadgeVariant = () => {
    switch (user?.role) {
      case 'company':
        return 'success';
      case 'admin':
        return 'danger';
      case 'student':
      default:
        return 'info';
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'company':
        return '🏢';
      case 'admin':
        return '⚙️';
      case 'student':
      default:
        return '👨‍🎓';
    }
  };

  return (
    <BootstrapNavbar bg="dark" expand="lg" sticky="top" className="navbar-dark mb-0 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
      <Container fluid className="px-4">
        <BootstrapNavbar.Brand href="/" className="fw-bold d-flex align-items-center gap-2" style={{ fontSize: '1.4rem' }}>
          <span style={{ fontSize: '1.8rem' }}>📋</span>
          <span style={{ color: '#fff' }}>InternHub</span>
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <BootstrapNavbar.Collapse id="basic-navbar-nav" in={expanded}>
          <Nav className="ms-auto align-items-center gap-3">
            {user ? (
              <>
                <div className="d-flex align-items-center gap-2 nav-link" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  <span>{getRoleIcon()}</span>
                  <span>
                    Welcome, <strong>{user.fullName.split(' ')[0]}</strong>
                  </span>
                </div>
                <Badge bg={getRoleBadgeVariant()} className="me-2" style={{ fontSize: '0.75rem' }}>
                  {user.role === 'student' ? '👨‍🎓 Student' : user.role === 'company' ? '🏢 Company' : '⚙️ Admin'}
                </Badge>
                <Nav.Link href={getDashboardLink()} onClick={() => setExpanded(false)} className="fw-500">
                  Dashboard
                </Nav.Link>
                {user.role === 'company' && (
                  <Nav.Link href="/internships/create" onClick={() => setExpanded(false)} className="fw-500">
                    ➕ Post Internship
                  </Nav.Link>
                )}
                {user.role === 'student' && (
                  <Nav.Link href="/internships" onClick={() => setExpanded(false)} className="fw-500">
                    🔍 Browse
                  </Nav.Link>
                )}
                {user.role === 'company' && (
                  <Nav.Link href="/company-profile" onClick={() => setExpanded(false)} className="fw-500">
                    👤 Profile
                  </Nav.Link>
                )}
                {user.role !== 'company' && (
                  <Nav.Link href="/profile" onClick={() => setExpanded(false)} className="fw-500">
                    👤 Profile
                  </Nav.Link>
                )}
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={handleLogout}
                  className="ms-2 fw-600"
                  style={{
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem'
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link href="/login" onClick={() => setExpanded(false)} className="fw-500">Login</Nav.Link>
                <Nav.Link href="/register" onClick={() => setExpanded(false)} className="fw-500">Register</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
