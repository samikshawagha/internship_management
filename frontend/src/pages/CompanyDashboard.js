import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
    fetchInternships();
  }, []);

  const fetchStats = async () => {
    try {
      const dashboardResponse = await apiService.getDashboardStats();
      setStats(dashboardResponse.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchInternships = async () => {
    try {
      const response = await apiService.getCompanyInternships();
      setInternships(response.data);
    } catch (error) {
      console.error('Error fetching internships:', error);
    }
  };

  const handleDeleteInternship = async (internshipId) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        await apiService.deleteInternship(internshipId);
        setInternships(internships.filter(i => i.id !== internshipId));
        alert('Internship deleted successfully!');
      } catch (error) {
        setError('Failed to delete internship');
      }
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="loading-spinner">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading company dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5">
      {/* Header Section */}
      <div className="mb-5">
        <Row className="align-items-center">
          <Col md={8}>
            <h1 className="fw-bold mb-2" style={{ fontSize: '2.5rem', color: '#1a1a2e' }}>
              🏢 Company Dashboard
            </h1>
            <p className="text-muted fs-5 mb-0">
              Manage your internship opportunities • Welcome, <strong>{user?.fullName}</strong>
            </p>
          </Col>
          <Col md={4} className="text-end d-none d-md-block">
            <Badge bg="success" className="badge-large">
              🏢 Company
            </Badge>
          </Col>
        </Row>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {/* Action Button */}
      <Row className="mb-5">
        <Col md={12}>
          <Link to="/internships/create" className="text-decoration-none">
            <Button 
              variant="success" 
              size="lg" 
              className="fw-bold px-4"
              style={{ borderRadius: '10px', padding: '0.75rem 2rem' }}
            >
              ➕ Create New Internship
            </Button>
          </Link>
        </Col>
      </Row>

      {/* Stats Cards */}
      {stats && (
        <Row className="mb-5 g-4">
          <Col sm={6} lg={4}>
            <Card className="h-100 border-0 transition-card card-gradient-blue">
              <Card.Body className="text-center text-white">
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💼</div>
                <h6 className="text-white-50 text-uppercase mb-3" style={{ letterSpacing: '0.5px' }}>
                  Total Internships
                </h6>
                <p className="h2 fw-bold m-0" style={{ fontSize: '2.5rem' }}>
                  {stats?.totalInternships || 0}
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} lg={4}>
            <Card className="h-100 border-0 transition-card card-gradient-purple">
              <Card.Body className="text-center text-white">
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
                <h6 className="text-white-50 text-uppercase mb-3" style={{ letterSpacing: '0.5px' }}>
                  Total Applications
                </h6>
                <p className="h2 fw-bold m-0" style={{ fontSize: '2.5rem' }}>
                  {stats?.totalApplications || 0}
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} lg={4}>
            <Card className="h-100 border-0 transition-card card-gradient-green">
              <Card.Body className="text-center text-white">
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
                <h6 className="text-white-50 text-uppercase mb-3" style={{ letterSpacing: '0.5px' }}>
                  Accepted
                </h6>
                <p className="h2 fw-bold m-0" style={{ fontSize: '2.5rem' }}>
                  {stats?.acceptedApplications || 0}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Internships List */}
      <Row>
        <Col lg={12}>
          <Card className="border-0">
            <Card.Header className="bg-white border-bottom d-flex align-items-center gap-2 py-3">
              <span style={{ fontSize: '1.3rem' }}>📝</span>
              <h5 className="mb-0 fw-bold">Your Internships</h5>
              <Badge bg="primary" className="ms-auto" style={{ padding: '0.5rem 1rem' }}>
                {internships.length} {internships.length === 1 ? 'Internship' : 'Internships'}
              </Badge>
            </Card.Header>
            <Card.Body className="p-0">
              {internships.length === 0 ? (
                <div className="text-center py-5 px-4">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                  <p className="text-muted mb-3">You haven't created any internships yet.</p>
                  <Link to="/internships/create" className="text-decoration-none">
                    <Button variant="primary" size="lg">
                      Create Your First Internship
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="fw-700">Title</th>
                        <th className="fw-700">Location</th>
                        <th className="fw-700">Duration</th>
                        <th className="fw-700">Stipend</th>
                        <th className="fw-700">Status</th>
                        <th className="fw-700">Applications</th>
                        <th className="fw-700 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {internships.map((internship) => (
                        <tr key={internship.id} style={{ transition: 'all 0.3s ease' }}>
                          <td className="fw-bold text-primary">{internship.title}</td>
                          <td>
                            <span className="d-flex align-items-center gap-1">
                              📍 {internship.location}
                            </span>
                          </td>
                          <td>{internship.duration} months</td>
                          <td className="fw-600 text-success">${internship.stipend}</td>
                          <td>
                            <Badge bg={internship.status === 'open' ? 'success' : 'danger'} className="badge-large">
                              {internship.status === 'open' ? '✓ Open' : '✗ Closed'}
                            </Badge>
                          </td>
                          <td>
                            <Link to={`/internships/${internship.id}`} className="text-decoration-none">
                              <Badge 
                                bg="info" 
                                style={{ cursor: 'pointer', padding: '0.6rem 1rem' }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                className="transition-smooth"
                              >
                                View Applications →
                              </Badge>
                            </Link>
                          </td>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <Link to={`/internships/${internship.id}/edit`} className="text-decoration-none">
                                <Button variant="outline-info" size="sm" className="fw-600">
                                  ✏️ Edit
                                </Button>
                              </Link>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteInternship(internship.id)}
                                className="fw-600"
                              >
                                🗑️ Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CompanyDashboard;
