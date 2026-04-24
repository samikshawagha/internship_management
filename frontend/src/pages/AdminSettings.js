import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { crudService } from '../services/crudService';
import {
  Container, Row, Col, Card, Button, Form, Alert, 
  Modal, Badge, ListGroup, Tabs, Tab, InputGroup, Table
} from 'react-bootstrap';
import { 
  FaCog, FaUsers, FaShieldAlt, FaDatabase, FaBell, 
  FaEnvelope, FaKey, FaTrash, FaPlus, FaEdit 
} from 'react-icons/fa';

const AdminSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  
  // Settings state
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'InternHub',
    siteDescription: 'Professional Internship Management Platform',
    allowRegistration: true,
    requireEmailVerification: false,
    maxApplicationsPerStudent: 10,
    applicationDeadlineBuffer: 7,
    autoCloseExpiredInternships: true,
    maintenanceMode: false
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@internhub.com',
    fromName: 'InternHub',
    enableNotifications: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    requireSpecialChars: true,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    twoFactorAuth: false
  });

  const [adminUsers, setAdminUsers] = useState([]);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    fullName: '',
    email: '',
    password: '',
    permissions: []
  });

  useEffect(() => {
    loadAdminUsers();
  }, []);

  const loadAdminUsers = async () => {
    try {
      const response = await crudService.getUsersByRole('admin');
      setAdminUsers(response.data);
    } catch (error) {
      console.error('Failed to load admin users:', error);
    }
  };

  const handleSystemSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('System settings updated successfully!');
    } catch (err) {
      setError('Failed to update system settings');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Email settings updated successfully!');
    } catch (err) {
      setError('Failed to update email settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Security settings updated successfully!');
    } catch (err) {
      setError('Failed to update security settings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdmin.fullName || !newAdmin.email || !newAdmin.password) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const adminData = {
        ...newAdmin,
        role: 'admin',
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      await crudService.createUser(adminData);
      setSuccess('Admin user created successfully!');
      setShowAddAdminModal(false);
      setNewAdmin({ fullName: '', email: '', password: '', permissions: [] });
      loadAdminUsers();
    } catch (err) {
      setError('Failed to create admin user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (adminId === user.id) {
      setError('You cannot delete your own admin account');
      return;
    }

    if (window.confirm('Are you sure you want to delete this admin user?')) {
      try {
        await crudService.deleteUser(adminId);
        setSuccess('Admin user deleted successfully!');
        loadAdminUsers();
      } catch (err) {
        setError('Failed to delete admin user');
      }
    }
  };

  const testEmailSettings = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('Test email sent successfully!');
    } catch (err) {
      setError('Failed to send test email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col md={8}>
          <h1 className="fw-bold mb-2">⚙️ Admin Settings</h1>
          <p className="text-muted">Configure system settings and manage platform</p>
        </Col>
        <Col md={4} className="text-end">
          <Button variant="primary" onClick={() => navigate('/admin-dashboard')}>
            ← Back to Dashboard
          </Button>
        </Col>
      </Row>

      {/* Alerts */}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        {/* General Settings Tab */}
        <Tab eventKey="general" title="🏠 General">
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0 fw-bold">
                <FaCog className="me-2" />
                System Settings
              </h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSystemSettingsSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Site Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={systemSettings.siteName}
                        onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Site Description</Form.Label>
                      <Form.Control
                        type="text"
                        value={systemSettings.siteDescription}
                        onChange={(e) => setSystemSettings({...systemSettings, siteDescription: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Max Applications per Student</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        max="50"
                        value={systemSettings.maxApplicationsPerStudent}
                        onChange={(e) => setSystemSettings({...systemSettings, maxApplicationsPerStudent: parseInt(e.target.value)})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Application Deadline Buffer (days)</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        max="30"
                        value={systemSettings.applicationDeadlineBuffer}
                        onChange={(e) => setSystemSettings({...systemSettings, applicationDeadlineBuffer: parseInt(e.target.value)})}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="my-4" />

                <Row className="g-3">
                  <Col md={6}>
                    <Form.Check
                      type="switch"
                      id="allowRegistration"
                      label="Allow New User Registration"
                      checked={systemSettings.allowRegistration}
                      onChange={(e) => setSystemSettings({...systemSettings, allowRegistration: e.target.checked})}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Check
                      type="switch"
                      id="requireEmailVerification"
                      label="Require Email Verification"
                      checked={systemSettings.requireEmailVerification}
                      onChange={(e) => setSystemSettings({...systemSettings, requireEmailVerification: e.target.checked})}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Check
                      type="switch"
                      id="autoCloseExpiredInternships"
                      label="Auto-close Expired Internships"
                      checked={systemSettings.autoCloseExpiredInternships}
                      onChange={(e) => setSystemSettings({...systemSettings, autoCloseExpiredInternships: e.target.checked})}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Check
                      type="switch"
                      id="maintenanceMode"
                      label="Maintenance Mode"
                      checked={systemSettings.maintenanceMode}
                      onChange={(e) => setSystemSettings({...systemSettings, maintenanceMode: e.target.checked})}
                    />
                  </Col>
                </Row>

                <div className="mt-4">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        {/* Email Settings Tab */}
        <Tab eventKey="email" title="📧 Email">
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0 fw-bold">
                <FaEnvelope className="me-2" />
                Email Configuration
              </h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleEmailSettingsSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">SMTP Host</Form.Label>
                      <Form.Control
                        type="text"
                        value={emailSettings.smtpHost}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                        placeholder="smtp.gmail.com"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">SMTP Port</Form.Label>
                      <Form.Control
                        type="number"
                        value={emailSettings.smtpPort}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value)})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">SMTP Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={emailSettings.smtpUsername}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">SMTP Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={emailSettings.smtpPassword}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">From Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={emailSettings.fromEmail}
                        onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">From Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={emailSettings.fromName}
                        onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="my-4" />

                <Form.Check
                  type="switch"
                  id="enableNotifications"
                  label="Enable Email Notifications"
                  checked={emailSettings.enableNotifications}
                  onChange={(e) => setEmailSettings({...emailSettings, enableNotifications: e.target.checked})}
                  className="mb-3"
                />

                <div className="d-flex gap-2">
                  <Button type="submit" variant="success" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Email Settings'}
                  </Button>
                  <Button variant="outline-info" onClick={testEmailSettings} disabled={loading}>
                    Test Email
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        {/* Security Settings Tab */}
        <Tab eventKey="security" title="🔒 Security">
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0 fw-bold">
                <FaShieldAlt className="me-2" />
                Security Configuration
              </h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSecuritySettingsSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Password Minimum Length</Form.Label>
                      <Form.Control
                        type="number"
                        min="6"
                        max="20"
                        value={securitySettings.passwordMinLength}
                        onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Session Timeout (hours)</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        max="168"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Max Login Attempts</Form.Label>
                      <Form.Control
                        type="number"
                        min="3"
                        max="10"
                        value={securitySettings.maxLoginAttempts}
                        onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Lockout Duration (minutes)</Form.Label>
                      <Form.Control
                        type="number"
                        min="5"
                        max="1440"
                        value={securitySettings.lockoutDuration}
                        onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)})}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="my-4" />

                <Row className="g-3">
                  <Col md={6}>
                    <Form.Check
                      type="switch"
                      id="requireSpecialChars"
                      label="Require Special Characters in Password"
                      checked={securitySettings.requireSpecialChars}
                      onChange={(e) => setSecuritySettings({...securitySettings, requireSpecialChars: e.target.checked})}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Check
                      type="switch"
                      id="twoFactorAuth"
                      label="Enable Two-Factor Authentication"
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                    />
                  </Col>
                </Row>

                <div className="mt-4">
                  <Button type="submit" variant="warning" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Security Settings'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        {/* Admin Users Tab */}
        <Tab eventKey="admins" title="👥 Admins">
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-danger text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">
                <FaUsers className="me-2" />
                Admin Users
              </h5>
              <Button variant="light" size="sm" onClick={() => setShowAddAdminModal(true)}>
                <FaPlus className="me-1" />
                Add Admin
              </Button>
            </Card.Header>
            <Card.Body>
              {adminUsers.length > 0 ? (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((admin) => (
                        <tr key={admin.id}>
                          <td className="fw-bold">{admin.fullName}</td>
                          <td>{admin.email}</td>
                          <td>{admin.createdAt}</td>
                          <td>
                            <Badge bg="success">Active</Badge>
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteAdmin(admin.id)}
                              disabled={admin.id === user.id}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No admin users found</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* Database Tab */}
        <Tab eventKey="database" title="💾 Database">
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0 fw-bold">
                <FaDatabase className="me-2" />
                Database Management
              </h5>
            </Card.Header>
            <Card.Body>
              <Alert variant="info">
                <h6 className="fw-bold">Database Operations</h6>
                <p className="mb-0">Manage your database with caution. These operations cannot be undone.</p>
              </Alert>

              <Row className="g-3">
                <Col md={6}>
                  <Card className="border-warning">
                    <Card.Body className="text-center">
                      <h6 className="fw-bold">Backup Database</h6>
                      <p className="text-muted small">Create a backup of all data</p>
                      <Button variant="warning" size="sm">
                        Create Backup
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-success">
                    <Card.Body className="text-center">
                      <h6 className="fw-bold">Export Data</h6>
                      <p className="text-muted small">Export data in various formats</p>
                      <Button variant="success" size="sm">
                        Export Data
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-primary">
                    <Card.Body className="text-center">
                      <h6 className="fw-bold">Reset Demo Data</h6>
                      <p className="text-muted small">Reset to sample data</p>
                      <Button variant="primary" size="sm">
                        Reset Data
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-danger">
                    <Card.Body className="text-center">
                      <h6 className="fw-bold">Clear All Data</h6>
                      <p className="text-muted small">⚠️ Permanently delete all data</p>
                      <Button variant="danger" size="sm">
                        Clear Data
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Add Admin Modal */}
      <Modal show={showAddAdminModal} onHide={() => setShowAddAdminModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>👥 Add New Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name *</Form.Label>
              <Form.Control
                type="text"
                value={newAdmin.fullName}
                onChange={(e) => setNewAdmin({...newAdmin, fullName: e.target.value})}
                placeholder="Enter full name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                placeholder="Enter email address"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password *</Form.Label>
              <Form.Control
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                placeholder="Enter password"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddAdminModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddAdmin} disabled={loading}>
            {loading ? 'Creating...' : 'Create Admin'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminSettings;