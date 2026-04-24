import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { crudService } from '../services/crudService';
import { Container, Row, Col, Card, Badge, Button, Table, Spinner, Alert } from 'react-bootstrap';

const AdminHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, usersRes, appsRes] = await Promise.all([
          crudService.getStatistics(),
          crudService.getAllUsers(),
          crudService.getAllApplications(),
        ]);

        const users = usersRes.data;
        const apps = appsRes.data;

        setStats({
          ...statsRes.data,
          totalStudents: users.filter(u => u.role === 'student').length,
          totalCompanies: users.filter(u => u.role === 'company').length,
          pendingApps: apps.filter(a => a.status === 'pending').length,
          acceptedApps: apps.filter(a => a.status === 'accepted').length,
        });

        setRecentApps(
          [...apps].sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)).slice(0, 5)
        );
        setRecentUsers(
          [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
        );
      } catch (e) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="danger" />
      </Container>
    );
  }

  const statCards = [
    { label: 'Students', value: stats?.totalStudents ?? 0, icon: '🎓', color: '#4361ee', path: '/admin/users' },
    { label: 'Companies', value: stats?.totalCompanies ?? 0, icon: '🏢', color: '#2a9d8f', path: '/admin/users' },
    { label: 'Internships', value: stats?.totalInternships ?? 0, icon: '💼', color: '#e76f51', path: '/admin/internships' },
    { label: 'Applications', value: stats?.totalApplications ?? 0, icon: '📋', color: '#8338ec', path: '/admin/applications' },
    { label: 'Pending', value: stats?.pendingApps ?? 0, icon: '⏳', color: '#f4a261', path: '/admin/applications' },
    { label: 'Accepted', value: stats?.acceptedApps ?? 0, icon: '✅', color: '#06d6a0', path: '/admin/applications' },
  ];

  const quickActions = [
    { label: 'Manage Users', icon: '👥', path: '/admin/users', color: '#4361ee' },
    { label: 'Internships', icon: '💼', path: '/admin/internships', color: '#2a9d8f' },
    { label: 'Applications', icon: '📋', path: '/admin/applications', color: '#8338ec' },
    { label: 'Reports', icon: '📊', path: '/admin/reports', color: '#e63946' },
  ];

  return (
    <Container fluid className="py-4 px-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>
          ⚙️ Welcome back, {user?.fullName}
        </h2>
        <p className="text-muted mb-0">Here's what's happening across the platform today.</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Stat Cards */}
      <Row className="g-3 mb-4">
        {statCards.map((s, i) => (
          <Col xs={6} md={4} xl={2} key={i}>
            <Card
              className="border-0 h-100 shadow-sm"
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => navigate(s.path)}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Card.Body className="text-center py-3">
                <div style={{ fontSize: '1.8rem' }}>{s.icon}</div>
                <div className="fw-bold fs-4 mt-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-muted small">{s.label}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4 mb-4">
        {/* Recent Applications */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center py-3">
              <h6 className="fw-bold mb-0">📋 Recent Applications</h6>
              <Button variant="outline-primary" size="sm" onClick={() => navigate('/admin/applications')}>
                View All
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {recentApps.length === 0 ? (
                <p className="text-muted text-center py-4">No applications yet</p>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0" size="sm">
                    <thead className="table-light">
                      <tr>
                        <th>Student</th>
                        <th>Position</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApps.map(app => (
                        <tr key={app.id}>
                          <td className="fw-medium">{app.studentName}</td>
                          <td>{app.internshipTitle}</td>
                          <td>{app.company}</td>
                          <td>
                            <Badge bg={
                              app.status === 'accepted' ? 'success' :
                              app.status === 'rejected' ? 'danger' : 'warning'
                            }>
                              {app.status}
                            </Badge>
                          </td>
                          <td className="text-muted small">{app.appliedDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Users */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center py-3">
              <h6 className="fw-bold mb-0">👥 Recent Users</h6>
              <Button variant="outline-primary" size="sm" onClick={() => navigate('/admin/users')}>
                View All
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {recentUsers.map(u => (
                <div key={u.id} className="d-flex align-items-center gap-3 px-3 py-2 border-bottom">
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: u.role === 'admin' ? '#e63946' : u.role === 'company' ? '#2a9d8f' : '#4361ee',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 'bold', fontSize: '0.85rem'
                    }}
                  >
                    {u.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="fw-medium text-truncate" style={{ fontSize: '0.88rem' }}>{u.fullName}</div>
                    <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>{u.email}</div>
                  </div>
                  <Badge bg={u.role === 'admin' ? 'danger' : u.role === 'company' ? 'success' : 'primary'} style={{ fontSize: '0.7rem' }}>
                    {u.role}
                  </Badge>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom py-3">
          <h6 className="fw-bold mb-0">⚡ Quick Actions</h6>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            {quickActions.map((a, i) => (
              <Col xs={6} md={3} key={i}>
                <Button
                  variant="light"
                  className="w-100 py-3 border"
                  style={{ transition: 'all 0.2s' }}
                  onClick={() => navigate(a.path)}
                  onMouseEnter={e => { e.currentTarget.style.background = a.color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = a.color; }}
                  onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = ''; }}
                >
                  <div style={{ fontSize: '1.5rem' }}>{a.icon}</div>
                  <div className="mt-1 fw-medium small">{a.label}</div>
                </Button>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminHome;
