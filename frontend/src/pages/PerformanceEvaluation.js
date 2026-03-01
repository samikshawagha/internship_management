import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Badge, Button, Table, Modal, Form } from 'react-bootstrap';
import '../styles/companyadmin.css';

const PerformanceEvaluation = () => {
  const { user } = useAuth();
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Mock data
  const [evaluations] = useState([
    {
      id: 1,
      studentName: 'Alice Johnson',
      internship: 'Frontend Development',
      technicalSkills: 4.5,
      communication: 4.0,
      teamwork: 4.5,
      punctuality: 5.0,
      proactiveness: 4.0,
      evaluatedDate: '2026-02-18',
      comments: 'Excellent work on the React components. Shows great potential in frontend development.'
    },
    {
      id: 2,
      studentName: 'Bob Smith',
      internship: 'Data Science',
      technicalSkills: 3.8,
      communication: 3.5,
      teamwork: 4.0,
      punctuality: 4.5,
      proactiveness: 3.8,
      evaluatedDate: '2026-01-28',
      comments: 'Good performance with SQL queries. Could improve on problem-solving skills.'
    },
  ]);

  const [formData, setFormData] = useState({
    studentName: '',
    internship: '',
    technicalSkills: 3,
    communication: 3,
    teamwork: 3,
    punctuality: 3,
    proactiveness: 3,
    comments: ''
  });

  const getScoreColor = (score) => {
    if (score >= 4.5) return '#28a745';
    if (score >= 3.5) return '#ffc107';
    return '#dc3545';
  };

  const getAverage = (evaluation) => {
    return (
      (evaluation.technicalSkills +
        evaluation.communication +
        evaluation.teamwork +
        evaluation.punctuality +
        evaluation.proactiveness) / 5
    ).toFixed(2);
  };

  const handleOpenModal = (evaluation = null) => {
    if (evaluation) {
      setFormData({ ...evaluation });
      setEditingId(evaluation.id);
    } else {
      setFormData({
        studentName: '',
        internship: '',
        technicalSkills: 3,
        communication: 3,
        teamwork: 3,
        punctuality: 3,
        proactiveness: 3,
        comments: ''
      });
      setEditingId(null);
    }
    setShowEvaluationModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      alert('✓ Evaluation updated successfully!');
    } else {
      alert('✓ Evaluation created successfully!');
    }
    setShowEvaluationModal(false);
  };

  return (
    <Container fluid className="company-admin-page py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <Row className="mb-5">
        <Col md={8}>
          <h1 className="fw-bold mb-2" style={{ color: '#1a1a2e' }}>
            ⭐ Performance Evaluations
          </h1>
          <p className="text-muted">Create and manage performance evaluations for your interns</p>
        </Col>
        <Col md={4} className="text-end">
          <Button
            variant="success"
            size="lg"
            onClick={() => handleOpenModal()}
            className="fw-bold"
            style={{ borderRadius: '8px' }}
          >
            ➕ New Evaluation
          </Button>
        </Col>
      </Row>

      {/* Summary Stats */}
      <Row className="mb-5 g-4">
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm text-center" style={{ borderRadius: '12px' }}>
            <Card.Body className="py-4">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
              <p className="text-muted small mb-2">Total Interns</p>
              <h3 className="fw-bold mb-0">8</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm text-center" style={{ borderRadius: '12px' }}>
            <Card.Body className="py-4">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
              <p className="text-muted small mb-2">Evaluations Done</p>
              <h3 className="fw-bold mb-0">{evaluations.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm text-center" style={{ borderRadius: '12px' }}>
            <Card.Body className="py-4">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
              <p className="text-muted small mb-2">Pending</p>
              <h3 className="fw-bold mb-0">{8 - evaluations.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm text-center" style={{ borderRadius: '12px' }}>
            <Card.Body className="py-4">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
              <p className="text-muted small mb-2">Avg Rating</p>
              <h3 className="fw-bold mb-0" style={{ color: '#667eea' }}>4.1/5.0</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Evaluations Table */}
      <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
        <Card.Header className="bg-light border-bottom py-3">
          <h5 className="mb-0 fw-bold">📊 All Evaluations</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {evaluations.length > 0 ? (
            <Table responsive className="mb-0">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th className="py-3">Student Name</th>
                  <th className="py-3">Internship</th>
                  <th className="py-3">Tech Skills</th>
                  <th className="py-3">Communication</th>
                  <th className="py-3">Teamwork</th>
                  <th className="py-3">Punctuality</th>
                  <th className="py-3">Proactiveness</th>
                  <th className="py-3">Avg Score</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((evaluation) => (
                  <tr key={evaluation.id} className="border-bottom align-middle">
                    <td className="py-3">
                      <strong>{evaluation.studentName}</strong>
                    </td>
                    <td className="py-3">
                      <small className="text-muted">{evaluation.internship}</small>
                    </td>
                    <td className="py-3">
                      <div
                        className="badge"
                        style={{
                          backgroundColor: getScoreColor(evaluation.technicalSkills),
                          color: 'white'
                        }}
                      >
                        {evaluation.technicalSkills}
                      </div>
                    </td>
                    <td className="py-3">
                      <div
                        className="badge"
                        style={{
                          backgroundColor: getScoreColor(evaluation.communication),
                          color: 'white'
                        }}
                      >
                        {evaluation.communication}
                      </div>
                    </td>
                    <td className="py-3">
                      <div
                        className="badge"
                        style={{
                          backgroundColor: getScoreColor(evaluation.teamwork),
                          color: 'white'
                        }}
                      >
                        {evaluation.teamwork}
                      </div>
                    </td>
                    <td className="py-3">
                      <div
                        className="badge"
                        style={{
                          backgroundColor: getScoreColor(evaluation.punctuality),
                          color: 'white'
                        }}
                      >
                        {evaluation.punctuality}
                      </div>
                    </td>
                    <td className="py-3">
                      <div
                        className="badge"
                        style={{
                          backgroundColor: getScoreColor(evaluation.proactiveness),
                          color: 'white'
                        }}
                      >
                        {evaluation.proactiveness}
                      </div>
                    </td>
                    <td className="py-3">
                      <strong style={{ color: '#667eea' }}>
                        {getAverage(evaluation)} ⭐
                      </strong>
                    </td>
                    <td className="py-3">
                      <small className="text-muted">{evaluation.evaluatedDate}</small>
                    </td>
                    <td className="py-3">
                      <Button
                        size="sm"
                        variant="light"
                        className="me-2"
                        onClick={() => handleOpenModal(evaluation)}
                      >
                        Edit
                      </Button>
                      <Button size="sm" variant="light" className="text-danger">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="p-4 text-center text-muted">
              <p>No evaluations yet. Create one to get started.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Evaluation Modal */}
      <Modal show={showEvaluationModal} onHide={() => setShowEvaluationModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? '✏️ Edit Evaluation' : '➕ Create New Evaluation'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Student Name</Form.Label>
                  <Form.Select
                    value={formData.studentName}
                    onChange={(e) =>
                      setFormData({ ...formData, studentName: e.target.value })
                    }
                    disabled={editingId}
                  >
                    <option>Select student...</option>
                    <option>Alice Johnson</option>
                    <option>Bob Smith</option>
                    <option>Carol Davis</option>
                    <option>David Wilson</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Internship</Form.Label>
                  <Form.Select
                    value={formData.internship}
                    onChange={(e) =>
                      setFormData({ ...formData, internship: e.target.value })
                    }
                    disabled={editingId}
                  >
                    <option>Select internship...</option>
                    <option>Frontend Development</option>
                    <option>Backend Development</option>
                    <option>Data Science</option>
                    <option>UI/UX Design</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    Technical Skills (1-5)
                  </Form.Label>
                  <Form.Range
                    min="1"
                    max="5"
                    step="0.5"
                    value={formData.technicalSkills}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        technicalSkills: parseFloat(e.target.value)
                      })
                    }
                  />
                  <small className="text-muted">
                    Current: {formData.technicalSkills}
                  </small>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Communication (1-5)</Form.Label>
                  <Form.Range
                    min="1"
                    max="5"
                    step="0.5"
                    value={formData.communication}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        communication: parseFloat(e.target.value)
                      })
                    }
                  />
                  <small className="text-muted">
                    Current: {formData.communication}
                  </small>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Teamwork (1-5)</Form.Label>
                  <Form.Range
                    min="1"
                    max="5"
                    step="0.5"
                    value={formData.teamwork}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        teamwork: parseFloat(e.target.value)
                      })
                    }
                  />
                  <small className="text-muted">Current: {formData.teamwork}</small>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Punctuality (1-5)</Form.Label>
                  <Form.Range
                    min="1"
                    max="5"
                    step="0.5"
                    value={formData.punctuality}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        punctuality: parseFloat(e.target.value)
                      })
                    }
                  />
                  <small className="text-muted">
                    Current: {formData.punctuality}
                  </small>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Proactiveness (1-5)</Form.Label>
              <Form.Range
                min="1"
                max="5"
                step="0.5"
                value={formData.proactiveness}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    proactiveness: parseFloat(e.target.value)
                  })
                }
              />
              <small className="text-muted">
                Current: {formData.proactiveness}
              </small>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Provide detailed feedback and comments..."
                value={formData.comments}
                onChange={(e) =>
                  setFormData({ ...formData, comments: e.target.value })
                }
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 fw-bold"
              style={{ borderRadius: '8px' }}
            >
              {editingId ? '✓ Update Evaluation' : '✓ Create Evaluation'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PerformanceEvaluation;
