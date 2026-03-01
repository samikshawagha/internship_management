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
import { FaEdit, FaTrash, FaPlus, FaSearch, FaEye } from 'react-icons/fa';

const AdminReports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [viewingReport, setViewingReport] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [validationError, setValidationError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    type: 'Performance',
    content: '',
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await crudService.getAllReports();
      setReports(response.data);
    } catch (err) {
      console.error('Failed to load admin reports:', err);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredReports = () => {
    let filtered = [...reports];
    
    if (filterType !== 'all') {
      filtered = filtered.filter(r => r.type === filterType);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleView = (report) => {
    setViewingReport(report);
    setShowModal(true);
    setValidationError('');
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setViewingReport(null);
    setFormData({
      title: String(report.title || ''),
      company: String(report.company || ''),
      type: String(report.type || 'Performance'),
      content: String(report.content || ''),
    });
    setShowModal(true);
    setValidationError('');
  };

  const handleCreate = () => {
    setEditingReport(null);
    setViewingReport(null);
    setFormData({
      title: '',
      company: '',
      type: 'Performance',
      content: '',
    });
    setShowModal(true);
    setValidationError('');
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await crudService.deleteReport(reportId);
        loadReports();
      } catch (err) {
        setError('Failed to delete report');
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.company.trim()) {
      setValidationError('Please fill in required fields');
      return;
    }

    try {
      if (editingReport) {
        await crudService.updateReport(editingReport.id, formData);
      } else {
        await crudService.createReport(formData);
      }
      
      setShowModal(false);
      setEditingReport(null);
      setViewingReport(null);
      setFormData({
        title: '',
        company: '',
        type: 'Performance',
        content: '',
      });
      loadReports();
    } catch (err) {
      setValidationError(err.message || 'Failed to save report');
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Performance':
        return 'primary';
      case 'Analytics':
        return 'success';
      case 'Compliance':
        return 'warning';
      case 'Feedback':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const filteredReports = getFilteredReports();

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
              📊 Manage Reports
            </h1>
            <p className="text-muted fs-5 mb-0">
              Create, view, edit, and manage system reports and analytics
            </p>
          </Col>
          <Col md={4} className="text-end d-none d-md-block">
            <Button variant="success" onClick={handleCreate} className="me-2">
              <FaPlus /> New Report
            </Button>
            <Button variant="primary" onClick={() => navigate('/admin-dashboard')}>
              ← Back
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
                  placeholder="Search by title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="Performance">📈 Performance</option>
                <option value="Analytics">📊 Analytics</option>
                <option value="Compliance">✅ Compliance</option>
                <option value="Feedback">💬 Feedback</option>
              </Form.Select>
            </Col>
            <Col md={3} className="text-end">
              <div className="d-flex gap-2 justify-content-end">
                <Badge bg="primary">{filteredReports.length} Reports</Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Reports Table */}
      <Card className="border-0">
        {filteredReports.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-muted mb-0">No reports found</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Created Date</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td className="fw-bold">{report.title}</td>
                    <td>{report.company}</td>
                    <td>
                      <Badge bg={getTypeColor(report.type)}>
                        {report.type}
                      </Badge>
                    </td>
                    <td>{report.createdDate}</td>
                    <td>{report.createdBy}</td>
                    <td>
                      <Button
                        variant="outline-info"
                        size="sm"
                        className="me-2"
                        onClick={() => handleView(report)}
                        title="View"
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(report)}
                        title="Edit"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(report.id)}
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

      {/* View Modal */}
      {viewingReport && showModal && !editingReport && (
        <Modal show={true} onHide={() => { setShowModal(false); setViewingReport(null); }} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>📊 Report Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3">
              <Col md={6}>
                <p><strong>Title:</strong></p>
                <p className="text-muted">{viewingReport.title}</p>
              </Col>
              <Col md={6}>
                <p><strong>Company:</strong></p>
                <p className="text-muted">{viewingReport.company}</p>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <p><strong>Type:</strong></p>
                <Badge bg={getTypeColor(viewingReport.type)}>{viewingReport.type}</Badge>
              </Col>
              <Col md={6}>
                <p><strong>Created Date:</strong></p>
                <p className="text-muted">{viewingReport.createdDate}</p>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <p><strong>Created By:</strong></p>
                <p className="text-muted">{viewingReport.createdBy}</p>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <p><strong>Content:</strong></p>
                <div className="p-3 bg-light rounded">
                  <p className="text-muted mb-0">{viewingReport.content}</p>
                </div>
              </Col>
            </Row>

            {viewingReport.metrics && (
              <Row className="mb-3">
                <Col md={12}>
                  <p><strong>Metrics:</strong></p>
                  <div className="p-3 bg-light rounded">
                    {Object.entries(viewingReport.metrics).map(([key, value]) => (
                      <Row key={key} className="mb-2">
                        <Col md={6}>
                          <small className="text-muted">{key.replace(/([A-Z])/g, ' $1')}:</small>
                        </Col>
                        <Col md={6}>
                          <small className="fw-bold">
                            {typeof value === 'object' ? JSON.stringify(value) : value}
                          </small>
                        </Col>
                      </Row>
                    ))}
                  </div>
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleEdit(viewingReport)}>
              Edit Report
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Edit Modal */}
      {showModal && !viewingReport && (
        <Modal show={true} onHide={() => { setShowModal(false); setEditingReport(null); }} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingReport ? '✏️ Edit Report' : '➕ Create New Report'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {validationError && (
              <Alert variant="danger">{validationError}</Alert>
            )}
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  value={String(formData.title || '')}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter report title"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company *</Form.Label>
                    <Form.Control
                      value={String(formData.company || '')}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Enter company name"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Report Type</Form.Label>
                    <Form.Select
                      value={String(formData.type || 'Performance')}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="Performance">📈 Performance</option>
                      <option value="Analytics">📊 Analytics</option>
                      <option value="Compliance">✅ Compliance</option>
                      <option value="Feedback">💬 Feedback</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Content *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={String(formData.content || '')}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter report content"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save Report
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default AdminReports;
