import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Badge, Table, Button, Alert, Spinner } from 'react-bootstrap';
import { dummyReports } from '../utils/dummyData';
import '../styles/reports.css';

const Reports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [internships, setInternships] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    internshipId: '',
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);

  useEffect(() => {
    if (user?.role === 'student') {
      // Use dummy data for demo
      setReports(dummyReports.filter(r => r.studentId === user.id) || dummyReports.slice(0, 3));
      setInternships([]);
      setLoading(false);
    } else if (user?.role === 'company') {
      // Use dummy reports for company view
      setReports(dummyReports);
      setInternships([]);
      setLoading(false);
    }
  }, [user]);

  const fetchStudentReports = async () => {
    try {
      const response = await apiService.getStudentReports();
      setReports(response.data);
    } catch (error) {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyInternships = async () => {
    try {
      const response = await apiService.getCompanyInternships();
      setInternships(response.data);
    } catch (error) {
      setError('Failed to fetch internships');
      setLoading(false);
    }
  };

  const fetchCompanyReports = async () => {
    try {
      const response = await apiService.getCompanyInternships();
      const allReports = [];
      
      for (const internship of response.data) {
        try {
          const reportsResponse = await apiService.getInternshipReports(internship.id);
          allReports.push(...reportsResponse.data);
        } catch (error) {
          console.log(`Failed to fetch reports for internship ${internship.id}`);
        }
      }
      
      setReports(allReports);
    } catch (error) {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedInternships = async () => {
    try {
      const response = await apiService.getStudentApplications();
      const approved = response.data.filter(app => app.status === 'approved');
      setInternships(approved);
    } catch (error) {
      console.error('Failed to fetch internships');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await apiService.submitReport(formData);
      setSuccess('Report submitted successfully!');
      setFormData({ internshipId: '', title: '', content: '' });
      setShowForm(false);
      fetchStudentReports();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      await apiService.updateReportStatus(reportId, newStatus);
      setSuccess(`Report ${newStatus} successfully!`);
      fetchCompanyReports();
    } catch (error) {
      setError('Failed to update report status');
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

  return (
    <Container fluid className="py-5 reports-page" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <Row className="mb-5">
        <Col md={8}>
          <h1 className="fw-bold mb-2" style={{ fontSize: '2.5rem', color: '#1a1a2e' }}>
            📊 {user?.role === 'student' ? 'My Reports' : 'Student Reports'}
          </h1>
          <p className="text-muted fs-5">
            {user?.role === 'student' 
              ? 'Track and manage your internship reports' 
              : 'Review and manage reports from your interns'}
          </p>
        </Col>
        <Col md={4} className="text-end">
          {user?.role === 'company' ? (
            <Badge bg="primary" className="badge-large" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              📋 {reports.length} Reports
            </Badge>
          ) : (
            <Badge bg="info" className="badge-large" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              {reports.length} {reports.length === 1 ? 'Report' : 'Reports'}
            </Badge>
          )}
        </Col>
      </Row>

      {/* Quick Stats for Company */}
      {user?.role === 'company' && (
        <Row className="mb-5 g-4">
          <Col sm={6} lg={3}>
            <Card className="border-0 shadow-sm text-center" style={{ borderRadius: '12px', backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <Card.Body className="py-4">
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
                <p className="small mb-2">Total Reports</p>
                <h3 className="fw-bold mb-0">{reports.length}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} lg={3}>
            <Card className="border-0 shadow-sm text-center" style={{ borderRadius: '12px', backgroundImage: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', color: 'white' }}>
              <Card.Body className="py-4">
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                <p className="small mb-2">Approved</p>
                <h3 className="fw-bold mb-0">{reports.filter(r => r.status === 'approved').length}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} lg={3}>
            <Card className="border-0 shadow-sm text-center" style={{ borderRadius: '12px', backgroundImage: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
              <Card.Body className="py-4">
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                <p className="small mb-2">Pending</p>
                <h3 className="fw-bold mb-0">{reports.filter(r => r.status === 'pending').length}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} lg={3}>
            <Card className="border-0 shadow-sm text-center" style={{ borderRadius: '12px', backgroundImage: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <Card.Body className="py-4">
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                <p className="small mb-2">Unique Students</p>
                <h3 className="fw-bold mb-0">{new Set(reports.map(r => r.studentId)).size}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

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

      {/* Student Report Form */}
      {user?.role === 'student' && (
        <Row className="mb-4">
          <Col md={12}>
            <Button
              variant={showForm ? 'danger' : 'success'}
              size="lg"
              className="fw-bold"
              style={{ borderRadius: '10px', padding: '0.75rem 2rem' }}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? '✕ Cancel' : '➕ Submit New Report'}
            </Button>
          </Col>
        </Row>
      )}

      {/* Report Submission Form */}
      {showForm && user?.role === 'student' && (
        <Row className="mb-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Header className="bg-light border-bottom py-3">
                <h5 className="mb-0 fw-bold">📝 Submit New Report</h5>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Internship *</label>
                    <select
                      name="internshipId"
                      value={formData.internshipId}
                      onChange={handleChange}
                      className="form-select form-select-lg"
                      required
                    >
                      <option value="">Select an internship</option>
                      {internships.map((app) => (
                        <option key={app.internshipId} value={app.internshipId}>
                          {app.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Report Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="form-control form-control-lg"
                      placeholder="Enter report title"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Report Content *</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      className="form-control form-control-lg"
                      rows="6"
                      placeholder="Write your report details..."
                      required
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      type="submit"
                      variant="success"
                      size="lg"
                      className="fw-bold"
                      disabled={submitting}
                    >
                      {submitting ? <Spinner animation="border" size="sm" className="me-2" /> : '📤'}
                      {submitting ? 'Submitting...' : 'Submit Report'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      size="lg"
                      className="fw-bold"
                      onClick={() => {
                        setShowForm(false);
                        setFormData({ internshipId: '', title: '', content: '' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Reports Table */}
      <Row>
        <Col md={12}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <Card.Header className="bg-light border-bottom py-3 d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.3rem' }}>📋</span>
              <h5 className="mb-0 fw-bold">
                {user?.role === 'student' ? 'Your Reports' : 'Student Reports'}
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {reports.length === 0 ? (
                <div className="text-center py-5 px-4">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                  <p className="text-muted mb-0">
                    {user?.role === 'student' 
                      ? 'No reports submitted yet.' 
                      : 'No reports received yet.'}
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="fw-700">Title</th>
                        {user?.role === 'company' && <th className="fw-700">Internship</th>}
                        {user?.role === 'company' && <th className="fw-700">Student</th>}
                        <th className="fw-700">Status</th>
                        <th className="fw-700">Date</th>
                        {user?.role === 'company' && <th className="fw-700 text-center">Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report) => (
                        <tr key={report.id} style={{ transition: 'all 0.3s ease' }}>
                          <td className="fw-bold text-primary">{report.title}</td>
                          {user?.role === 'company' && (
                            <td>{report.internshipTitle || 'N/A'}</td>
                          )}
                          {user?.role === 'company' && (
                            <td>{report.studentName || 'N/A'}</td>
                          )}
                          <td>
                            <Badge 
                              bg={report.status === 'pending' ? 'warning' : report.status === 'approved' ? 'success' : 'danger'}
                              className="badge-large"
                            >
                              {report.status === 'pending' ? '⏳ Pending' : report.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                            </Badge>
                          </td>
                          <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                          {user?.role === 'company' && report.status === 'pending' && (
                            <td className="text-center">
                              <div className="d-flex gap-2 justify-content-center">
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  className="fw-600"
                                  onClick={() => updateReportStatus(report.id, 'approved')}
                                >
                                  ✓ Approve
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  className="fw-600"
                                  onClick={() => updateReportStatus(report.id, 'rejected')}
                                >
                                  ✗ Reject
                                </Button>
                              </div>
                            </td>
                          )}
                          {user?.role === 'company' && report.status !== 'pending' && (
                            <td className="text-center">
                              <Badge bg="secondary">Reviewed</Badge>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
