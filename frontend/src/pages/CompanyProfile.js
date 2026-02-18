import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab, Badge, ProgressBar, Spinner } from 'react-bootstrap';
import axios from 'axios';

const CompanyProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Profile state
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    companyName: '',
    industry: '',
    website: '',
    description: '',
    location: '',
    employees: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileStrength, setProfileStrength] = useState(0);

  // Calculate profile strength on mount and when formData changes
  useEffect(() => {
    calculateProfileStrength();
  }, [formData]);

  const calculateProfileStrength = () => {
    let strength = 0;
    if (formData.fullName) strength += 12;
    if (formData.phone) strength += 12;
    if (formData.companyName) strength += 15;
    if (formData.industry) strength += 12;
    if (formData.website) strength += 12;
    if (formData.description) strength += 19;
    if (formData.location) strength += 10;
    if (formData.employees) strength += 8;
    setProfileStrength(Math.min(strength, 100));
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
        companyName: formData.companyName,
        industry: formData.industry,
        website: formData.website,
        description: formData.description,
        location: formData.location,
        employees: formData.employees,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSuccess('Company profile updated successfully!');
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
    if (profileStrength < 30) return 'danger';
    if (profileStrength < 60) return 'warning';
    if (profileStrength < 90) return 'info';
    return 'success';
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col md={8}>
          <h2 className="text-dark">
            <Badge bg="success" className="me-2">Company Profile</Badge>
            {user?.fullName}
          </h2>
          <p className="text-muted">Manage your company information and security settings</p>
        </Col>
      </Row>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      <Row className="mb-4">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-4">
                <i className="bi bi-percent"></i> Profile Strength
              </h5>
              <ProgressBar 
                now={profileStrength} 
                variant={getStrengthColor()} 
                label={`${profileStrength}%`}
                className="mb-2"
              />
              <small className="text-muted">
                {profileStrength < 50 ? '⚠️ Complete your profile to stand out to students' :
                 profileStrength < 80 ? '✓ Good progress! Add more details' :
                 '✅ Excellent profile strength!'}
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Tabs defaultActiveKey="company" className="mb-3">
                {/* Company Info Tab */}
                <Tab eventKey="company" title="Company Info">
                  <Form onSubmit={handleProfileUpdate} className="pt-3">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">Company Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="Enter company name"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">Industry</Form.Label>
                          <Form.Control
                            type="text"
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                            placeholder="e.g. Technology, Finance"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Website</Form.Label>
                      <Form.Control
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Company Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Tell students about your company..."
                      />
                      <small className="text-muted">{formData.description.length}/500 characters</small>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">Headquarters Location</Form.Label>
                          <Form.Control
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="City, Country"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">Number of Employees</Form.Label>
                          <Form.Select
                            name="employees"
                            value={formData.employees}
                            onChange={handleInputChange}
                          >
                            <option value="">Select range</option>
                            <option value="1-10">1-10</option>
                            <option value="11-50">11-50</option>
                            <option value="51-200">51-200</option>
                            <option value="201-500">201-500</option>
                            <option value="500+">500+</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button variant="primary" type="submit" disabled={loading} className="w-100 mt-3">
                      {loading ? <Spinner size="sm" className="me-2" /> : ''}
                      Save Company Info
                    </Button>
                  </Form>
                </Tab>

                {/* Contact Info Tab */}
                <Tab eventKey="contact" title="Contact Information">
                  <Form className="pt-3">
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Contact Person Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        placeholder="Your email"
                      />
                      <small className="text-muted">Email cannot be changed</small>
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

                {/* Security Tab */}
                <Tab eventKey="security" title="Security">
                  <Form onSubmit={handlePasswordUpdate} className="pt-3">
                    <Alert variant="info">
                      <i className="bi bi-info-circle me-2"></i>
                      Keep your account secure with a strong password
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

        {/* Profile Summary Card */}
        <Col md={4}>
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <h6 className="fw-bold mb-3">Account Summary</h6>
              <div className="mb-2">
                <small className="text-muted">Role</small>
                <p className="mb-2"><Badge bg="success">Company</Badge></p>
              </div>
              <div className="mb-2">
                <small className="text-muted">Email</small>
                <p className="mb-0 text-break">{user?.email}</p>
              </div>
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-info">
            <Card.Body>
              <h6 className="fw-bold mb-2 text-info">
                <i className="bi bi-lightbulb me-2"></i> Tips for Success
              </h6>
              <ul className="list-unstyled small">
                <li className="mb-2">✓ Complete all company information to attract top talent</li>
                <li className="mb-2">✓ Write a compelling company description</li>
                <li className="mb-2">✓ Keep contact information up to date</li>
                <li>✓ Regularly update your internship opportunities</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CompanyProfile;
