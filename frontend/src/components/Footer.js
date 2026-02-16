import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

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
              <a href="#" className="text-light me-2" title="Facebook">f</a>
              <a href="#" className="text-light me-2" title="Twitter">𝕏</a>
              <a href="#" className="text-light me-2" title="LinkedIn">in</a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={3} className="mb-4">
            <h6 className="mb-3 font-weight-bold">Quick Links</h6>
            <ListGroup variant="flush" className="link-group">
              <ListGroup.Item 
                className="link-item"
                onClick={() => navigate('/')}
              >
                Home
              </ListGroup.Item>
              <ListGroup.Item 
                className="link-item"
                onClick={() => navigate('/internships')}
              >
                Internships
              </ListGroup.Item>
              <ListGroup.Item 
                className="link-item"
                onClick={() => navigate('/login')}
              >
                Login
              </ListGroup.Item>
              <ListGroup.Item 
                className="link-item"
                onClick={() => navigate('/register')}
              >
                Register
              </ListGroup.Item>
            </ListGroup>
          </Col>

          {/* For Students */}
          <Col md={3} className="mb-4">
            <h6 className="mb-3 font-weight-bold">For Students</h6>
            <ListGroup variant="flush" className="link-group">
              <ListGroup.Item className="link-item">
                Browse Internships
              </ListGroup.Item>
              <ListGroup.Item className="link-item">
                Track Applications
              </ListGroup.Item>
              <ListGroup.Item className="link-item">
                Career Resources
              </ListGroup.Item>
              <ListGroup.Item className="link-item">
                Resume Tips
              </ListGroup.Item>
            </ListGroup>
          </Col>

          {/* For Companies */}
          <Col md={3} className="mb-4">
            <h6 className="mb-3 font-weight-bold">For Companies</h6>
            <ListGroup variant="flush" className="link-group">
              <ListGroup.Item className="link-item">
                Post Internship
              </ListGroup.Item>
              <ListGroup.Item className="link-item">
                Find Talent
              </ListGroup.Item>
              <ListGroup.Item className="link-item">
                Company Dashboard
              </ListGroup.Item>
              <ListGroup.Item className="link-item">
                Analytics
              </ListGroup.Item>
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
              <a href="#" className="text-muted me-3">Privacy Policy</a>
              <a href="#" className="text-muted">Terms of Service</a>
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
