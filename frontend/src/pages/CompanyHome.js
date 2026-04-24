import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { Container, Row, Col, Card, Badge, Button, Table, Spinner, Alert } from 'react-bootstrap';

const CompanyHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [internRes, statsRes] = await Promise.all([
          apiService.getCompanyInternships(),
          apiService.getDashboardStats(),
        ]);
        setInternships(internRes.data || []);
        setStats(statsRes.data || {});
      } catch (e) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  const statCards = [
    { label: 'Total Internships', value: stats?.totalInternships ?? internships.length, icon: '💼', color: '#2a9d8f' },
    { label: 'Total Applications', value: stats?.totalApplications ?? 0, icon: '📋', color: '#4361ee' },
    { label: 'Accepted', value: stats?.acceptedApplications ?? 0, icon: '✅', color: '#06d6a0' },
    { label: 'Pending', value: stats?.pendingApplications ?? 0, icon: '⏳', color: '#f4a261' },
  ];

  const openInternships = internships.filter(i => i.status === 'open');
  const closedInternships = internships.filter(i => i.status !== 'open');

  return (
    <Container fluid className="py-4 px-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>
            🏢 Welcome back, {user?.fullName}
          </h2>
          <p className="text-muted mb-0">Manage your internship postings and track applicants.</p>
        </div>
        <Button variant="success" onClick={() => navigate('/internships/create')}>
          ➕ Post New Internship
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Stat Cards */}
      <Row className="g-3 mb-4">
        {statCards.map((s, i) => (
          <Col xs={6} md={3} key={i}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center py-3">
                <div style={{ fontSize: '1.8rem' }}>{s.icon}</div>
                <div className="fw-bold fs-3 mt-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-muted small">{s.label}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4 mb-4">
        {/* Active Internships */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center py-3">
              <h6 className="fw-bold mb-0">💼 Your Internships</h6>
              <Button variant="outline-success" size="sm" onClick={() => navigate('/internships/create')}>
                + Post New
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {internships.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{ fontSize: '2.5rem' }}>📭</div>
                  <p className="text-muted mt-2 mb-3">No internships posted yet</p>
                  <Button variant="success" onClick={() => navigate('/internships/create')}>
                    Post Your First Internship
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0" size="sm">
                    <thead className="table-light">
                      <tr>
                        <th>Title</th>
                        <th>Location</th>
                        <th>Stipend</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {internships.map(i => (
                        <tr key={i.id}>
                          <td className="fw-medium">{i.title}</td>
                          <td className="text-muted small">📍 {i.location}</td>
                          <td className="text-success fw-medium">{i.stipend}</td>
                          <td>
                            <Badge bg={i.status === 'open' ? 'success' : 'secondary'}>
                              {i.status}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => navigate(`/internships/${i.id}`)}
                              >
                                View
                              </Button>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => navigate(`/internships/${i.id}/edit`)}
                              >
                                Edit
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

        {/* Summary Panel */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-3">
            <Card.Header className="bg-white border-bottom py-3">
              <h6 className="fw-bold mb-0">📊 Overview</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <span className="text-muted small">Open Positions</span>
                <Badge bg="success">{openInternships.length}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <span className="text-muted small">Closed Positions</span>
                <Badge bg="secondary">{closedInternships.length}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2">
                <span className="text-muted small">Total Posted</span>
                <Badge bg="primary">{internships.length}</Badge>
              </div>
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom py-3">
              <h6 className="fw-bold mb-0">⚡ Quick Actions</h6>
            </Card.Header>
            <Card.Body className="d-flex flex-column gap-2">
              <Button variant="success" className="w-100" onClick={() => navigate('/internships/create')}>
                ➕ Post Internship
              </Button>
              <Button variant="outline-primary" className="w-100" onClick={() => navigate('/internships')}>
                🔍 Browse All
              </Button>
              <Button variant="outline-secondary" className="w-100" onClick={() => navigate('/reports')}>
                📊 View Reports
              </Button>
              <Button variant="outline-dark" className="w-100" onClick={() => navigate('/profile')}>
                👤 Edit Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CompanyHome;
