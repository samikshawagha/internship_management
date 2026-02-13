import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const InternshipList = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [locationOptions, setLocationOptions] = useState([]);

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    filterInternships();
  }, [internships, searchTerm, locationFilter]);

  const fetchInternships = async () => {
    try {
      const response = await apiService.getInternships();
      setInternships(response.data);
      
      // Extract unique locations for filter
      const locations = [...new Set(response.data.map(i => i.location))];
      setLocationOptions(locations);
    } catch (error) {
      console.error('Error fetching internships:', error);
      setError('Failed to fetch internships');
    } finally {
      setLoading(false);
    }
  };

  const filterInternships = () => {
    let filtered = internships;

    // Filter by search term (title + description + skills)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        internship =>
          internship.title.toLowerCase().includes(term) ||
          internship.description.toLowerCase().includes(term) ||
          internship.skills.toLowerCase().includes(term)
      );
    }

    // Filter by location
    if (locationFilter) {
      filtered = filtered.filter(internship => internship.location === locationFilter);
    }

    // Filter to show only open internships
    filtered = filtered.filter(internship => internship.status === 'open');

    setFilteredInternships(filtered);
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

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <div className="mb-5">
        <h1 className="fw-bold text-dark mb-2">🔍 Explore Internships</h1>
        <p className="text-muted fs-5">
          Find the perfect internship opportunity for your career growth. 🚀
        </p>
      </div>

      {/* Search and Filters */}
      <Row className="mb-4 g-3">
        <Col md={8}>
          <InputGroup className="shadow-sm">
            <InputGroup.Text className="bg-white border-end-0">
              🔎
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by title, skills, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="shadow-sm"
          >
            <option value="">📍 All Locations</option>
            {locationOptions.map(location => (
              <option key={location} value={location}>
                📍 {location}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Results Count */}
      <div className="mb-3">
        <p className="text-muted">
          Found <strong>{filteredInternships.length}</strong> internship{filteredInternships.length !== 1 ? 's' : ''}
          {user?.role === 'student' ? ' open for applications' : ''}
        </p>
      </div>

      {/* Internship Cards */}
      {filteredInternships.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <h5 className="mb-2">No internships found</h5>
          <p className="mb-0">
            {searchTerm || locationFilter
              ? 'Try adjusting your search or filter criteria.'
              : 'Check back soon for new opportunities!'}
          </p>
        </Alert>
      ) : (
        <Row className="g-4">
          {filteredInternships.map((internship) => (
            <Col key={internship.id} md={6} lg={4}>
              <Card className="h-100 shadow-sm border-0 transition-card hover-shadow" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <Card.Body>
                  {/* Title and Status */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title fw-bold text-primary mb-0" style={{ fontSize: '1.1rem' }}>
                      {internship.title}
                    </h5>
                    <Badge bg="success" className="flex-shrink-0">
                      ✓ Open
                    </Badge>
                  </div>
                  
                  <hr className="my-3" />
                  
                  {/* Key Details */}
                  <div className="mb-3">
                    <p className="mb-2 small">
                      <span className="text-secondary me-2">📍</span>
                      <strong>{internship.location}</strong>
                    </p>
                    <p className="mb-2 small">
                      <span className="text-secondary me-2">⏱️</span>
                      <strong>{internship.duration}</strong> months
                    </p>
                    <p className="mb-2 small">
                      <span className="text-secondary me-2">💰</span>
                      <strong>${internship.stipend}</strong>/month
                    </p>
                  </div>
                  
                  {/* Skills */}
                  <div className="mb-3">
                    <p className="text-muted small mb-2"><strong>Skills:</strong></p>
                    <div className="d-flex flex-wrap gap-1">
                      {internship.skills
                        ? internship.skills.split(',').slice(0, 3).map((skill, index) => (
                            <Badge key={index} bg="light" text="dark" className="small">
                              {skill.trim()}
                            </Badge>
                          ))
                        : null}
                      {internship.skills && internship.skills.split(',').length > 3 && (
                        <Badge bg="light" text="dark" className="small">
                          +{internship.skills.split(',').length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Description Preview */}
                  <p className="text-secondary small mb-3" style={{ minHeight: '50px' }}>
                    {internship.description && internship.description.substring(0, 100)}
                    {internship.description && internship.description.length > 100 ? '...' : ''}
                  </p>
                  
                  {/* Action Button */}
                  <Link to={`/internships/${internship.id}`} className="text-decoration-none">
                    <Button variant="primary" className="w-100 fw-bold">
                      View Details & Apply →
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Call to Action for Company Users */}
      {user?.role === 'company' && (
        <Row className="mt-5">
          <Col lg={12}>
            <Card className="bg-light border-0 shadow-sm">
              <Card.Body className="text-center py-4">
                <h5 className="fw-bold mb-2">Want to post an internship?</h5>
                <p className="text-muted mb-3">Create a new opportunity for students to join your company.</p>
                <Link to="/internships/create" className="text-decoration-none">
                  <Button variant="success" size="lg">
                    ➕ Post New Internship
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default InternshipList;
