import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge, Modal } from 'react-bootstrap';
import '../styles/profile.css';

const CompanyProfile = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [lastLogin, setLastLogin] = useState(null);
  const [profileImage, setProfileImage] = useState(user?.logo || null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: 'Human Resources',
    role: 'Manager'
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await apiService.getProfile();
      if (response.data) {
        setProfileForm(prev => ({
          ...prev,
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          phone: response.data.phone || ''
        }));
        // Set last login from localStorage or mock data
        const storedLastLogin = localStorage.getItem('lastLogin');
        setLastLogin(storedLastLogin || new Date().toLocaleDateString());
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Check password strength if it's the new password field
    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }
    setError('');
    setSuccess('');
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;

    if (score <= 1) {
      feedback = 'Weak password';
    } else if (score <= 2) {
      feedback = 'Fair password';
    } else if (score <= 3) {
      feedback = 'Good password';
    } else if (score <= 4) {
      feedback = 'Strong password';
    } else {
      feedback = 'Very strong password';
    }

    setPasswordStrength({ score, feedback });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateProfileForm = () => {
    if (!profileForm.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!profileForm.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!/^\d{10,15}$/.test(profileForm.phone.replace(/[\s\-\+\(\)]/g, ''))) {
      setError('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const validatePasswordForm = () => {
    if (!passwordForm.currentPassword) {
      setError('Current password is required');
      return false;
    }
    if (!passwordForm.newPassword) {
      setError('New password is required');
      return false;
    }
    if (passwordForm.newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return false;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setError('New password must be different from current password');
      return false;
    }
    if (passwordStrength.score <= 1) {
      setError('Password is too weak. Use uppercase, lowercase, numbers, and symbols');
      return false;
    }
    return true;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setLoading(true);
    try {
      await apiService.updateProfile({
        fullName: profileForm.fullName,
        phone: profileForm.phone
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setLoading(true);
    try {
      await apiService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setSuccess('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Store last login time
    localStorage.setItem('lastLogin', new Date().toLocaleDateString());
    logout();
    setShowLogoutModal(false);
  };

  const getPasswordStrengthColor = () => {
    const { score } = passwordStrength;
    if (score <= 1) return '#dc3545';
    if (score <= 2) return '#fd7e14';
    if (score <= 3) return '#ffc107';
    if (score <= 4) return '#28a745';
    return '#20c997';
  };

  return (
    <Container fluid className="py-5 profile-page">
      {/* Header */}
      <Row className="mb-4">
        <Col md={8}>
          <h1 className="fw-bold mb-2" style={{ fontSize: '2.5rem', color: '#1a1a2e' }}>
            👤 My Profile
          </h1>
          <p className="text-muted fs-5">Manage your company account and security settings</p>
        </Col>
        <Col md={4} className="text-end">
          <Badge bg="info" className="badge-large me-2">
            🔐 Secure Zone
          </Badge>
          <Badge bg="success" className="badge-large">
            Active
          </Badge>
        </Col>
      </Row>

      {/* Error & Success Alerts */}
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          ⚠️ {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={() => setSuccess('')} dismissible>
          ✓ {success}
        </Alert>
      )}

      <Row className="g-4">
        {/* Sidebar */}
        <Col lg={3}>
          <Card className="border-0 profile-card shadow-sm">
            {/* Profile Image */}
            <div className="profile-image-wrapper text-center" style={{ position: 'relative', padding: '2rem 1rem' }}>
              <div 
                className="profile-avatar"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundImage: profileImage ? `url(${profileImage})` : 'none',
                  backgroundColor: profileImage ? 'transparent' : '#e9ecef',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  margin: '0 auto',
                  border: '4px solid #007bff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem'
                }}
              >
                {!profileImage && '👤'}
              </div>
              <p className="mt-3 fw-bold text-center fs-6">{profileForm.fullName}</p>
              <p className="text-muted text-center mb-0" style={{ fontSize: '0.9rem' }}>
                {profileForm.role}
              </p>
            </div>

            <hr />

            {/* Account Info */}
            <Card.Body>
              <h6 className="fw-bold mb-3">Account Information</h6>
              <div className="mb-3">
                <small className="text-muted d-block">Email</small>
                <p className="mb-0" style={{ fontSize: '0.95rem' }}>{profileForm.email}</p>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block">Account Created</small>
                <p className="mb-0" style={{ fontSize: '0.95rem' }}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block">Last Login</small>
                <p className="mb-0" style={{ fontSize: '0.95rem' }}>{lastLogin || 'Today'}</p>
              </div>
              <hr />
              <Button 
                variant="outline-danger" 
                className="w-100 fw-bold"
                onClick={() => setShowLogoutModal(true)}
              >
                🚪 Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Main Content */}
        <Col lg={9}>
          {/* Tabs */}
          <div className="profile-tabs mb-4">
            <div className="btn-group-tabs" role="group">
              <Button
                variant={activeTab === 'profile' ? 'primary' : 'outline-secondary'}
                onClick={() => {
                  setActiveTab('profile');
                  setError('');
                  setSuccess('');
                }}
                className="fw-bold"
              >
                📋 Profile Information
              </Button>
              <Button
                variant={activeTab === 'password' ? 'primary' : 'outline-secondary'}
                onClick={() => {
                  setActiveTab('password');
                  setError('');
                  setSuccess('');
                }}
                className="fw-bold"
              >
                🔐 Change Password
              </Button>
              <Button
                variant={activeTab === 'security' ? 'primary' : 'outline-secondary'}
                onClick={() => {
                  setActiveTab('security');
                  setError('');
                  setSuccess('');
                }}
                className="fw-bold"
              >
                🛡️ Security
              </Button>
            </div>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light border-bottom py-3">
                <h5 className="mb-0 fw-bold">📋 Basic User Details</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleUpdateProfile}>
                  {/* Profile Photo */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Profile Photo</h6>
                    <div className="d-flex gap-3 align-items-start">
                      <div>
                        <div
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '10px',
                            backgroundImage: profileImage ? `url(${profileImage})` : 'none',
                            backgroundColor: profileImage ? 'transparent' : '#e9ecef',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            border: '2px solid #dee2e6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem'
                          }}
                        >
                          {!profileImage && '📷'}
                        </div>
                      </div>
                      <div>
                        <Form.Group>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            className="mb-2"
                          />
                          <small className="text-muted d-block">
                            Recommended: 200×200px, JPG or PNG, max 5MB
                          </small>
                        </Form.Group>
                      </div>
                    </div>
                  </div>

                  <hr />

                  {/* Personal Information */}
                  <h6 className="fw-bold mb-3">Personal Information</h6>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={profileForm.fullName}
                      onChange={handleProfileChange}
                      placeholder="Enter your full name"
                      className="form-control-lg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Email *</Form.Label>
                    <Form.Control
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="form-control-lg bg-light"
                    />
                    <small className="text-muted">Email cannot be changed</small>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Phone Number *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      placeholder="Enter your phone number"
                      className="form-control-lg"
                    />
                  </Form.Group>

                  <hr />

                  {/* Department & Role */}
                  <h6 className="fw-bold mb-3">Department & Role</h6>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Department</Form.Label>
                        <Form.Control
                          as="select"
                          value={profileForm.department}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, department: e.target.value }))}
                          className="form-control-lg"
                        >
                          <option>Human Resources</option>
                          <option>Operations</option>
                          <option>Finance</option>
                          <option>Technology</option>
                          <option>Marketing</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Role</Form.Label>
                        <Form.Control
                          as="select"
                          value={profileForm.role}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, role: e.target.value }))}
                          className="form-control-lg"
                        >
                          <option>Manager</option>
                          <option>Coordinator</option>
                          <option>Director</option>
                          <option>Admin</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2 mt-4">
                    <Button
                      type="submit"
                      variant="success"
                      size="lg"
                      className="fw-bold"
                      disabled={loading}
                    >
                      {loading ? <Spinner animation="border" size="sm" className="me-2" /> : '💾'}
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      size="lg"
                      className="fw-bold"
                      onClick={() => fetchUserData()}
                    >
                      ↺ Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light border-bottom py-3">
                <h5 className="mb-0 fw-bold">🔐 Change Password</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleChangePassword}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Current Password *</Form.Label>
                    <Form.Control
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your current password"
                      className="form-control-lg"
                    />
                  </Form.Group>

                  <hr />

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">New Password *</Form.Label>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your new password"
                      className="form-control-lg"
                    />
                    <small className="text-muted">
                      At least 8 characters with uppercase, lowercase, numbers, and symbols
                    </small>
                  </Form.Group>

                  {/* Password Strength Indicator */}
                  {passwordForm.newPassword && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <small className="fw-bold">Password Strength</small>
                        <small className="fw-bold" style={{ color: getPasswordStrengthColor() }}>
                          {passwordStrength.feedback}
                        </small>
                      </div>
                      <div 
                        className="progress"
                        style={{ height: '8px', borderRadius: '5px' }}
                      >
                        <div
                          className="progress-bar"
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                            backgroundColor: getPasswordStrengthColor(),
                            transition: 'all 0.3s ease'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Confirm New Password *</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm your new password"
                      className="form-control-lg"
                    />
                    {passwordForm.newPassword && passwordForm.confirmPassword && (
                      <small className={passwordForm.newPassword === passwordForm.confirmPassword ? 'text-success' : 'text-danger'}>
                        {passwordForm.newPassword === passwordForm.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </small>
                    )}
                  </Form.Group>

                  <Alert variant="info" className="mt-3">
                    <small>
                      <strong>Password Requirements:</strong>
                      <ul className="mb-0 mt-2">
                        <li>Minimum 8 characters</li>
                        <li>Include uppercase and lowercase letters</li>
                        <li>Include numbers (0-9)</li>
                        <li>Include special characters (!@#$%^&*)</li>
                      </ul>
                    </small>
                  </Alert>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2 mt-4">
                    <Button
                      type="submit"
                      variant="warning"
                      size="lg"
                      className="fw-bold text-white"
                      disabled={loading}
                    >
                      {loading ? <Spinner animation="border" size="sm" className="me-2" /> : '🔑'}
                      {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      size="lg"
                      className="fw-bold"
                      onClick={() => {
                        setPasswordForm({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                        setPasswordStrength({ score: 0, feedback: '' });
                      }}
                    >
                      ↺ Clear
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light border-bottom py-3">
                <h5 className="mb-0 fw-bold">🛡️ Security Settings</h5>
              </Card.Header>
              <Card.Body>
                {/* Account Status */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Account Status</h6>
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                    <div>
                      <p className="mb-1">Account Status</p>
                      <small className="text-muted">Your account is active and secure</small>
                    </div>
                    <Badge bg="success" className="badge-large">✓ Active</Badge>
                  </div>
                </div>

                {/* Last Login */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Login Activity</h6>
                  <div className="p-3 bg-light rounded">
                    <Row>
                      <Col md={6}>
                        <p className="mb-1 fw-bold">Last Login</p>
                        <p className="mb-0 text-muted">{lastLogin || 'Today'}</p>
                      </Col>
                      <Col md={6}>
                        <p className="mb-1 fw-bold">Account Created</p>
                        <p className="mb-0 text-muted">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </Col>
                    </Row>
                  </div>
                </div>

                {/* Security Recommendations */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Security Recommendations</h6>
                  <Alert variant="warning">
                    <ul className="mb-0">
                      <li>Change your password regularly (every 3 months)</li>
                      <li>Use a strong, unique password with 8+ characters</li>
                      <li>Include uppercase, lowercase, numbers, and symbols</li>
                      <li>Don't share your password with anyone</li>
                      <li>Log out when using shared computers</li>
                    </ul>
                  </Alert>
                </div>

                {/* Logout */}
                <div className="mt-4">
                  <h6 className="fw-bold mb-3">Session Management</h6>
                  <p className="text-muted mb-3">Log out from this device</p>
                  <Button
                    variant="danger"
                    size="lg"
                    className="fw-bold"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    🚪 Logout
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">🚪 Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to logout from your account?</p>
          <Alert variant="info" className="mb-0">
            You will need to login again to access your dashboard.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout} className="fw-bold">
            Yes, Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CompanyProfile;
