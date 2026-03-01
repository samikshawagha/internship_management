import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { crudService } from '../services/crudService';
import { apiService } from '../services/apiService';
import {
  Container, Row, Col, Card, Button, Badge, Form, InputGroup,
  Pagination, Modal, Alert, Spinner
} from 'react-bootstrap';
import '../styles/internshiplist.css';

const InternshipList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSkills, setFilterSkills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('recent');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);

  const itemsPerPage = 6;

  // Load internships on mount
  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    try {
      setLoading(true);
      // Prefer backend API when available
      try {
        const response = await apiService.getInternships();
        setInternships(response.data);
      } catch (apiErr) {
        // Fallback to local mock service
        const response = await crudService.getInternships();
        setInternships(response.data);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load internships');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredInternships = internships.filter(internship => {
    const searchMatch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       internship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       internship.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = filterStatus === 'all' || internship.status === filterStatus;
    
    const skillsMatch = filterSkills.length === 0 || 
                       filterSkills.some(skill => internship.skills.includes(skill));
    
    return searchMatch && statusMatch && skillsMatch;
  });

  // Sort logic
  const sortedInternships = [...filteredInternships].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.postedDate) - new Date(a.postedDate);
      case 'stipend_high':
        return parseInt(b.stipend) - parseInt(a.stipend);
      case 'stipend_low':
        return parseInt(a.stipend) - parseInt(b.stipend);
      case 'applicants':
        return b.applicants - a.applicants;
      default:
        return 0;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedInternships.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInternships = sortedInternships.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async () => {
    if (!selectedInternship) return;
    
    try {
      try {
        await apiService.deleteInternship(selectedInternship.id);
      } catch (apiErr) {
        await crudService.deleteInternship(selectedInternship.id);
      }
      setSuccess('Internship deleted successfully!');
      setShowDeleteModal(false);
      loadInternships();
    } catch (err) {
      setError('Failed to delete internship');
    }
  };

  const toggleSkillFilter = (skill) => {
    setFilterSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
    setCurrentPage(1);
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

  return (
    <Container fluid className="py-5 internship-list-container">
      <Container>
        {/* Header */}
        <Row className="mb-5 align-items-center">
          <Col md={6}>
            <h1 className="display-6 fw-bold mb-0">
              📋 Internship Opportunities
            </h1>
            <p className="text-muted mt-2">
              {sortedInternships.length} internships available
            </p>
          </Col>
          <Col md={6} className="text-end">
            {(user?.role === 'company' || user?.role === 'admin') && (
              <Button
                variant="success"
                size="lg"
                onClick={() => navigate('/internships/create')}
                className="btn-create-internship"
              >
                ➕ Post Internship
              </Button>
            )}
          </Col>
        </Row>

        {/* Error/Success Messages */}
        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

        <Row className="mb-4">
          {/* Search Bar */}
          <Col lg={8} className="mb-3 mb-lg-0">
            <InputGroup size="lg" className="search-input-group">
              <InputGroup.Text className="search-icon">🔍</InputGroup.Text>
              <Form.Control
                placeholder="Search internships, companies, skills..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </InputGroup>
          </Col>

          {/* Sort Dropdown */}
          <Col lg={4}>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="recent">Most Recent</option>
              <option value="stipend_high">Highest Stipend</option>
              <option value="stipend_low">Lowest Stipend</option>
              <option value="applicants">Most Applied</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">Status</Form.Label>
              <Form.Select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={9}>
            <Form.Label className="fw-bold">Skills</Form.Label>
            <div className="skills-filter">
              {['React', 'Node.js', 'MongoDB', 'Python', 'AWS', 'Docker', 'JavaScript', 'TensorFlow'].map(skill => (
                <Badge
                  key={skill}
                  bg={filterSkills.includes(skill) ? 'primary' : 'secondary'}
                  style={{ cursor: 'pointer', marginRight: '5px', marginBottom: '5px' }}
                  onClick={() => toggleSkillFilter(skill)}
                  className="skill-badge"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </Col>
        </Row>

        {/* Internship Cards */}
        <Row>
          {paginatedInternships.length > 0 ? (
            paginatedInternships.map(internship => (
              <Col lg={6} key={internship.id} className="mb-4">
                <Card className="internship-card h-100 shadow-sm hover-shadow">
                  <Card.Body>
                    {/* Status Badge */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Badge bg={internship.status === 'open' ? 'success' : 'warning'}>
                        {internship.status?.toUpperCase()}
                      </Badge>
                      <small className="text-muted">
                        👥 {internship.applicants} applicants
                      </small>
                    </div>

                    {/* Title */}
                    <h5 className="card-title fw-bold mb-2">
                      {internship.title}
                    </h5>

                    {/* Company Info */}
                    <p className="text-primary mb-3">
                      🏢 {internship.company}
                    </p>

                    {/* Description */}
                    <p className="card-text text-muted mb-3">
                      {internship.description}
                    </p>

                    {/* Details Grid */}
                    <Row className="mb-3 text-sm">
                      <Col xs={6} className="mb-2">
                        <small className="text-muted">Location</small>
                        <br />
                        <small className="fw-bold">📍 {internship.location}</small>
                      </Col>
                      <Col xs={6} className="mb-2">
                        <small className="text-muted">Duration</small>
                        <br />
                        <small className="fw-bold">⏱️ {internship.duration}</small>
                      </Col>
                      <Col xs={6} className="mb-2">
                        <small className="text-muted">Stipend</small>
                        <br />
                        <small className="fw-bold text-success">💰 {internship.stipend}</small>
                      </Col>
                      <Col xs={6} className="mb-2">
                        <small className="text-muted">Start Date</small>
                        <br />
                        <small className="fw-bold">📅 {internship.startDate}</small>
                      </Col>
                    </Row>

                    {/* Skills */}
                    <div className="mb-3">
                      {internship.skills.slice(0, 3).map(skill => (
                        <Badge key={skill} bg="light" text="dark" className="me-1 mb-1">
                          {skill}
                        </Badge>
                      ))}
                      {internship.skills.length > 3 && (
                        <Badge bg="light" text="dark">
                          +{internship.skills.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={() => navigate(`/internships/${internship.id}`)}
                      >
                        View Details
                      </Button>

                      {(user?.role === 'company' || user?.role === 'admin') && (
                        <>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => navigate(`/internships/${internship.id}/edit`)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setSelectedInternship(internship);
                              setShowDeleteModal(true);
                            }}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col lg={12}>
              <Alert variant="info" className="text-center">
                <h5>No internships found</h5>
                <p>Try adjusting your filters or search terms</p>
              </Alert>
            </Col>
          )}
        </Row>

        {/* Pagination */}
        {totalPages > 1 && (
          <Row className="mt-5">
            <Col className="d-flex justify-content-center">
              <Pagination>
                <Pagination.First
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                />
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                />
                <Pagination.Last
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                />
              </Pagination>
            </Col>
          </Row>
        )}
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Internship</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedInternship?.title}</strong>?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default InternshipList;
