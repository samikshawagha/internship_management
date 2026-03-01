import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab, Badge, ProgressBar, Spinner, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const AdminProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Profile state
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    adminTitle: 'System Administrator',
    department: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileStrength, setProfileStrength] = useState(0);

  // Load dashboard stats
  useEffect(() => {
    fetchDashboardStats();
    calculateProfileStrength();
  }, [formData]);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/analytics/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  const calculateProfileStrength = () => {
    let strength = 0;
    if (formData.fullName) strength += 25;
    if (formData.phone) strength += 25;
    if (formData.adminTitle) strength += 25;
    if (formData.department) strength += 25;
    setProfileStrength(strength);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.put('http://localhost:5000/api/auth/profile', {
        fullName: formData.fullName,
        phone: formData.phone,
        department: formData.department,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSuccess('Admin profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await axios.put('http://localhost:5000/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSuccess('Password updated successfully! Please login again.');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (profileStrength < 50) return 'warning';
    return 'success';
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col md={8}>
          <h2 className="text-dark">
            <Badge bg="danger" className="me-2">Admin Profile</Badge>
            {user?.fullName}
          </h2>
          <p className="text-muted">Manage your admin account and system settings</p>
        </Col>
      </Row>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      <Row className="mb-4">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-4">
                <i className="bi bi-percent"></i> Profile Completion
              </h5>
              <ProgressBar 
                now={profileStrength} 
                variant={getStrengthColor()} 
                label={`${profileStrength}%`}
                className="mb-2"
              />
              <small className="text-muted">
                {profileStrength < 75 ? '⚠️ Complete your profile information' :
                 '✅ Profile is well maintained!'}
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Tabs defaultActiveKey="admin" className="mb-3">
                {/* Admin Info Tab */}
                <Tab eventKey="admin" title="Admin Information">
                  <Form onSubmit={handleProfileUpdate} className="pt-3">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">Admin Title</Form.Label>
                          <Form.Control
                            type="text"
                            name="adminTitle"
                            value={formData.adminTitle}
                            disabled
                            placeholder="Admin Title"
                          />
                          <small className="text-muted">Your system role</small>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Department</Form.Label>
                      <Form.Control
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="e.g. Human Resources, IT"
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={loading} className="w-100 mt-3">
                      {loading ? <Spinner size="sm" className="me-2" /> : ''}
                      Save Admin Info
                    </Button>
                  </Form>
                </Tab>

                {/* Contact Info Tab */}
                <Tab eventKey="contact" title="Contact Information">
                  <Form className="pt-3">
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        placeholder="Your email"
                      />
                      <small className="text-muted">Email address is linked to your account</small>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (234) 567-8900"
                      />
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      onClick={(e) => handleProfileUpdate(e)}
                      disabled={loading}
                      className="w-100"
                    >
                      {loading ? <Spinner size="sm" className="me-2" /> : ''}
                      Save Contact Info
                    </Button>
                  </Form>
                </Tab>

                {/* Permissions Tab */}
                <Tab eventKey="permissions" title="Permissions">
                  <div className="pt-3">
                    <Alert variant="info">
                      <i className="bi bi-shield-check me-2"></i>
                      System Administrator Permissions
                    </Alert>
                    
                    <h6 className="fw-bold mb-3">Access Rights</h6>
                    <ListGroup>
                      <ListGroup.Item>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>
                            <i className="bi bi-diagram-3 me-2 text-success"></i>
                            View System Analytics
                          </span>
                          <Badge bg="success">Enabled</Badge>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>
                            <i className="bi bi-people-fill me-2 text-success"></i>
                            Manage Users
                          </span>
                          <Badge bg="success">Enabled</Badge>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>
                            <i className="bi bi-briefcase me-2 text-success"></i>
                            Manage Internships
                          </span>
                          <Badge bg="success">Enabled</Badge>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>
                            <i className="bi bi-file-earmark-text me-2 text-success"></i>
                            View Reports
                          </span>
                          <Badge bg="success">Enabled</Badge>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>
                            <i className="bi bi-gear me-2 text-success"></i>
                            System Settings
                          </span>
                          <Badge bg="success">Enabled</Badge>
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
                  </div>
                </Tab>

                {/* Security Tab */}
                <Tab eventKey="security" title="Security">
                  <Form onSubmit={handlePasswordUpdate} className="pt-3">
                    <Alert variant="info">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      As an admin, maintain a strong password to protect the system
                    </Alert>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                        required
                      />
                      <small className="text-muted">At least 6 characters</small>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                        required
                      />
                    </Form.Group>

                    <Button variant="warning" type="submit" disabled={loading} className="w-100">
                      {loading ? <Spinner size="sm" className="me-2" /> : ''}
                      Update Password
                    </Button>
                  </Form>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>

        {/* Admin Summary Card */}
        <Col md={4}>
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <h6 className="fw-bold mb-3">Account Summary</h6>
              <div className="mb-2">
                <small className="text-muted">Role</small>
                <p className="mb-2"><Badge bg="danger">Administrator</Badge></p>
              </div>
              <div className="mb-2">
                <small className="text-muted">Email</small>
                <p className="mb-0 text-break">{user?.email}</p>
              </div>
              <div className="mb-2">
                <small className="text-muted">Department</small>
                <p className="mb-0">{formData.department || 'Not specified'}</p>
              </div>
            </Card.Body>
          </Card>

          {dashboardStats && (
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-diagram-3 me-2"></i> System Overview
                </h6>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between px-0">
                    <span>Total Users</span>
                    <Badge bg="info">{dashboardStats.totalUsers || 0}</Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between px-0">
                    <span>Active Internships</span>
                    <Badge bg="success">{dashboardStats.totalInternships || 0}</Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between px-0">
                    <span>Total Applications</span>
                    <Badge bg="warning">{dashboardStats.totalApplications || 0}</Badge>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          )}

          <Card className="shadow-sm border-danger">
            <Card.Body>
              <h6 className="fw-bold mb-2 text-danger">
                <i className="bi bi-shield-check me-2"></i> Security Notice
              </h6>
              <ul className="list-unstyled small">
                <li className="mb-2">✓ Change password regularly</li>
                <li className="mb-2">✓ Monitor system logs</li>
                <li className="mb-2">✓ Review user activities</li>
                <li>✓ Keep contact info updated</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminProfile;
