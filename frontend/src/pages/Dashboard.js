import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, ListGroup, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [applicationStats, setApplicationStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const dashboardResponse = await apiService.getDashboardStats();
      setStats(dashboardResponse.data);

      const appStatsResponse = await apiService.getApplicationStats();
      setApplicationStats(appStatsResponse.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="loading-spinner">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading your dashboard...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="alert-animated">{error}</Alert>
      </Container>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const totalApplications = applicationStats.reduce((sum, stat) => sum + stat.count, 0);
  const acceptedCount = applicationStats.find(s => s.status === 'accepted')?.count || 0;
  const profileCompletion = (user?.phone ? 75 : 60);

  return (
    <Container fluid className="dashboard-container py-4">
      {/* Animated Background */}
      <div className="dashboard-bg"></div>

      {/* Header Section */}
      <div className="header-section mb-5 position-relative z-1">
        <Row className="align-items-center">
          <Col md={8}>
            <h1 className="fw-bold text-dark mb-2 dashboard-title">🎓 Student Dashboard</h1>
            <p className="text-muted fs-5 dashboard-subtitle">
              Welcome back, <strong>{user?.fullName}</strong>! Your internship journey starts here. ✨
            </p>
          </Col>
          <Col md={4} className="text-end">
            <Badge bg="success" className="badge-large">Active Member</Badge>
          </Col>
        </Row>
      </div>

      {/* Main Stats Cards */}
      <Row className="mb-5 g-3 stats-row">
        {/* Total Internships Card */}
        <Col md={6} lg={4}>
          <Card 
            className="stat-card h-100 shadow-sm border-0 interactive-card"
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              transform: hoveredCard === 0 ? 'translateY(-10px) scale(1.03)' : 'translateY(0) scale(1)',
              transition: 'all 0.3s ease'
            }}
          >
            <Card.Body className="text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <div className="stat-icon">💼</div>
              <h3 className="stat-label">Total Internships Available</h3>
              <p className="stat-number">{stats?.totalInternships || 0}</p>
              <small className="stat-sub">Opportunities to explore</small>
            </Card.Body>
          </Card>
        </Col>

        {/* Applied Count Card */}
        <Col md={6} lg={4}>
          <Card 
            className="stat-card h-100 shadow-sm border-0 interactive-card"
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              transform: hoveredCard === 1 ? 'translateY(-10px) scale(1.03)' : 'translateY(0) scale(1)',
              transition: 'all 0.3s ease'
            }}
          >
            <Card.Body className="text-white" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <div className="stat-icon">📝</div>
              <h3 className="stat-label">Applied Count</h3>
              <p className="stat-number">{totalApplications}</p>
              <small className="stat-sub">Active applications</small>
            </Card.Body>
          </Card>
        </Col>

        {/* Accepted Count Card */}
        <Col md={6} lg={4}>
          <Card 
            className="stat-card h-100 shadow-sm border-0 interactive-card"
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              transform: hoveredCard === 2 ? 'translateY(-10px) scale(1.03)' : 'translateY(0) scale(1)',
              transition: 'all 0.3s ease'
            }}
          >
            <Card.Body className="text-white" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <div className="stat-icon">✅</div>
              <h3 className="stat-label">Accepted</h3>
              <p className="stat-number">{acceptedCount}</p>
              <small className="stat-sub">Successful placements</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 main-content-row">
        {/* Profile Information Card */}
        <Col lg={5}>
          <Card className="profile-card shadow-sm border-0 h-100">
            <Card.Header className="bg-primary text-white border-0 card-header-custom">
              <h5 className="mb-0 fw-bold">👤 Profile Information</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="border-0 ps-0 pe-0 pb-3 list-item-custom">
                  <small className="text-muted d-block mb-1">Full Name</small>
                  <p className="mb-0 fw-bold">{user?.fullName}</p>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 ps-0 pe-0 pb-3 list-item-custom">
                  <small className="text-muted d-block mb-1">Email Address</small>
                  <p className="mb-0 fw-bold text-break">{user?.email}</p>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 ps-0 pe-0 pb-3 list-item-custom">
                  <small className="text-muted d-block mb-1">Phone Number</small>
                  <p className="mb-0 fw-bold">{user?.phone || 'Not provided'}</p>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 ps-0 pe-0 pb-3 list-item-custom">
                  <small className="text-muted d-block mb-1">Account Role</small>
                  <Badge bg="info" className="fs-6">🎓 Student</Badge>
                </ListGroup.Item>
                
                {/* Profile Completion */}
                <ListGroup.Item className="border-0 ps-0 pe-0 pt-3">
                  <small className="text-muted d-block mb-2">Profile Completion</small>
                  <div className="progress-wrapper">
                    <ProgressBar now={profileCompletion} label={`${profileCompletion}%`} className="profile-progress" />
                  </div>
                </ListGroup.Item>

                <ListGroup.Item className="border-0 ps-0 pe-0 pt-3">
                  <Link to="/profile" className="text-decoration-none w-100">
                    <Button variant="outline-primary" size="sm" className="w-100 btn-custom">
                      ✏️ Edit Profile
                    </Button>
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Application Status Breakdown */}
        <Col lg={7}>
          <Card className="status-card shadow-sm border-0 h-100">
            <Card.Header className="bg-success text-white border-0 card-header-custom">
              <h5 className="mb-0 fw-bold">📊 Application Status Breakdown</h5>
            </Card.Header>
            <Card.Body>
              {applicationStats.length > 0 ? (
                <Row className="g-3">
                  {applicationStats.map((stat, idx) => (
                    <Col md={6} key={stat.status}>
                      <Card 
                        className="status-breakdown-card border-0 bg-light text-center"
                        onMouseEnter={() => setHoveredCard(10 + idx)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{
                          transform: hoveredCard === 10 + idx ? 'scale(1.05)' : 'scale(1)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Card.Body>
                          <Badge bg={getStatusColor(stat.status)} className="mb-2 badge-status">
                            {stat.status.charAt(0).toUpperCase() + stat.status.slice(1)}
                          </Badge>
                          <p className="h3 fw-bold mb-0 status-count">{stat.count}</p>
                          <small className="text-muted breakdown-text">
                            {stat.status === 'pending' ? '⏳ Waiting for response' : stat.status === 'accepted' ? '🎉 Offers received' : '❌ Not selected'}
                          </small>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="empty-state">
                  <p className="text-muted text-center mb-3">No applications yet. Start exploring internships!</p>
                  <div className="text-center">
                    <Link to="/internships" className="text-decoration-none">
                      <Button variant="primary" className="btn-no-app">Start Applying 🚀</Button>
                    </Link>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mt-5 quick-actions-row">
        <Col lg={12}>
          <Card className="quick-actions-card shadow-sm border-0 bg-light">
            <Card.Body>
              <h5 className="fw-bold mb-4">⚡ Quick Actions</h5>
              <div className="d-flex flex-wrap gap-3 actions-container">
                <Link to="/internships" className="text-decoration-none flex-grow-1">
                  <Button variant="primary" className="w-100 action-btn">
                    🔍 Browse Internships
                  </Button>
                </Link>
                <Link to="/MyApplications" className="text-decoration-none flex-grow-1">
                  <Button variant="info" className="w-100 action-btn">
                    📋 View Applications
                  </Button>
                </Link>
                <Link to="/reports" className="text-decoration-none flex-grow-1">
                  <Button variant="warning" className="w-100 action-btn">
                    📝 View Reports
                  </Button>
                </Link>
                <Link to="/profile" className="text-decoration-none flex-grow-1">
                  <Button variant="secondary" className="w-100 action-btn">
                    ⚙️ Profile Settings
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
