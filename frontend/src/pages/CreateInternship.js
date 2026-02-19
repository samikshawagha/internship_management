import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { Container, Form, Button, Card, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';

const CreateInternship = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    duration: '',
    stipend: '',
    skills: '',
    startDate: '',
    logoFile: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title || !formData.description || !formData.location || !formData.duration) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Create FormData for multipart/form-data submission
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('duration', formData.duration);
      data.append('stipend', formData.stipend);
      data.append('skills', formData.skills);
      data.append('startDate', formData.startDate);
      if (formData.logoFile) {
        data.append('logo', formData.logoFile);
      }

      await apiService.createInternshipWithImage(data);
      setSuccess('Internship created successfully! 🎉');
      setFormData({
        title: '',
        description: '',
        location: '',
        duration: '',
        stipend: '',
        skills: '',
        startDate: '',
        logoFile: null
      });
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      setTimeout(() => navigate('/company-home'), 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create internship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white border-0">
              <h2 className="mb-0 fw-bold">💼 Post New Internship</h2>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Company Logo */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">🏢 Company Logo (Optional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp"
                    onChange={handleFileChange}
                  />
                  <Form.Text className="text-muted">
                    Supported formats: JPG, PNG, GIF, WebP (Max 2MB)
                  </Form.Text>
                  {formData.logoFile && (
                    <div className="mt-2">
                      <Badge bg="info">
                        ✓ {formData.logoFile.name}
                      </Badge>
                    </div>
                  )}
                </Form.Group>

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

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="fw-bold"
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Posting...
                      </>
                    ) : (
                      '🚀 Post Internship'
                    )}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/company-home')}
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

export default CreateInternship;
