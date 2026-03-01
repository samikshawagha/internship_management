import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quick: [
      { label: 'Home', path: '/' },
      { label: 'Internships', path: '/internships' },
      { label: 'Login', path: '/login' },
      { label: 'Register', path: '/register' }
    ],
    students: [
      { label: 'Browse Internships', path: '/internships' },
      { label: 'My Applications', path: '/my-applications' },
      { label: 'Career Resources', path: '/' },
      { label: 'Resume Tips', path: '/' }
    ],
    companies: [
      { label: 'Post Internship', path: '/internships/create' },
      { label: 'Find Talent', path: '/admin/applications' },
      { label: 'Dashboard', path: '/company-dashboard' },
      { label: 'Analytics', path: '/admin-dashboard' }
    ]
  };

  return (
    <footer className="footer-custom bg-dark text-light mt-5 pt-5">
      <Container>
        <Row className="mb-5">
          {/* About Section */}
          <Col md={3} className="mb-4">
            <h5 className="mb-3">📚 InternHub</h5>
            <p className="small text-muted">
              Your gateway to connecting talented students with leading companies. 
              Manage internship opportunities with ease.
            </p>
            <div className="social-links mt-3">
              <a href="#facebook" className="text-light me-2" title="Facebook">📘</a>
              <a href="#twitter" className="text-light me-2" title="Twitter">𝕏</a>
              <a href="#linkedin" className="text-light me-2" title="LinkedIn">💼</a>
              <a href="#github" className="text-light" title="GitHub">🐙</a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={3} className="mb-4">
            <h6 className="mb-3 font-weight-bold">Quick Links</h6>
            <ListGroup variant="flush" className="link-group">
              {footerLinks.quick.map((link, idx) => (
                <ListGroup.Item 
                  key={idx}
                  className="link-item bg-transparent border-0 px-0 py-1"
                >
                  <Link to={link.path} className="text-light text-decoration-none hover-link">
                    {link.label}
                  </Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>

          {/* For Students */}
          <Col md={3} className="mb-4">
            <h6 className="mb-3 font-weight-bold">For Students</h6>
            <ListGroup variant="flush" className="link-group">
              {footerLinks.students.map((link, idx) => (
                <ListGroup.Item 
                  key={idx}
                  className="link-item bg-transparent border-0 px-0 py-1"
                >
                  <Link to={link.path} className="text-light text-decoration-none hover-link">
                    {link.label}
                  </Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>

          {/* For Companies */}
          <Col md={3} className="mb-4">
            <h6 className="mb-3 font-weight-bold">For Companies</h6>
            <ListGroup variant="flush" className="link-group">
              {footerLinks.companies.map((link, idx) => (
                <ListGroup.Item 
                  key={idx}
                  className="link-item bg-transparent border-0 px-0 py-1"
                >
                  <Link to={link.path} className="text-light text-decoration-none hover-link">
                    {link.label}
                  </Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>

        <Row className="border-top pt-4 pb-3">
          <Col md={6} className="text-start">
            <small className="text-muted">
              © {currentYear} InternHub. All rights reserved.
            </small>
          </Col>
          <Col md={6} className="text-end">
            <small className="text-muted">
              <Link to="/" className="text-muted me-3 text-decoration-none">Privacy Policy</Link>
              <Link to="/" className="text-muted text-decoration-none">Terms of Service</Link>
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
