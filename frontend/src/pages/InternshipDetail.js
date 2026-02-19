import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Form, ListGroup, Modal } from 'react-bootstrap';

const InternshipDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState({ resumeFile: null, coverLetter: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchInternshipDetail();
    if (user?.role === 'company' || user?.role === 'admin') {
      fetchApplications();
    }
  }, [id, user]);

  const fetchInternshipDetail = async () => {
    try {
      const response = await apiService.getInternshipById(id);
      setInternship(response.data);
    } catch (error) {
      setError('Failed to fetch internship details');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await apiService.getInternshipApplications(id);
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications');
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    // Validate resume file
    if (!formData.resumeFile) {
      setError('Please upload a resume file');
      setSubmitting(false);
      return;
    }

    if (!formData.coverLetter.trim()) {
      setError('Please write a cover letter');
      setSubmitting(false);
      return;
    }

    try {
      // Create FormData for file upload
      const data = new FormData();
      data.append('internshipId', id);
      data.append('resume', formData.resumeFile);
      data.append('coverLetter', formData.coverLetter);

      await apiService.submitApplication(data);
      setSuccess('Application submitted successfully! ✅');
      setFormData({ resumeFile: null, coverLetter: '' });
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      setTimeout(() => navigate('/MyApplications'), 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplicationStatus = async (applicationId, status) => {
    try {
      await apiService.updateApplicationStatus(applicationId, status);
      fetchApplications();
    } catch (error) {
      setError('Failed to update application status');
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await apiService.deleteInternship(id);
      navigate('/company-home');
    } catch (error) {
      setError('Failed to delete internship');
      setDeleting(false);
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

  if (error && !internship) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {internship && (
        <>
          {/* Internship Details Card */}
          <Row className="mb-4">
            <Col lg={8}>
              <Card className="shadow-sm border-0 mb-4">
                <Card.Header className="bg-primary text-white border-0">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h2 className="mb-2 fw-bold">{internship.title}</h2>
                      <p className="mb-0 text-white-50">Posted by Company</p>
                    </div>
                    <Badge bg={internship.status === 'open' ? 'success' : 'danger'} className="fs-6">
                      {internship.status === 'open' ? '✓ Open' : '✗ Closed'}
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  {error && <Alert variant="danger">{error}</Alert>}

                  {/* Key Details */}
                  <Row className="mb-4">
                    <Col md={6} className="mb-3">
                      <p className="text-muted small mb-1">📍 Location</p>
                      <p className="fw-bold fs-5">{internship.location}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <p className="text-muted small mb-1">⏱️ Duration</p>
                      <p className="fw-bold fs-5">{internship.duration} months</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <p className="text-muted small mb-1">💰 Monthly Stipend</p>
                      <p className="fw-bold fs-5">${internship.stipend}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <p className="text-muted small mb-1">📅 Start Date</p>
                      <p className="fw-bold fs-5">{internship.startDate || 'Not specified'}</p>
                    </Col>
                  </Row>

                  <hr className="my-4" />

                  {/* Required Skills */}
                  <div className="mb-4">
                    <p className="text-muted small mb-2">🎯 Required Skills</p>
                    <div className="d-flex flex-wrap gap-2">
                      {internship.skills &&
                        internship.skills.split(',').map((skill, index) => (
                          <Badge key={index} bg="light" text="dark" className="px-3 py-2">
                            {skill.trim()}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  <hr className="my-4" />

                  {/* Description */}
                  <div>
                    <h5 className="fw-bold mb-3">📝 About This Internship</h5>
                    <p className="text-muted" style={{ lineHeight: '1.8' }}>
                      {internship.description}
                    </p>
                  </div>
                </Card.Body>
              </Card>

              {/* Student Application Form */}
              {user?.role === 'student' && internship.status === 'open' && (
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-success text-white border-0">
                    <h5 className="mb-0 fw-bold">📋 Apply for this Internship</h5>
                  </Card.Header>
                  <Card.Body>
                    {success && <Alert variant="success">{success}</Alert>}

                    <Form onSubmit={handleApply}>
                      {error && <Alert variant="danger">{error}</Alert>}

                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">📄 Upload Resume (PDF or DOC)</Form.Label>
                        <Form.Control
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Validate file size (5MB max)
                              if (file.size > 5 * 1024 * 1024) {
                                setError('File size must be less than 5MB');
                                return;
                              }
                              setFormData({ ...formData, resumeFile: file });
                              setError('');
                            }
                          }}
                          required
                        />
                        <Form.Text className="text-muted">
                          Supported formats: PDF, DOC, DOCX (Max 5MB)
                        </Form.Text>
                        {formData.resumeFile && (
                          <div className="mt-2">
                            <Badge bg="info">
                              ✓ {formData.resumeFile.name}
                            </Badge>
                          </div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">Cover Letter</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          value={formData.coverLetter}
                          onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                          placeholder="Tell us why you're interested in this internship..."
                          required
                        />
                      </Form.Group>

                      <div className="d-grid gap-2">
                        <Button
                          variant="success"
                          type="submit"
                          size="lg"
                          disabled={submitting}
                          className="fw-bold"
                        >
                          {submitting ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" className="me-2" />
                              Submitting...
                            </>
                          ) : (
                            '🚀 Submit Application'
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              )}
            </Col>

            {/* Company Actions Sidebar */}
            {(user?.role === 'company' || user?.role === 'admin') && (
              <Col lg={4}>
                <Card className="shadow-sm border-0 mb-4 bg-light">
                  <Card.Body>
                    <h5 className="fw-bold mb-3">⚙️ Actions</h5>
                    <div className="d-grid gap-2">
                      <Link to={`/internships/${id}/edit`} className="text-decoration-none">
                        <Button variant="info" className="w-100 fw-bold">
                          ✏️ Edit Internship
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        onClick={() => setShowDeleteModal(true)}
                        className="fw-bold"
                      >
                        🗑️ Delete Internship
                      </Button>
                      <Link to="/company-home" className="text-decoration-none">
                        <Button variant="outline-secondary" className="w-100 fw-bold">
                          ← Back to Dashboard
                        </Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>

          {/* Applications Section */}
          {(user?.role === 'company' || user?.role === 'admin') && (
            <Row>
              <Col lg={12}>
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-warning text-dark border-0">
                    <h5 className="mb-0 fw-bold">📋 Student Applications ({applications.length})</h5>
                  </Card.Header>
                  <Card.Body>
                    {applications.length === 0 ? (
                      <p className="text-muted text-center py-4">No applications yet. Check back soon!</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Student Name</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {applications.map((app) => (
                              <tr key={app.id}>
                                <td className="fw-bold">{app.fullName}</td>
                                <td>{app.email}</td>
                                <td>{app.phone}</td>
                                <td>
                                  <Badge
                                    bg={
                                      app.status === 'accepted'
                                        ? 'success'
                                        : app.status === 'rejected'
                                        ? 'danger'
                                        : 'warning'
                                    }
                                  >
                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                  </Badge>
                                </td>
                                <td>
                                  {app.status === 'pending' && (
                                    <div className="d-flex gap-2">
                                      <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handleApplicationStatus(app.id, 'accepted')}
                                        className="fw-bold"
                                      >
                                        ✓ Accept
                                      </Button>
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleApplicationStatus(app.id, 'rejected')}
                                        className="fw-bold"
                                      >
                                        ✕ Reject
                                      </Button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0 bg-danger text-white">
          <Modal.Title className="fw-bold">Delete Internship</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            Are you sure you want to delete this internship? This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default InternshipDetail;
