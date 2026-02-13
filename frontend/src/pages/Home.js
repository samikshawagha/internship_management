import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import '../styles/home.css';

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Track scroll for subtle parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Redirect authenticated users to dashboard
  if (!loading && user) {
    navigate('/dashboard');
    return null;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Container fluid className="home-container py-5">
      {/* Animated Background */}
      <div className="animated-bg"></div>
      {/* Hero Section */}
      <Row className="align-items-center my-5 hero-section">
        <Col lg={6} className="mb-4 hero-text" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <div className="hero-content">
            <h1 className="display-4 fw-bold mb-4 animate-fade-in" style={{ color: '#1a1a2e' }}>
              🎯 Internship Management Platform
            </h1>
            <p className="lead mb-4 animate-fade-in" style={{ color: '#555', fontSize: '1.2rem' }}>
              Connect students with exciting internship opportunities and manage applications efficiently. 
              Whether you're a student seeking growth or a company looking for talent, this platform makes it simple.
            </p>
            <div className="d-flex gap-3 cta-buttons">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/login')}
                className="px-5 btn-interactive"
              >
                Sign In
              </Button>
              <Button 
                variant="outline-primary" 
                size="lg"
                onClick={() => navigate('/register')}
                className="px-5 btn-interactive"
              >
                Register
              </Button>
            </div>
          </div>
        </Col>
        <Col lg={6} className="text-center hero-icon">
          <div className="floating-emoji" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
            📊
          </div>
        </Col>
      </Row>

      {/* Stats Section */}
      <Row className="my-5 py-4 stats-section">
        <Col md={3} className="text-center stat-item">
          <div className="stat-number">10K+</div>
          <div className="stat-label">Students</div>
        </Col>
        <Col md={3} className="text-center stat-item">
          <div className="stat-number">500+</div>
          <div className="stat-label">Companies</div>
        </Col>
        <Col md={3} className="text-center stat-item">
          <div className="stat-number">2K+</div>
          <div className="stat-label">Internships</div>
        </Col>
        <Col md={3} className="text-center stat-item">
          <div className="stat-number">95%</div>
          <div className="stat-label">Success Rate</div>
        </Col>
      </Row>

      {/* Features Section */}
      <Row className="my-5 py-5 features-section">
        <h2 className="text-center mb-5 fw-bold section-title" style={{ color: '#1a1a2e' }}>
          ✨ Why Choose Us?
        </h2>

        <Col md={4} className="mb-4">
          <Card 
            className="h-100 border-0 feature-card interactive-card"
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              transform: hoveredCard === 0 ? 'translateY(-15px) scale(1.05)' : 'translateY(0) scale(1)',
              boxShadow: hoveredCard === 0 
                ? '0 20px 40px rgba(26, 26, 46, 0.2)' 
                : '0 5px 15px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            <Card.Body className="text-center">
              <div className="feature-icon">👨‍🎓</div>
              <h3 className="mb-3">For Students</h3>
              <ul className="text-start feature-list" style={{ fontSize: '0.95rem' }}>
                <li>✓ Browse curated internship opportunities</li>
                <li>✓ Easy application process</li>
                <li>✓ Track application status in real-time</li>
                <li>✓ Build your professional profile</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card 
            className="h-100 border-0 feature-card interactive-card"
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              transform: hoveredCard === 1 ? 'translateY(-15px) scale(1.05)' : 'translateY(0) scale(1)',
              boxShadow: hoveredCard === 1 
                ? '0 20px 40px rgba(26, 26, 46, 0.2)' 
                : '0 5px 15px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            <Card.Body className="text-center">
              <div className="feature-icon">🏢</div>
              <h3 className="mb-3">For Companies</h3>
              <ul className="text-start feature-list" style={{ fontSize: '0.95rem' }}>
                <li>✓ Post internship positions easily</li>
                <li>✓ Review qualified candidates</li>
                <li>✓ Manage applications efficiently</li>
                <li>✓ Track hiring progress</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card 
            className="h-100 border-0 feature-card interactive-card"
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              transform: hoveredCard === 2 ? 'translateY(-15px) scale(1.05)' : 'translateY(0) scale(1)',
              boxShadow: hoveredCard === 2 
                ? '0 20px 40px rgba(26, 26, 46, 0.2)' 
                : '0 5px 15px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            <Card.Body className="text-center">
              <div className="feature-icon">📈</div>
              <h3 className="mb-3">Analytics</h3>
              <ul className="text-start feature-list" style={{ fontSize: '0.95rem' }}>
                <li>✓ Detailed application insights</li>
                <li>✓ Performance metrics</li>
                <li>✓ Hiring trends and statistics</li>
                <li>✓ Comprehensive reports</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CTA Section */}
      <Row className="my-5 py-5 cta-section rounded-4">
        <Col className="text-center cta-content">
          <h3 className="mb-4 fw-bold section-title" style={{ color: '#1a1a2e' }}>
            🚀 Ready to Get Started?
          </h3>
          <p className="mb-4" style={{ fontSize: '1.1rem', color: '#555' }}>
            Join thousands of students and companies already using our platform
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/register')}
              className="px-5 btn-interactive btn-primary-glow"
            >
              Create Account
            </Button>
            <Button 
              variant="outline-primary" 
              size="lg"
              onClick={() => navigate('/login')}
              className="px-5 btn-interactive"
            >
              Already a Member?
            </Button>
          </div>
        </Col>
      </Row>

      {/* Footer Info Section */}
      <Row className="my-5 py-4 border-top footer-info">
        <Col md={3} className="mb-3 info-item">
          <div className="info-icon">🔒</div>
          <h5 className="fw-bold mb-2">Secure</h5>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Your data is protected with industry-standard security measures
          </p>
        </Col>
        <Col md={3} className="mb-3 info-item">
          <div className="info-icon">⚡</div>
          <h5 className="fw-bold mb-2">Fast</h5>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Quick and seamless experience across all devices
          </p>
        </Col>
        <Col md={3} className="mb-3 info-item">
          <div className="info-icon">🎯</div>
          <h5 className="fw-bold mb-2">Simple</h5>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Intuitive interface designed for ease of use
          </p>
        </Col>
        <Col md={3} className="mb-3 info-item">
          <div className="info-icon">📞</div>
          <h5 className="fw-bold mb-2">Support</h5>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Dedicated support team ready to help anytime
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
