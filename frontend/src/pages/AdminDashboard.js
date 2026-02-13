import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert } from 'react-bootstrap';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const dashboardResponse = await apiService.getDashboardStats();
      setStats(dashboardResponse.data);
    } catch (error) {
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
          <p className="mt-3 text-muted">Loading system dashboard...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
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

  const getGradientClass = (key) => {
    const gradients = {
      totalInternships: 'card-gradient-blue',
      totalApplications: 'card-gradient-purple',
      acceptedApplications: 'card-gradient-green',
      pendingApplications: 'card-gradient-cyan',
      rejectedApplications: 'card-gradient-danger',
    };
    return gradients[key] || 'card-gradient-blue';
  };

  return (
    <Container fluid className="py-5">
      {/* Header Section */}
      <div className="mb-5">
        <Row className="align-items-center">
          <Col md={8}>
            <h1 className="fw-bold mb-2" style={{ fontSize: '2.5rem', color: '#1a1a2e' }}>
              ⚙️ Admin Dashboard
            </h1>
            <p className="text-muted fs-5 mb-0">
              System Overview & Management • Welcome, <strong>{user?.fullName}</strong>
            </p>
          </Col>
          <Col md={4} className="text-end d-none d-md-block">
            <Badge bg="danger" className="badge-large">
              🔐 Administrator
            </Badge>
          </Col>
        </Row>
      </div>

      {/* Stats Cards */}
      {stats && (
        <Row className="mb-5 g-4">
          {Object.entries(stats).map(([key, value]) => {
            const label = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase())
              .trim();
            const getIcon = () => {
              switch (key) {
                case 'totalInternships':
                  return '💼';
                case 'totalApplications':
                  return '📋';
                case 'acceptedApplications':
                  return '✅';
                case 'pendingApplications':
                  return '⏳';
                case 'rejectedApplications':
                  return '❌';
                default:
                  return '📊';
              }
            };

            return (
              <Col key={key} sm={6} lg={4} xl={5/3}>
                <Card className={`h-100 border-0 transition-card ${getGradientClass(key)}`}>
                  <Card.Body className="text-center text-white">
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                      {getIcon()}
                    </div>
                    <h6 className="text-white-50 text-uppercase mb-3" style={{ letterSpacing: '0.5px' }}>
                      {label}
                    </h6>
                    <p className="h2 fw-bold m-0" style={{ fontSize: '2.5rem' }}>
                      {value}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Info Section */}
      <Row className="g-4">
        <Col lg={12}>
          <Card className="border-0">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <span>👤</span> Administrator Information
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <p className="mb-2">
                    <strong className="text-primary">Admin Name:</strong>
                  </p>
                  <p className="text-muted">{user?.fullName}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <p className="mb-2">
                    <strong className="text-primary">Email Address:</strong>
                  </p>
                  <p className="text-muted">{user?.email}</p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={12}>
                  <div className="alert alert-info mb-0">
                    <strong>🔐 Full System Access</strong>
                    <p className="mb-0 mt-2">
                      You have complete administrative control for monitoring, managing, and overseeing all internship programs, user accounts, applications, and system activities.
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Management Sections */}
      <Row className="mt-5 g-4">
        <Col md={6}>
          <Card className="border-0 h-100">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <span>📊</span> Key Metrics
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <span className="fw-500">Total Active Internships</span>
                <Badge bg="primary" className="badge-large">{stats?.totalInternships || 0}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <span className="fw-500">Total Applications Received</span>
                <Badge bg="info" className="badge-large">{stats?.totalApplications || 0}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center py-3">
                <span className="fw-500">Acceptance Rate</span>
                <Badge bg="success" className="badge-large">
                  {stats?.totalApplications ? Math.round((stats?.acceptedApplications || 0) / stats?.totalApplications * 100) : 0}%
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 h-100">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <span>⚡</span> Quick Stats
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <span className="fw-500">Pending Applications</span>
                <Badge bg="warning" className="badge-large text-dark">{stats?.pendingApplications || 0}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <span className="fw-500">Rejected Applications</span>
                <Badge bg="danger" className="badge-large">{stats?.rejectedApplications || 0}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center py-3">
                <span className="fw-500">Accepted Applications</span>
                <Badge bg="success" className="badge-large">{stats?.acceptedApplications || 0}</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
