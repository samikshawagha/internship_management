import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await apiService.getInternships();
      setInternships(response.data);
    } catch (error) {
      setError('Failed to fetch internships');
    } finally {
      setLoading(false);
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

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="mb-4">
        <h1 className="fw-bold text-dark mb-2">Available Internships</h1>
        <p className="text-muted">Explore amazing opportunities</p>
      </div>

      {internships.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <p className="mb-0 fs-5">No internships available at the moment. Check back soon!</p>
        </Alert>
      ) : (
        <Row className="g-4">
          {internships.map((internship) => (
            <Col key={internship.id} md={6} lg={4}>
              <Card className="h-100 shadow-sm border-0 transition-card" style={{ cursor: 'pointer' }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title fw-bold text-primary mb-0">{internship.title}</h5>
                    <Badge bg={internship.status === 'open' ? 'success' : 'danger'}>
                      {internship.status === 'open' ? '✓ Open' : '✗ Closed'}
                    </Badge>
                  </div>
                  
                  <p className="text-muted small mb-2">
                    <strong>Company:</strong> ID #{internship.companyId}
                  </p>
                  
                  <hr className="my-3" />
                  
                  <div className="mb-3">
                    <p className="mb-2">
                      <span className="text-secondary">📍</span> <strong>{internship.location}</strong>
                    </p>
                    <p className="mb-2">
                      <span className="text-secondary">⏱️</span> <strong>{internship.duration}</strong> months
                    </p>
                    <p className="mb-2">
                      <span className="text-secondary">💰</span> <strong>${internship.stipend}</strong> per month
                    </p>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-muted small mb-2"><strong>Required Skills:</strong></p>
                    <div className="d-flex flex-wrap gap-2">
                      {internship.skills &&
                        internship.skills.split(',').map((skill, index) => (
                          <Badge key={index} bg="light" text="dark">
                            {skill.trim()}
                          </Badge>
                        ))}
                    </div>
                  </div>
                  
                  <p className="text-secondary small mb-3">
                    {internship.description && internship.description.substring(0, 100)}
                    {internship.description && internship.description.length > 100 ? '...' : ''}
                  </p>
                  
                  <a href={`/internships/${internship.id}`}>
                    <Button variant="primary" className="w-100" size="sm">
                      View Details →
                    </Button>
                  </a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default InternshipList;
