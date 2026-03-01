import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Badge, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/header.css';

const Header = () => {
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
        return '/company-dashboard';
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
    <Navbar bg="dark" expand="lg" sticky="top" className="navbar-custom shadow-sm" expanded={expanded}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-5 brand-text" onClick={() => setExpanded(false)}>
          📚 InternHub
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setExpanded(expanded ? false : true)}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* Public Navigation */}
            <Nav.Link as={Link} to="/" className="nav-link-custom" onClick={() => setExpanded(false)}>
              Home
            </Nav.Link>

            {user ? (
              <>
                {/* Authenticated Navigation */}
                <Nav.Link as={Link} to="/internships" className="nav-link-custom" onClick={() => setExpanded(false)}>
                  Internships
                </Nav.Link>

                {user.role === 'student' && (
                  <Nav.Link as={Link} to="/my-applications" className="nav-link-custom" onClick={() => setExpanded(false)}>
                    Applications
                  </Nav.Link>
                )}

                {(user.role === 'company' || user.role === 'admin') && (
                  <Nav.Link as={Link} to="/reports" className="nav-link-custom" onClick={() => setExpanded(false)}>
                    Reports
                  </Nav.Link>
                )}

                {/* User Dropdown */}
                <Dropdown className="ms-3">
                  <Dropdown.Toggle 
                    variant="light" 
                    id="dropdown-basic"
                    className="d-flex align-items-center user-dropdown"
                  >
                    <span className="me-2">{getRoleIcon()}</span>
                    <Badge bg={getRoleBadgeVariant()} className="text-white">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </Dropdown.Toggle>

                  <Dropdown.Menu align="end" className="dropdown-menu-custom">
                    <Dropdown.Header>
                      <div className="fw-bold">{user.fullName || user.email}</div>
                      <small className="text-muted">{user.email}</small>
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item 
                      onClick={() => {
                        setExpanded(false);
                        navigate('/profile');
                      }}
                    >
                      👤 Profile
                    </Dropdown.Item>
                    <Dropdown.Item 
                      onClick={() => {
                        setExpanded(false);
                        navigate(getDashboardLink());
                      }}
                    >
                      📊 Dashboard
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      🚪 Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                {/* Public User Navigation */}
                <Nav.Link as={Link} to="/internships" className="nav-link-custom" onClick={() => setExpanded(false)}>
                  Internships
                </Nav.Link>

                <Button 
                  variant="outline-light" 
                  size="sm"
                  className="ms-2"
                  onClick={() => {
                    setExpanded(false);
                    navigate('/login');
                  }}
                >
                  Login
                </Button>
                <Button 
                  variant="light" 
                  size="sm"
                  className="ms-2"
                  onClick={() => {
                    setExpanded(false);
                    navigate('/register');
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
