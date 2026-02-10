import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
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

  return (
    <BootstrapNavbar bg="dark" expand="lg" sticky="top" className="navbar-dark mb-4">
      <Container>
        <BootstrapNavbar.Brand href="/" className="fw-bold">
          📋 Internship Management
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <BootstrapNavbar.Collapse id="basic-navbar-nav" in={expanded}>
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <span className="nav-link text-light me-3">Welcome, {user.fullName}</span>
                <Nav.Link href="/dashboard" onClick={() => setExpanded(false)}>Dashboard</Nav.Link>
                {user.role === 'company' && (
                  <Nav.Link href="/internships/create" onClick={() => setExpanded(false)}>Post Internship</Nav.Link>
                )}
                {user.role === 'student' && (
                  <Nav.Link href="/internships" onClick={() => setExpanded(false)}>Browse Internships</Nav.Link>
                )}
                <Nav.Link href="/profile" onClick={() => setExpanded(false)}>Profile</Nav.Link>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={handleLogout}
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link href="/login" onClick={() => setExpanded(false)}>Login</Nav.Link>
                <Nav.Link href="/register" onClick={() => setExpanded(false)}>Register</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
