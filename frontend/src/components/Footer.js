import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="footer-custom bg-dark text-light mt-5 pt-5">
      <Container>
        <Row className="mb-5">
          {/* About Section */}
          <Col md={3} className="mb-4">
            <h5 className="mb-3 fw-bold">📚 InternHub</h5>
            <p className="small text-muted">
              Your gateway to connecting talented students with leading companies. 
              Manage internship opportunities with ease.
            </p>
            <div className="social-links mt-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light me-3" title="Facebook">
                🔵
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-light me-3" title="Twitter">
                𝕏
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-light me-3" title="LinkedIn">
                💼
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={3} className="mb-4">
            <h6 className="mb-3 fw-bold">Quick Links</h6>
            <ListGroup variant="flush" className="link-group">
              <ListGroup.Item 
                className="link-item"
                style={{ cursor: 'pointer' }}
                onClick={() => handleNavigate('/')}
              >
                🏠 Home
              </ListGroup.Item>
              <ListGroup.Item 
                className="link-item"
                style={{ cursor: 'pointer' }}
                onClick={() => handleNavigate('/internships')}
              >
                💼 Browse Internships
              </ListGroup.Item>
              {!user && (
                <>
                  <ListGroup.Item 
                    className="link-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNavigate('/login')}
                  >
                    🔐 Login
                  </ListGroup.Item>
                  <ListGroup.Item 
                    className="link-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNavigate('/register')}
                  >
                    📝 Register
                  </ListGroup.Item>
                </>
              )}
              {user && (
                <ListGroup.Item 
                  className="link-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleNavigate('/company-profile')}
                >
                  👤 My Profile
                </ListGroup.Item>
              )}
            </ListGroup>
          </Col>

          {/* For Students */}
          <Col md={3} className="mb-4">
            <h6 className="mb-3 fw-bold">For Students</h6>
            <ListGroup variant="flush" className="link-group">
              <ListGroup.Item 
                className="link-item"
                style={{ cursor: 'pointer' }}
                onClick={() => handleNavigate('/internships')}
              >
                🔍 Browse Internships
              </ListGroup.Item>
              {user?.role === 'student' && (
                <>
                  <ListGroup.Item 
                    className="link-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNavigate('/my-applications')}
                  >
                    📋 Track Applications
                  </ListGroup.Item>
                  <ListGroup.Item 
                    className="link-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNavigate('/dashboard')}
                  >
                    📊 Dashboard
                  </ListGroup.Item>
                </>
              )}
              <ListGroup.Item className="link-item">
                💡 Career Resources
              </ListGroup.Item>
              <ListGroup.Item className="link-item">
                📄 Resume Tips
              </ListGroup.Item>
            </ListGroup>
          </Col>

          {/* For Companies */}
          <Col md={3} className="mb-4">
            <h6 className="mb-3 fw-bold">For Companies</h6>
            <ListGroup variant="flush" className="link-group">
              {user?.role === 'company' && (
                <>
                  <ListGroup.Item 
                    className="link-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNavigate('/internships/create')}
                  >
                    ➕ Post Internship
                  </ListGroup.Item>
                  <ListGroup.Item 
                    className="link-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNavigate('/company-home')}
                  >
                    🏠 Company Home
                  </ListGroup.Item>
                  <ListGroup.Item 
                    className="link-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNavigate('/company-home')}
                  >
                    🏠 Home
                  </ListGroup.Item>
                  <ListGroup.Item 
                    className="link-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNavigate('/reports')}
                  >
                    📈 Reports
                  </ListGroup.Item>
                </>
              )}
              {!user?.role === 'company' && (
                <>
                  <ListGroup.Item className="link-item">
                    ➕ Post Internship
                  </ListGroup.Item>
                  <ListGroup.Item className="link-item">
                    👥 Find Talent
                  </ListGroup.Item>
                  <ListGroup.Item className="link-item">
                    📊 Dashboard
                  </ListGroup.Item>
                  <ListGroup.Item className="link-item">
                    📈 Analytics
                  </ListGroup.Item>
                </>
              )}
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
              <a href="#" className="text-muted me-3">🔒 Privacy Policy</a>
              <a href="#" className="text-muted">⚖️ Terms of Service</a>
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
