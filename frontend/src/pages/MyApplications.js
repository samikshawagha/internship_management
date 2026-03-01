import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { crudService } from '../services/crudService';
import { apiService } from '../services/apiService';
import {
  Container, Row, Col, Card, Button, Badge, Form, Table, Alert, Spinner, Modal
} from 'react-bootstrap';
import '../styles/myapplications.css';

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [internships, setInternships] = useState([]);
  const [applicationForm, setApplicationForm] = useState({ internshipId: '', coverLetter: '' });
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadApplications();
    loadInternships();
    // check URL for status query
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (status) setFilterStatus(status);
  }, [user?.id]);

  const navigateToSelfWithFilter = (status) => {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.set('status', status);
    navigate(`/my-applications?${params.toString()}`);
    setFilterStatus(status);
  };

  useEffect(() => {
    filterApplications();
  }, [applications, filterStatus, searchTerm]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await crudService.getStudentApplications(user?.id);
      setApplications(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadInternships = async () => {
    try {
      const res = await apiService.getInternships();
      setInternships(res.data);
    } catch (err) {
      try {
        const res = await crudService.getInternships();
        setInternships(res.data);
      } catch (err2) {
        console.error('Failed to load internships', err2);
      }
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(app =>
        app.internshipTitle.toLowerCase().includes(search) ||
        app.company.toLowerCase().includes(search)
      );
    }

    // Sort by date
    filtered.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

    setFilteredApplications(filtered);
  };

  const handleWithdraw = async () => {
    if (!selectedApp) return;

    try {
      await crudService.deleteApplication(selectedApp.id);
      setSuccess('Application withdrawn successfully!');
      setShowWithdrawModal(false);
      loadApplications();
    } catch (err) {
      setError('Failed to withdraw application');
    }
  };

  const handleOpenApply = () => {
    setApplicationForm({ internshipId: internships[0]?.id || '', coverLetter: '' });
    setShowApplyModal(true);
  };

  const handleCreateApplication = async () => {
    if (!applicationForm.internshipId) return setError('Please select an internship');
    try {
      const internship = internships.find(i => i.id === parseInt(applicationForm.internshipId));
      await crudService.createApplication({
        studentId: user.id,
        internshipId: parseInt(applicationForm.internshipId),
        internshipTitle: internship.title,
        company: internship.company,
        coverLetter: applicationForm.coverLetter || ''
      });
      setShowApplyModal(false);
      setSuccess('Application submitted successfully');
      loadApplications();
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    }
  };

  const handleOpenEdit = (app) => {
    setSelectedApp(app);
    setApplicationForm({ internshipId: app.internshipId, coverLetter: app.coverLetter || '' });
    setShowEditModal(true);
  };

  const handleUpdateApplication = async () => {
    if (!selectedApp) return;
    try {
      await crudService.updateApplication(selectedApp.id, { coverLetter: applicationForm.coverLetter });
      setShowEditModal(false);
      setSuccess('Application updated successfully');
      loadApplications();
    } catch (err) {
      setError(err.message || 'Failed to update application');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      accepted: 'success',
      rejected: 'danger'
    };
    const icons = {
      pending: '⏳',
      accepted: '✅',
      rejected: '❌'
    };
    return { variant: variants[status] || 'secondary', icon: icons[status] || '📌' };
  };

  const getStatusStats = () => {
    return {
      total: applications.length,
      pending: applications.filter(a => a.status === 'pending').length,
      accepted: applications.filter(a => a.status === 'accepted').length,
      rejected: applications.filter(a => a.status === 'rejected').length
    };
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  const stats = getStatusStats();

  return (
    <Container fluid className="py-5 applications-container">
      <Container>
        {/* Header */}
        <Row className="mb-5 align-items-center">
          <Col md={8}>
            <h1 className="display-6 fw-bold mb-0">📋 My Applications</h1>
            <p className="text-muted mt-2">Manage and track all your internship applications</p>
          </Col>
        </Row>

        {/* Alerts */}
        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

        {/* Statistics Cards */}
        <Row className="mb-5 g-3">
          <Col md={6} lg={3}>
            <Card className="stat-card h-100 shadow-sm border-0" style={{ cursor: 'pointer' }} onClick={() => { setFilterStatus('all'); navigateToSelfWithFilter('all'); }}>
              <Card.Body className="text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <h3 className="stat-number">{stats.total}</h3>
                <p className="stat-label mb-0">Total Applications</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="stat-card h-100 shadow-sm border-0" style={{ cursor: 'pointer' }} onClick={() => { setFilterStatus('pending'); navigateToSelfWithFilter('pending'); }}>
              <Card.Body className="text-white" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                <h3 className="stat-number">{stats.pending}</h3>
                <p className="stat-label mb-0">Pending ⏳</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="stat-card h-100 shadow-sm border-0" style={{ cursor: 'pointer' }} onClick={() => { setFilterStatus('accepted'); navigateToSelfWithFilter('accepted'); }}>
              <Card.Body className="text-white" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                <h3 className="stat-number">{stats.accepted}</h3>
                <p className="stat-label mb-0">Accepted ✅</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="stat-card h-100 shadow-sm border-0">
              <Card.Body className="text-white" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                <h3 className="stat-number">{stats.rejected}</h3>
                <p className="stat-label mb-0">Rejected ❌</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-4 g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-bold">Search</Form.Label>
              <Form.Control
                placeholder="Search by position or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-bold">Filter by Status</Form.Label>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" onClick={handleOpenApply}>➕ Apply to Internship</Button>
        </div>

        {/* Applications Table */}
        {filteredApplications.length > 0 ? (
          <Card className="applications-card shadow-sm border-0">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table striped hover className="mb-0 applications-table">
                  <thead className="table-dark">
                    <tr>
                      <th>Position</th>
                      <th>Company</th>
                      <th>Status</th>
                      <th>Applied On</th>
                      <th>Last Updated</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map(app => {
                      const statusInfo = getStatusBadge(app.status);
                      return (
                        <tr key={app.id} className="application-row">
                          <td className="fw-bold">{app.internshipTitle}</td>
                          <td>{app.company}</td>
                          <td>
                            <Badge bg={statusInfo.variant}>
                              {statusInfo.icon} {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                          </td>
                          <td><small className="text-muted">{app.appliedDate}</small></td>
                          <td><small className="text-muted">{app.updatedDate}</small></td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button 
                                variant="info" 
                                size="sm"
                                onClick={() => alert(`Application Details:\n\nPosition: ${app.internshipTitle}\nCompany: ${app.company}\nStatus: ${app.status}\nCover Letter: ${app.coverLetter}`)}
                              >
                                View
                              </Button>
                              {app.status === 'pending' && (
                                <>
                                  <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(app)}>Edit</Button>
                                  <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedApp(app);
                                      setShowWithdrawModal(true);
                                    }}
                                  >
                                    Withdraw
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        ) : (
          <Alert variant="info" className="text-center py-5">
            <h5>No applications found</h5>
            <p className="mb-0">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'You haven\'t applied to any internships yet. Browse and apply now!'}
            </p>
          </Alert>
        )}
      </Container>

      {/* Withdraw Modal */}
      <Modal show={showWithdrawModal} onHide={() => setShowWithdrawModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Withdraw Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to withdraw your application for:</p>
          <Card className="bg-light border-0">
            <Card.Body>
              <p className="mb-1"><strong>Position:</strong> {selectedApp?.internshipTitle}</p>
              <p className="mb-0"><strong>Company:</strong> {selectedApp?.company}</p>
            </Card.Body>
          </Card>
          <p className="mt-3 text-muted small">This action cannot be undone. You can reapply later if needed.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWithdrawModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleWithdraw}>
            Yes, Withdraw Application
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Apply Modal */}
      <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Apply to Internship</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Internship *</Form.Label>
              <Form.Select value={applicationForm.internshipId} onChange={(e) => setApplicationForm({ ...applicationForm, internshipId: e.target.value })}>
                <option value="">Select an internship</option>
                {internships.map(i => (
                  <option key={i.id} value={i.id}>{i.title} — {i.company}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cover Letter</Form.Label>
              <Form.Control as="textarea" rows={4} value={applicationForm.coverLetter} onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApplyModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCreateApplication}>Submit Application</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Application Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Internship</Form.Label>
              <Form.Control value={internships.find(i => i.id === applicationForm.internshipId)?.title || ''} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cover Letter</Form.Label>
              <Form.Control as="textarea" rows={4} value={applicationForm.coverLetter} onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdateApplication}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyApplications;
