import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { crudService } from '../services/crudService';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button, Table } from 'react-bootstrap';
import '../styles/admindashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingApplications, setPendingApplications] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data
      const [statsResponse, allUsers, allApplications] = await Promise.all([
        crudService.getStatistics(),
        crudService.getAllUsers(),
        crudService.getAllApplications()
      ]);
      
      // Calculate role-based stats
      const students = allUsers.data.filter(u => u.role === 'student');
      const companies = allUsers.data.filter(u => u.role === 'company');
      
      const enhancedStats = {
        ...statsResponse.data,
        totalStudents: students.length,
        totalCompanies: companies.length,
        totalUsers: allUsers.data.length
      };
      
      setStats(enhancedStats);
      
      // Get pending applications with details
      const pending = allApplications.data
        .filter(app => app.status === 'pending')
        .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
        .slice(0, 5);
      setPendingApplications(pending);
      
      // Get recent users
      const recent = allUsers.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentUsers(recent);
      
    } catch (error) {
      console.error('Dashboard error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchDashboardData}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="admin-dashboard">
      <Container fluid className="px-4 py-4">
        {/* Header Section */}
        <div className="dashboard-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="dashboard-title mb-2">
                <span className="title-icon">⚙️</span>
                Admin Dashboard
              </h1>
              <p className="dashboard-subtitle mb-0">
                Welcome back, <strong>{user?.fullName}</strong> • System Overview
              </p>
            </div>
            <div className="system-status">
              <span className="status-dot"></span>
              <span className="status-text">System Online</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <Row className="g-4 mb-4">
            <Col xl={3} lg={6} md={6}>
              <Card className="stat-card stat-students" onClick={() => navigate('/admin/users')}>
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                      </svg>
                    </div>
                    <div className="stat-details">
                      <div className="stat-label">Total Students</div>
                      <div className="stat-value">{stats.totalStudents || 0}</div>
                    </div>
                  </div>
                  <div className="stat-footer">
                    <span>View all students →</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={3} lg={6} md={6}>
              <Card className="stat-card stat-companies" onClick={() => navigate('/admin/users')}>
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                      </svg>
                    </div>
                    <div className="stat-details">
                      <div className="stat-label">Total Companies</div>
                      <div className="stat-value">{stats.totalCompanies || 0}</div>
                    </div>
                  </div>
                  <div className="stat-footer">
                    <span>View all companies →</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={3} lg={6} md={6}>
              <Card className="stat-card stat-internships" onClick={() => navigate('/admin/internships')}>
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                      </svg>
                    </div>
                    <div className="stat-details">
                      <div className="stat-label">Total Internships</div>
                      <div className="stat-value">{stats.totalInternships || 0}</div>
                    </div>
                  </div>
                  <div className="stat-footer">
                    <span>Manage internships →</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={3} lg={6} md={6}>
              <Card className="stat-card stat-applications" onClick={() => navigate('/admin/applications')}>
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                      </svg>
                    </div>
                    <div className="stat-details">
                      <div className="stat-label">Total Applications</div>
                      <div className="stat-value">{stats.totalApplications || 0}</div>
                    </div>
                  </div>
                  <div className="stat-footer">
                    <span>View applications →</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Pending Approvals Alert */}
        {stats && stats.pendingApplications > 0 && (
          <Alert variant="warning" className="pending-alert mb-4">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="alert-icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                  </svg>
                </div>
                <div>
                  <h5 className="mb-1 fw-bold">⏳ {stats.pendingApplications} Pending Approvals</h5>
                  <p className="mb-0">Applications are waiting for review and approval</p>
                </div>
              </div>
              <Button 
                variant="warning" 
                onClick={() => navigate('/admin/applications')}
                className="fw-bold px-4"
              >
                Review Now →
              </Button>
            </div>
          </Alert>
        )}

        {/* Main Content */}
        <Row className="g-4">
          {/* Pending Applications */}
          <Col lg={8}>
            <Card className="content-card">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1 fw-bold">📋 Pending Applications</h5>
                    <p className="text-muted small mb-0">Applications requiring immediate attention</p>
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => navigate('/admin/applications')}
                  >
                    View All
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                {pendingApplications.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover className="mb-0 applications-table">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Internship</th>
                          <th>Applied Date</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingApplications.map((app) => (
                          <tr key={app.id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="user-avatar">
                                  {app.studentName?.charAt(0).toUpperCase() || 'S'}
                                </div>
                                <span className="fw-medium">{app.studentName || 'Student'}</span>
                              </div>
                            </td>
                            <td>
                              <span className="internship-title">{app.internshipTitle || 'Internship'}</span>
                            </td>
                            <td>
                              <span className="text-muted">{app.appliedDate || 'N/A'}</span>
                            </td>
                            <td className="text-center">
                              <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => navigate('/admin/applications')}
                              >
                                Review
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">✅</div>
                    <h6>No Pending Applications</h6>
                    <p className="text-muted">All applications have been reviewed</p>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Application Status Distribution */}
            {stats && (
              <Card className="content-card mt-4">
                <Card.Header>
                  <h5 className="mb-1 fw-bold">📊 Application Status Overview</h5>
                  <p className="text-muted small mb-0">Distribution of all application statuses</p>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={4}>
                      <div className="status-box status-pending">
                        <div className="status-icon">⏳</div>
                        <div className="status-info">
                          <div className="status-label">Pending</div>
                          <div className="status-count">{stats.pendingApplications || 0}</div>
                        </div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="status-box status-accepted">
                        <div className="status-icon">✅</div>
                        <div className="status-info">
                          <div className="status-label">Accepted</div>
                          <div className="status-count">{stats.acceptedApplications || 0}</div>
                        </div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="status-box status-rejected">
                        <div className="status-icon">❌</div>
                        <div className="status-info">
                          <div className="status-label">Rejected</div>
                          <div className="status-count">{stats.rejectedApplications || 0}</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Recent Users */}
            <Card className="content-card mb-4">
              <Card.Header>
                <h5 className="mb-1 fw-bold">👥 Recent Users</h5>
                <p className="text-muted small mb-0">Latest registrations</p>
              </Card.Header>
              <Card.Body>
                {recentUsers.length > 0 ? (
                  <div className="users-list">
                    {recentUsers.map((u) => (
                      <div key={u.id} className="user-item">
                        <div className="user-avatar">
                          {u.fullName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="user-info">
                          <div className="user-name">{u.fullName}</div>
                          <div className="user-email">{u.email}</div>
                        </div>
                        <Badge 
                          bg={u.role === 'student' ? 'primary' : u.role === 'company' ? 'success' : 'secondary'}
                          className="role-badge"
                        >
                          {u.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center py-3">No recent users</p>
                )}
                <Button 
                  variant="outline-primary" 
                  className="w-100 mt-3"
                  onClick={() => navigate('/admin/users')}
                >
                  Manage All Users
                </Button>
              </Card.Body>
            </Card>

            {/* Quick Actions */}
            <Card className="content-card">
              <Card.Header>
                <h5 className="mb-0 fw-bold">⚡ Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="quick-actions">
                  <Button 
                    variant="primary"
                    className="action-btn"
                    onClick={() => navigate('/admin/users')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3z"/>
                    </svg>
                    <span>Manage Users</span>
                  </Button>
                  <Button 
                    variant="success"
                    className="action-btn"
                    onClick={() => navigate('/admin/internships')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/>
                    </svg>
                    <span>Manage Internships</span>
                  </Button>
                  <Button 
                    variant="info"
                    className="action-btn"
                    onClick={() => navigate('/admin/applications')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/>
                    </svg>
                    <span>View Applications</span>
                  </Button>
                  <Button 
                    variant="warning"
                    className="action-btn"
                    onClick={() => navigate('/admin/reports')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                    <span>View Reports</span>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
