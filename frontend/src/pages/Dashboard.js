import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert } from 'react-bootstrap';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [applicationStats, setApplicationStats] = useState([]);
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

      const appStatsResponse = await apiService.getApplicationStats();
      setApplicationStats(appStatsResponse.data);
    } catch (error) {
      setError('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
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

  return (
    <Container fluid className="py-4">
      <div className="mb-4">
        <h1 className="fw-bold text-dark mb-2">Dashboard</h1>
        <p className="text-muted fs-5">Welcome back, {user?.fullName}! 👋</p>
      </div>

      {stats && (
        <Row className="mb-4 g-3">
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
                  return '📝';
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
              <Col key={key} md={6} lg={4}>
                <Card className="h-100 shadow-sm border-0 text-center">
                  <Card.Body>
                    <div className="fs-3 mb-2">{getIcon()}</div>
                    <h3 className="h5 text-muted mb-3">{label}</h3>
                    <p className="h2 fw-bold text-primary m-0">{value}</p>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {applicationStats.length > 0 && (
        <Row>
          <Col lg={12}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-light border-bottom">
                <h5 className="mb-0 fw-bold">Application Statistics</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Status</th>
                      <th className="text-end">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicationStats.map((stat) => (
                      <tr key={stat.status}>
                        <td>
                          <Badge bg={getStatusColor(stat.status)} className="fs-6">
                            {stat.status.charAt(0).toUpperCase() + stat.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="text-end fw-bold">{stat.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Dashboard;
