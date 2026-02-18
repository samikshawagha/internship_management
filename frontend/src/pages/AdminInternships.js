import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
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
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';

const AdminInternships = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [validationError, setValidationError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    duration: '',
    stipend: '',
    skills: '',
    requirements: '',
    startDate: '',
    endDate: '',
    status: 'open',
  });

  useEffect(() => {
    if (user) loadInternships();
  }, [user?.role]);

  const loadInternships = async () => {
    try {
      setLoading(true);
      try {
        // Admin should see all internships
        if (user?.role === 'admin') {
          const response = await apiService.getAllInternships();
          setInternships(response.data);
        } else {
          const response = await apiService.getInternships();
          setInternships(response.data);
        }
      } catch (apiErr) {
        const response = await crudService.getInternships();
        setInternships(response.data);
      }
    } catch (err) {
      setError('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredInternships = () => {
    let filtered = [...internships];
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(i => i.status === filterStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(i =>
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleEdit = (selectedInternship) => {
    setEditingInternship(selectedInternship);
    setFormData({
      title: selectedInternship.title,
      description: selectedInternship.description,
      company: selectedInternship.company,
      location: selectedInternship.location,
      duration: selectedInternship.duration,
      stipend: selectedInternship.stipend,
      skills: selectedInternship.skills.join(', '),
      requirements: selectedInternship.requirements,
      startDate: selectedInternship.startDate,
      endDate: selectedInternship.endDate,
      status: selectedInternship.status,
    });
    setShowModal(true);
    setValidationError('');
  };

  const handleDelete = async (internshipId) => {
    if (window.confirm('Are you sure you want to delete this internship? This action cannot be undone.')) {
      try {
        try {
          await apiService.deleteInternship(internshipId);
        } catch (apiErr) {
          await crudService.deleteInternship(internshipId);
        }
        loadInternships();
      } catch (err) {
        setError('Failed to delete internship');
      }
    }
  };

  const handleCreate = () => {
    setEditingInternship(null);
    setFormData({
      title: '',
      description: '',
      company: '',
      location: '',
      duration: '',
      stipend: '',
      skills: '',
      requirements: '',
      startDate: '',
      endDate: '',
      status: 'open',
    });
    setShowModal(true);
    setValidationError('');
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.company.trim()) {
      setValidationError('Please fill in required fields');
      return;
    }

    try {
      const data = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      };

      if (editingInternship) {
        try {
          await apiService.updateInternship(editingInternship.id, data);
        } catch (apiErr) {
          await crudService.updateInternship(editingInternship.id, data);
        }
      } else {
        try {
          await apiService.createInternship(data);
        } catch (apiErr) {
          await crudService.createInternship(data);
        }
      }
      
      setShowModal(false);
      setEditingInternship(null);
      setFormData({
        title: '',
        description: '',
        company: '',
        location: '',
        duration: '',
        stipend: '',
        skills: '',
        requirements: '',
        startDate: '',
        endDate: '',
        status: 'open',
      });
      loadInternships();
    } catch (err) {
      setValidationError(err.message || 'Failed to save internship');
    }
  };

  const filteredInternships = getFilteredInternships();

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
              💼 Manage Internships
            </h1>
            <p className="text-muted fs-5 mb-0">
              Create, view, edit, and delete internship postings
            </p>
          </Col>
          <Col md={4} className="text-end d-none d-md-block">
            <Button variant="success" onClick={handleCreate} className="me-2">
              <FaPlus /> New Internship
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </Form.Select>
            </Col>
            <Col md={3} className="text-end">
              <div className="d-flex gap-2 justify-content-end">
                <Badge bg="primary">{filteredInternships.length} Results</Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Internships Table */}
      <Card className="border-0">
        {filteredInternships.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-muted mb-0">No internships found</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Duration</th>
                  <th>Stipend</th>
                  <th>Applicants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInternships.map((internship) => (
                  <tr key={internship.id}>
                    <td className="fw-bold">{internship.title}</td>
                    <td>{internship.company}</td>
                    <td>{internship.location}</td>
                    <td>{internship.duration}</td>
                    <td>{internship.stipend}</td>
                    <td>
                      <Badge bg="info">{internship.applicants || 0}</Badge>
                    </td>
                    <td>
                      <Badge bg={internship.status === 'open' ? 'success' : 'danger'}>
                        {internship.status === 'open' ? '🟢 Open' : '🔴 Closed'}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(internship)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(internship.id)}
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

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingInternship ? '✏️ Edit Internship' : '➕ Create New Internship'}
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
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter internship title"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company *</Form.Label>
                  <Form.Control
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Enter company name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Enter location"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter job description"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 3 months"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stipend</Form.Label>
                  <Form.Control
                    value={formData.stipend}
                    onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                    placeholder="e.g., $4,000/month"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Skills (comma-separated)</Form.Label>
              <Form.Control
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Requirements</Form.Label>
              <Form.Control
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Enter requirements"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Internship
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminInternships;
