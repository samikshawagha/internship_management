import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { crudService } from '../services/crudService';
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert } from 'react-bootstrap';

const AdminDashboard = () => {
  const navigate = useNavigate();
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
      const statsResponse = await crudService.getStatistics();
      const allUsers = await crudService.getAllUsers();
      const allReports = await crudService.getAllReports();
      
      const enhancedStats = {
        ...statsResponse.data,
        totalUsers: allUsers.data.length,
        totalReports: allReports.data.length
      };
      
      setStats(enhancedStats);
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
      totalUsers: 'card-gradient-teal',
      totalReports: 'card-gradient-orange',
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
            
            const getNavigationPath = () => {
              switch(key) {
                case 'totalInternships':
                  return '/admin/internships';
                case 'totalApplications':
                  return '/admin/applications';
                case 'totalUsers':
                  return '/admin/users';
                case 'totalReports':
                  return '/admin/reports';
                default:
                  return '#';
              }
            };
            
            const getIcon = () => {
              switch (key) {
                case 'totalInternships':
                  return '💼';
                case 'totalApplications':
                  return '📋';
                case 'totalUsers':
                  return '👥';
                case 'totalReports':
                  return '📊';
                case 'acceptedApplications':
                  return '✅';
                case 'pendingApplications':
                  return '⏳';
                case 'rejectedApplications':
                  return '❌';
                default:
                  return '📈';
              }
            };

            const isClickable = ['totalInternships', 'totalApplications', 'totalUsers', 'totalReports'].includes(key);

            return (
              <Col key={key} sm={6} lg={4} xl={5/3}>
                <Card 
                  className={`h-100 border-0 transition-card ${getGradientClass(key)} ${isClickable ? 'cursor-pointer' : ''}`}
                  style={{ 
                    cursor: isClickable ? 'pointer' : 'default',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (isClickable) {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => {
                    if (isClickable) {
                      const path = getNavigationPath();
                      if (path !== '#') {
                        navigate(path);
                      }
                    }
                  }}
                >
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
        <Col lg={3} md={6}>
          <Card 
            className="border-0 h-100" 
            style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            onClick={() => navigate('/admin/users')}
          >
            <Card.Header className="bg-info text-white border-bottom">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <span>👥</span> Manage Users
              </h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-3">Manage all students, companies, and admin accounts.</p>
              <div className="text-center">
                <Badge bg="info" className="badge-large">Manage →</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card 
            className="border-0 h-100" 
            style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            onClick={() => navigate('/admin/internships')}
          >
            <Card.Header className="bg-primary text-white border-bottom">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <span>💼</span> Manage Internships
              </h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-3">Create, view, edit, and delete internship postings.</p>
              <div className="text-center">
                <Badge bg="primary" className="badge-large">Manage →</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card 
            className="border-0 h-100" 
            style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            onClick={() => navigate('/admin/applications')}
          >
            <Card.Header className="bg-success text-white border-bottom">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <span>📋</span> Manage Applications
              </h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-3">Review and manage all internship applications.</p>
              <div className="text-center">
                <Badge bg="success" className="badge-large">Manage →</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card 
            className="border-0 h-100" 
            style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            onClick={() => navigate('/admin/reports')}
          >
            <Card.Header className="bg-warning text-white border-bottom">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <span>📊</span> Manage Reports
              </h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-3">View and manage system reports and analytics.</p>
              <div className="text-center">
                <Badge bg="warning" className="badge-large">Manage →</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
