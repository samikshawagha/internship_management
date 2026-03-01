import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
    <Navbar bg="dark" expand="lg" sticky="top" className="navbar-custom shadow-sm" expanded={expanded}>
      <Container>
        <Navbar.Brand 
          href="/" 
          className="fw-bold fs-5 brand-text"
          onClick={() => {
            setExpanded(false);
            navigate('/');
          }}
        >
          📚 InternHub
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setExpanded(expanded ? false : true)}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* Public Navigation */}
            <Nav.Link 
              href="/" 
              className="nav-link-custom"
              onClick={() => {
                setExpanded(false);
                navigate('/');
              }}
            >
              Home
            </Nav.Link>

            {user ? (
              <>
                {/* Authenticated Navigation */}
                <Nav.Link 
                  href="/internships"
                  className="nav-link-custom"
                  onClick={() => {
                    setExpanded(false);
                    navigate('/internships');
                  }}
                >
                  Internships
                </Nav.Link>

                {user.role === 'student' && (
                  <>
                    <Nav.Link 
                      href="/my-applications"
                      className="nav-link-custom"
                      onClick={() => {
                        setExpanded(false);
                        navigate('/my-applications');
                      }}
                    >
                      Applications
                    </Nav.Link>
                    <Nav.Link 
                      href="/attendance"
                      className="nav-link-custom"
                      onClick={() => {
                        setExpanded(false);
                        navigate('/attendance');
                      }}
                    >
                      Attendance
                    </Nav.Link>
                    <Nav.Link 
                      href="/my-performance"
                      className="nav-link-custom"
                      onClick={() => {
                        setExpanded(false);
                        navigate('/my-performance');
                      }}
                    >
                      Performance
                    </Nav.Link>
                  </>
                )}

                {(user.role === 'company' || user.role === 'admin') && (
                  <>
                    <Nav.Link 
                      href="/reports"
                      className="nav-link-custom"
                      onClick={() => {
                        setExpanded(false);
                        navigate('/reports');
                      }}
                    >
                      Reports
                    </Nav.Link>
                    {user.role === 'company' && (
                      <>
                        <Nav.Link 
                          href="/company-attendance"
                          className="nav-link-custom"
                          onClick={() => {
                            setExpanded(false);
                            navigate('/company-attendance');
                          }}
                        >
                          Attendance
                        </Nav.Link>
                        <Nav.Link 
                          href="/company-performance"
                          className="nav-link-custom"
                          onClick={() => {
                            setExpanded(false);
                            navigate('/company-performance');
                          }}
                        >
                          Performance
                        </Nav.Link>
                      </>
                    )}
                  </>
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
                <Nav.Link 
                  href="/internships"
                  className="nav-link-custom"
                  onClick={() => {
                    setExpanded(false);
                    navigate('/internships');
                  }}
                >
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
