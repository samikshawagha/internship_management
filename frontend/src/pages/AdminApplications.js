import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { crudService } from '../services/crudService';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  Modal,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaEye } from 'react-icons/fa';

const AdminApplications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [viewingApplication, setViewingApplication] = useState(null);
  const [editingApplicationId, setEditingApplicationId] = useState(null);
  const [validationError, setValidationError] = useState('');
  
  const [formData, setFormData] = useState({
    status: 'pending',
  });

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await crudService.getAllApplications();
      setApplications(response.data);
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredApplications = () => {
    let filtered = [...applications];
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(a => a.status === filterStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleView = (application) => {
    setViewingApplication(application);
    setEditingApplicationId(application.id);
    setFormData({
      status: application.status,
    });
    setShowModal(true);
    setValidationError('');
  };

  const handleDelete = async (applicationId) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await crudService.deleteApplication(applicationId);
        loadApplications();
      } catch (err) {
        setError('Failed to delete application');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingApplicationId && formData.status !== viewingApplication.status) {
        await crudService.updateApplicationStatus(editingApplicationId, formData.status);
      }
      
      setShowModal(false);
      setViewingApplication(null);
      setEditingApplicationId(null);
      loadApplications();
    } catch (err) {
      setValidationError(err.message || 'Failed to update application');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '📋';
    }
  };

  const filteredApplications = getFilteredApplications();

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="py-5">
      {/* Header */}
      <div className="mb-4">
        <Row className="align-items-center">
          <Col md={8}>
            <h1 className="fw-bold mb-2" style={{ fontSize: '2.5rem', color: '#1a1a2e' }}>
              📋 Manage Applications
            </h1>
            <p className="text-muted fs-5 mb-0">
              Review and manage all internship applications
            </p>
          </Col>
          <Col md={4} className="text-end d-none d-md-block">
            <Button variant="primary" onClick={() => navigate('/admin-dashboard')}>
              ← Back to Dashboard
            </Button>
          </Col>
        </Row>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Search and Filter */}
      <Card className="mb-4 border-0">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text className="bg-white">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by student, internship, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">⏳ Pending</option>
                <option value="accepted">✅ Accepted</option>
                <option value="rejected">❌ Rejected</option>
              </Form.Select>
            </Col>
            <Col md={3} className="text-end">
              <div className="d-flex gap-2 justify-content-end">
                <Badge bg="primary">{filteredApplications.length} Applications</Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Statistics Cards */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="border-0 bg-light">
            <Card.Body className="text-center">
              <h5 className="text-muted mb-2">Pending</h5>
              <h3 className="fw-bold text-warning">
                {applications.filter(a => a.status === 'pending').length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 bg-light">
            <Card.Body className="text-center">
              <h5 className="text-muted mb-2">Accepted</h5>
              <h3 className="fw-bold text-success">
                {applications.filter(a => a.status === 'accepted').length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 bg-light">
            <Card.Body className="text-center">
              <h5 className="text-muted mb-2">Rejected</h5>
              <h3 className="fw-bold text-danger">
                {applications.filter(a => a.status === 'rejected').length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 bg-light">
            <Card.Body className="text-center">
              <h5 className="text-muted mb-2">Total</h5>
              <h3 className="fw-bold text-primary">
                {applications.length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Applications Table */}
      <Card className="border-0">
        {filteredApplications.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-muted mb-0">No applications found</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Internship</th>
                  <th>Company</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id}>
                    <td className="fw-bold">{application.studentName}</td>
                    <td>{application.internshipTitle}</td>
                    <td>{application.company}</td>
                    <td>{application.appliedDate}</td>
                    <td>
                      <Badge bg={getStatusColor(application.status)}>
                        {getStatusIcon(application.status)} {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-info"
                        size="sm"
                        className="me-2"
                        onClick={() => handleView(application)}
                        title="View & Edit"
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(application.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      {/* View/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📋 Application Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {validationError && (
            <Alert variant="danger">{validationError}</Alert>
          )}
          {viewingApplication && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>Student Name:</strong></p>
                  <p className="text-muted">{viewingApplication.studentName}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Applied Date:</strong></p>
                  <p className="text-muted">{viewingApplication.appliedDate}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>Internship Title:</strong></p>
                  <p className="text-muted">{viewingApplication.internshipTitle}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Company:</strong></p>
                  <p className="text-muted">{viewingApplication.company}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={12}>
                  <p><strong>Cover Letter:</strong></p>
                  <p className="text-muted">{viewingApplication.coverLetter}</p>
                </Col>
              </Row>

              <hr />

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Update Status:</strong></Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="accepted">✅ Accepted</option>
                    <option value="rejected">❌ Rejected</option>
                  </Form.Select>
                </Form.Group>
              </Form>

              <div className="alert alert-info">
                <small>Current Status: <Badge bg={getStatusColor(viewingApplication.status)}>
                  {getStatusIcon(viewingApplication.status)} {viewingApplication.status}
                </Badge></small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminApplications;
