import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Badge, ProgressBar, Table } from 'react-bootstrap';
import '../styles/performance.css';

const MyPerformance = () => {
  const { user } = useAuth();
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  // Mock data
  const [evaluations] = useState([
    {
      id: 1,
      internshipTitle: 'Frontend Development Internship',
      evaluatorName: 'John Doe',
      evaluatedDate: '2026-02-18',
      technicalSkills: 4.5,
      communication: 4.0,
      teamwork: 4.5,
      punctuality: 5.0,
      proactiveness: 4.0,
      comments: 'Excellent work on the React components. Shows great potential in frontend development. Communication could be improved in team meetings.'
    },
    {
      id: 2,
      internshipTitle: 'Data Analysis Internship',
      evaluatorName: 'Jane Smith',
      evaluatedDate: '2026-01-28',
      technicalSkills: 3.8,
      communication: 3.5,
      teamwork: 4.0,
      punctuality: 4.5,
      proactiveness: 3.8,
      comments: 'Good performance with SQL queries. Could improve on problem-solving skills. Keep working on data visualization.'
    }
  ]);

  const [overallScore] = useState({
    avgTechnicalSkills: 4.15,
    avgCommunication: 3.75,
    avgTeamwork: 4.25,
    avgPunctuality: 4.75,
    avgProactiveness: 3.9,
    overallScore: 4.16
  });

  const getScoreBadge = (score) => {
    if (score >= 4.5) return 'success';
    if (score >= 3.5) return 'warning';
    return 'danger';
  };

  const getScoreColor = (score) => {
    if (score >= 4.5) return '#28a745';
    if (score >= 3.5) return '#ffc107';
    return '#dc3545';
  };

  return (
    <Container fluid className="performance-page py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <Row className="mb-5">
        <Col>
          <h1 className="fw-bold mb-2" style={{ color: '#1a1a2e' }}>
            ⭐ My Performance Evaluations
          </h1>
          <p className="text-muted">View your performance ratings and feedback from supervisors</p>
        </Col>
      </Row>

      {/* Overall Performance */}
      <Row className="mb-5 g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <Card.Header className="bg-light border-bottom py-3">
              <h5 className="mb-0 fw-bold">📊 Overall Performance Score</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4 className="mb-0">Overall Rating</h4>
                  <h3 className="mb-0 fw-bold" style={{ color: '#667eea' }}>
                    {overallScore.overallScore}/5.0 ⭐
                  </h3>
                </div>
                <ProgressBar 
                  now={(overallScore.overallScore / 5) * 100} 
                  style={{ height: '12px', borderRadius: '6px' }}
                  className="bg-gradient"
                />
              </div>

              <Row className="g-4">
                <Col md={6}>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <small className="fw-bold">Technical Skills</small>
                      <tiny className="text-muted">{overallScore.avgTechnicalSkills}</tiny>
                    </div>
                    <ProgressBar 
                      now={(overallScore.avgTechnicalSkills / 5) * 100}
                      variant={getScoreBadge(overallScore.avgTechnicalSkills)}
                      style={{ height: '8px' }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <small className="fw-bold">Communication</small>
                      <tiny className="text-muted">{overallScore.avgCommunication}</tiny>
                    </div>
                    <ProgressBar 
                      now={(overallScore.avgCommunication / 5) * 100}
                      variant={getScoreBadge(overallScore.avgCommunication)}
                      style={{ height: '8px' }}
                    />
                  </div>
                </Col>
              </Row>

              <Row className="g-4">
                <Col md={6}>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <small className="fw-bold">Teamwork</small>
                      <tiny className="text-muted">{overallScore.avgTeamwork}</tiny>
                    </div>
                    <ProgressBar 
                      now={(overallScore.avgTeamwork / 5) * 100}
                      variant={getScoreBadge(overallScore.avgTeamwork)}
                      style={{ height: '8px' }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <small className="fw-bold">Punctuality</small>
                      <tiny className="text-muted">{overallScore.avgPunctuality}</tiny>
                    </div>
                    <ProgressBar 
                      now={(overallScore.avgPunctuality / 5) * 100}
                      variant={getScoreBadge(overallScore.avgPunctuality)}
                      style={{ height: '8px' }}
                    />
                  </div>
                </Col>
              </Row>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <small className="fw-bold">Proactiveness</small>
                  <tiny className="text-muted">{overallScore.avgProactiveness}</tiny>
                </div>
                <ProgressBar 
                  now={(overallScore.avgProactiveness / 5) * 100}
                  variant={getScoreBadge(overallScore.avgProactiveness)}
                  style={{ height: '8px' }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <Card.Header className="bg-light border-bottom py-3">
              <h5 className="mb-0 fw-bold">📈 Statistics</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                <div style={{ fontSize: '3rem', color: '#667eea' }} className="fw-bold">
                  {evaluations.length}
                </div>
                <small className="text-muted">Total Evaluations</small>
              </div>
              <hr />
              <div className="mb-2">
                <p className="small mb-1"><strong>Last Evaluation:</strong></p>
                <p className="text-muted small">{evaluations[0]?.evaluatedDate}</p>
              </div>
              <div>
                <p className="small mb-1"><strong>Evaluator:</strong></p>
                <p className="text-muted small">{evaluations[0]?.evaluatorName}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Detailed Evaluations */}
      <h3 className="fw-bold mb-4" style={{ color: '#1a1a2e' }}>📋 Detailed Evaluations</h3>
      <Row className="g-4">
        {evaluations.map((evaluation) => (
          <Col lg={6} key={evaluation.id}>
            <Card 
              className="border-0 shadow-sm evaluation-card" 
              style={{ borderRadius: '12px', cursor: 'pointer' }}
              onClick={() => setSelectedEvaluation(selectedEvaluation?.id === evaluation.id ? null : evaluation)}
            >
              <Card.Header className="bg-light border-bottom py-3">
                <h6 className="mb-0 fw-bold">{evaluation.internshipTitle}</h6>
                <small className="text-muted">Evaluated by {evaluation.evaluatorName} on {evaluation.evaluatedDate}</small>
              </Card.Header>
              <Card.Body>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <small className="text-muted">Technical Skills</small>
                    <div className="fw-bold" style={{ color: getScoreColor(evaluation.technicalSkills) }}>
                      {evaluation.technicalSkills}/5.0 ⭐
                    </div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Communication</small>
                    <div className="fw-bold" style={{ color: getScoreColor(evaluation.communication) }}>
                      {evaluation.communication}/5.0 ⭐
                    </div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Teamwork</small>
                    <div className="fw-bold" style={{ color: getScoreColor(evaluation.teamwork) }}>
                      {evaluation.teamwork}/5.0 ⭐
                    </div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Punctuality</small>
                    <div className="fw-bold" style={{ color: getScoreColor(evaluation.punctuality) }}>
                      {evaluation.punctuality}/5.0 ⭐
                    </div>
                  </div>
                </div>

                {selectedEvaluation?.id === evaluation.id && (
                  <>
                    <hr />
                    <div className="mb-3">
                      <small className="text-muted fw-bold">Proactiveness</small>
                      <div className="fw-bold" style={{ color: getScoreColor(evaluation.proactiveness) }}>
                        {evaluation.proactiveness}/5.0 ⭐
                      </div>
                    </div>
                    <div>
                      <small className="text-muted fw-bold">Evaluator Comments</small>
                      <p className="small mt-2 mb-0 text-muted">{evaluation.comments}</p>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {evaluations.length === 0 && (
        <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <Card.Body className="p-5 text-center">
            <p className="text-muted">📭 No evaluations yet. Your supervisors will add performance evaluations during your internship.</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default MyPerformance;
