import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { crudService } from '../services/crudService';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, ListGroup, ProgressBar, Modal, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await crudService.getDashboardData(user?.id, 'student');
      setDashboardData(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawApplication = async () => {
    if (!selectedApp) return;
    
    try {
      await crudService.deleteApplication(selectedApp.id);
      setSuccess('Application withdrawn successfully!');
      setShowWithdrawModal(false);
      loadDashboardData();
    } catch (err) {
      setError('Failed to withdraw application');
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

  if (error && !dashboardData) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="alert-animated">{error}</Alert>
      </Container>
    );
  }

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      accepted: 'success',
      rejected: 'danger'
    };
    return variants[status] || 'secondary';
  };

  const stats = dashboardData?.stats || {};
  const applications = dashboardData?.applications || [];

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

      {/* Alerts */}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Main Stats Cards */}
      <Row className="mb-5 g-3 stats-row">
        {/* Total Applications Card */}
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
              <div className="stat-icon">📝</div>
              <h3 className="stat-label">Total Applications</h3>
              <p className="stat-number">{stats.totalApplications || 0}</p>
              <small className="stat-sub">All your applications</small>
            </Card.Body>
          </Card>
        </Col>

        {/* Pending Applications Card */}
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
              <div className="stat-icon">⏳</div>
              <h3 className="stat-label">Pending</h3>
              <p className="stat-number">{stats.pending || 0}</p>
              <small className="stat-sub">Awaiting response</small>
            </Card.Body>
          </Card>
        </Col>

        {/* Accepted Applications Card */}
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
              <p className="stat-number">{stats.accepted || 0}</p>
              <small className="stat-sub">Offers received</small>
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
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="w-100 btn-custom"
                    onClick={() => navigate('/profile')}
                  >
                    ✏️ Edit Profile
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Applications */}
        <Col lg={7}>
          <Card className="status-card shadow-sm border-0 h-100">
            <Card.Header className="bg-success text-white border-0 card-header-custom">
              <h5 className="mb-0 fw-bold">📊 Recent Applications</h5>
            </Card.Header>
            <Card.Body>
              {applications && applications.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover size="sm" className="applications-table">
                    <thead>
                      <tr>
                        <th>Position</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Applied</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.slice(0, 5).map(app => (
                        <tr key={app.id}>
                          <td className="fw-bold text-truncate">{app.internshipTitle}</td>
                          <td>{app.company}</td>
                          <td>
                            <Badge bg={getStatusBadge(app.status)}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                          </td>
                          <td><small className="text-muted">{app.appliedDate}</small></td>
                          <td>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => {
                                setSelectedApp(app);
                                setShowWithdrawModal(true);
                              }}
                            >
                              Withdraw
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {applications.length > 5 && (
                    <Button 
                      variant="link" 
                      className="w-100 mt-2"
                      onClick={() => navigate('/my-applications')}
                    >
                      View All Applications →
                    </Button>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <p className="text-muted text-center mb-3">No applications yet. Start exploring internships!</p>
                  <div className="text-center">
                    <Button 
                      variant="primary"
                      onClick={() => navigate('/internships')}
                    >
                      Start Applying 🚀
                    </Button>
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
                <Button 
                  variant="primary" 
                  className="flex-grow-1 action-btn"
                  onClick={() => navigate('/internships')}
                >
                  🔍 Browse Internships
                </Button>
                <Button 
                  variant="info" 
                  className="flex-grow-1 action-btn"
                  onClick={() => navigate('/my-applications')}
                >
                  📋 View Applications
                </Button>
                <Button 
                  variant="warning" 
                  className="flex-grow-1 action-btn"
                  onClick={() => navigate('/reports')}
                >
                  📝 View Reports
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-grow-1 action-btn"
                  onClick={() => navigate('/profile')}
                >
                  ⚙️ Profile Settings
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Withdraw Application Modal */}
      <Modal show={showWithdrawModal} onHide={() => setShowWithdrawModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Withdraw Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to withdraw your application for <strong>{selectedApp?.internshipTitle}</strong> at {selectedApp?.company}?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWithdrawModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleWithdrawApplication}>
            Withdraw Application
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;
