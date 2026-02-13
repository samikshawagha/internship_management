import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { Container, Form, Button, Card, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';

const EditInternship = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    duration: '',
    stipend: '',
    skills: '',
    startDate: '',
    status: 'open',
    logo: null,
    logoFile: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInternshipDetail();
  }, [id]);

  const fetchInternshipDetail = async () => {
    try {
      setLoading(true);
      const response = await apiService.getInternshipById(id);
      setFormData({
        ...response.data,
        logoFile: null
      });
    } catch (error) {
      setError('Failed to fetch internship details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (2MB max for images)
      if (file.size > 2 * 1024 * 1024) {
        setError('Logo file size must be less than 2MB');
        return;
      }
      setFormData({ ...formData, logoFile: file });
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title || !formData.description || !formData.location || !formData.duration) {
      setError('Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    try {
      // Create FormData for multipart/form-data submission if there's a new logo
      if (formData.logoFile) {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('location', formData.location);
        data.append('duration', formData.duration);
        data.append('stipend', formData.stipend);
        data.append('skills', formData.skills);
        data.append('startDate', formData.startDate);
        data.append('status', formData.status);
        data.append('logo', formData.logoFile);

        await apiService.updateInternshipWithImage(id, data);
      } else {
        // Regular JSON update if no image
        await apiService.updateInternship(id, formData);
      }
      setSuccess('Internship updated successfully! ✅');
      setTimeout(() => navigate('/company-dashboard'), 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update internship');
    } finally {
      setSubmitting(false);
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
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-info text-white border-0">
              <h2 className="mb-0 fw-bold">✏️ Edit Internship</h2>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Title */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Internship Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Full Stack Developer, Data Analyst"
                    required
                  />
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the internship, responsibilities, and what students will learn..."
                    required
                  />
                </Form.Group>

                {/* Location */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Location *</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., New York, Remote, Hybrid"
                    required
                  />
                </Form.Group>

                {/* Duration */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Duration (in months) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g., 3, 6"
                    min="1"
                    max="12"
                    required
                  />
                </Form.Group>

                {/* Stipend */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Monthly Stipend ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="stipend"
                    value={formData.stipend}
                    onChange={handleChange}
                    placeholder="e.g., 2000"
                    step="100"
                    min="0"
                  />
                </Form.Group>

                {/* Skills */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Required Skills</Form.Label>
                  <Form.Control
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g., React, Node.js, MongoDB (comma-separated)"
                  />
                </Form.Group>

                {/* Start Date */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Status */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </Form.Select>
                </Form.Group>

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  <Button
                    variant="info"
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="fw-bold"
                  >
                    {submitting ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Saving...
                      </>
                    ) : (
                      '💾 Save Changes'
                    )}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/company-dashboard')}
                    className="fw-bold"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditInternship;
