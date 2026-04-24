import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'company': return '/company-dashboard';
      case 'admin': return '/admin-dashboard';
      default: return '/dashboard';
    }
  };

  const getRoleBadgeVariant = () => {
    switch (user?.role) {
      case 'company': return 'success';
      case 'admin': return 'danger';
      default: return 'info';
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'company': return '🏢';
      case 'admin': return '⚙️';
      default: return '👨‍🎓';
    }
  };

  return (
    <BootstrapNavbar bg="dark" expand="lg" sticky="top" className="navbar-dark mb-0 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
      <Container fluid className="px-4">
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center gap-2" style={{ fontSize: '1.4rem' }}>
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
                  <span>Welcome, <strong>{user.fullName?.split(' ')[0]}</strong></span>
                </div>
                <Badge bg={getRoleBadgeVariant()} style={{ fontSize: '0.75rem' }}>
                  {user.role === 'student' ? '👨‍🎓 Student' : user.role === 'company' ? '🏢 Company' : '⚙️ Admin'}
                </Badge>
                <Nav.Link as={Link} to={getDashboardLink()} onClick={() => setExpanded(false)} className="fw-500">
                  Dashboard
                </Nav.Link>
                {user.role === 'company' && (
                  <Nav.Link as={Link} to="/internships/create" onClick={() => setExpanded(false)} className="fw-500">
                    ➕ Post Internship
                  </Nav.Link>
                )}
                {user.role === 'student' && (
                  <Nav.Link as={Link} to="/internships" onClick={() => setExpanded(false)} className="fw-500">
                    🔍 Browse
                  </Nav.Link>
                )}
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" onClick={() => setExpanded(false)} className="fw-500">Sign In</Nav.Link>
                <Nav.Link as={Link} to="/register" onClick={() => setExpanded(false)} className="fw-500">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
