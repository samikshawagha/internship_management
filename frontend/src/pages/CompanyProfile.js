import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Container, Form, Button, Alert, Tabs, Tab, Spinner } from 'react-bootstrap';
import '../styles/profile.css';

const CompanyProfile = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    industry: '',
    website: '',
    description: '',
    location: '',
    employees: ''
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiService.getProfile();
        if (res.data) {
          setProfile(prev => ({ ...prev, ...res.data }));
        }
      } catch (e) {
        console.error('load profile', e);
      }
    };
    load();
  }, []);

  const handleProfileChange = e => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = e => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const submitProfile = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.updateProfile(profile);
      setSuccess('Profile updated');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update');
    }
    setLoading(false);
  };

  const submitPassword = async e => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await apiService.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      setSuccess('Password changed');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    }
    setLoading(false);
  };

  return (
    <Container className="py-4 profile-page">
      <h2>Company Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Tabs defaultActiveKey="profile" id="company-profile-tabs" className="mb-3">
        <Tab eventKey="profile" title="Profile">
          <Form onSubmit={submitProfile} className="p-3">
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleProfileChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={profile.email} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                value={profile.companyName}
                onChange={handleProfileChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" className="me-2" /> : ''}
              Save Profile
            </Button>
          </Form>
        </Tab>
        <Tab eventKey="security" title="Security">
          <Form onSubmit={submitPassword} className="p-3">
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                name="current"
                value={passwords.current}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="new"
                value={passwords.new}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirm"
                value={passwords.confirm}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <Button variant="warning" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" className="me-2" /> : ''}
              Change Password
            </Button>
          </Form>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default CompanyProfile;
