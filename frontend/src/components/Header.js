import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/header.css';

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const close = () => setExpanded(false);

  return (
    <Navbar bg="dark" expand="lg" sticky="top" className="navbar-custom shadow-sm" expanded={expanded}>
      <Container>
        <Navbar.Brand
          className="fw-bold fs-5 brand-text"
          style={{ cursor: 'pointer' }}
          onClick={() => { close(); navigate('/'); }}
        >
          📚 InternHub
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="main-navbar"
          onClick={() => setExpanded(e => !e)}
        />

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center gap-2">
            {user ? null : (
              /* ── Guest: show public links + Sign In / Sign Up ── */
              <>
                <Nav.Link
                  className="nav-link-custom"
                  onClick={() => { close(); navigate('/'); }}
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  className="nav-link-custom"
                  onClick={() => { close(); navigate('/internships'); }}
                >
                  Internships
                </Nav.Link>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={() => { close(); navigate('/login'); }}
                >
                  Sign In
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => { close(); navigate('/register'); }}
                >
                  Sign Up
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
