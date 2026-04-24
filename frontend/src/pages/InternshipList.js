import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Button, Badge, Form, Alert } from 'react-bootstrap';
import '../styles/internshiplist.css';

const DOMAINS = [
  {
    id: 'fullstack',
    icon: '💻',
    title: 'Full Stack Development (MERN Stack)',
    color: '#4361ee',
    skills: ['HTML, CSS, JavaScript', 'React.js', 'Node.js & Express', 'MongoDB / SQL', 'API Development', 'Authentication & Authorization', 'Deployment (AWS)'],
  },
  {
    id: 'ai',
    icon: '🤖',
    title: 'Artificial Intelligence (AI) & Machine Learning',
    color: '#7209b7',
    skills: ['Machine Learning Fundamentals', 'Data Handling & Model Training', 'AI APIs Integration', 'Real-world AI use cases in web apps'],
  },
  {
    id: 'cloud',
    icon: '☁️',
    title: 'Cloud Computing (AWS / Azure / DevOps Basics)',
    color: '#f72585',
    skills: ['Cloud Fundamentals (AWS / Azure)', 'Hosting & Deployment', 'CI/CD Basics', 'Server Management', 'Scalability & Security Basics'],
  },
];

const BENEFITS = [
  { icon: '🏗️', text: 'Work on real client and in-house projects' },
  { icon: '🛠️', text: 'Learn modern tech stacks used in the industry' },
  { icon: '🧑‍🏫', text: 'Get mentorship from experienced developers' },
  { icon: '📁', text: 'Build a strong portfolio' },
  { icon: '🚀', text: 'Gain exposure to production environments' },
  { icon: '🏆', text: 'Receive an internship certificate on completion' },
];

const InternshipList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', college: '', year: '', branch: '', skills: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const required = ['fullName', 'email', 'phone', 'college', 'year', 'branch', 'skills'];
    const missing = required.filter(f => !formData[f].trim());
    if (missing.length > 0) {
      setError('Please fill in all required fields.');
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <div className="internship-page">
      {/* Hero Section */}
      <div className="internship-hero">
        <Container>
          <div className="hero-content text-center">
            <h1 className="hero-title">Internship Programs</h1>
            <p className="hero-subtitle">
              Hands-on learning with real projects, expert mentorship, and industry exposure
            </p>
            {(user?.role === 'company' || user?.role === 'admin') && (
              <Button
                variant="light"
                size="lg"
                className="mt-3"
                onClick={() => navigate('/internships/create')}
              >
                ➕ Post Internship
              </Button>
            )}
          </div>
        </Container>
      </div>

      {/* Domains Section */}
      <section className="internship-section">
        <Container>
          <h2 className="section-title text-center">Internship Domains</h2>
          <p className="section-subtitle text-center">We are currently offering internships in the following domains</p>
          <Row className="g-4 mt-2">
            {DOMAINS.map((domain) => (
              <Col md={4} key={domain.id}>
                <Card className="domain-card h-100" style={{ borderTop: `4px solid ${domain.color}` }}>
                  <Card.Body className="text-center p-4">
                    <div className="domain-icon" style={{ color: domain.color }}>{domain.icon}</div>
                    <h5 className="domain-title">{domain.title}</h5>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Why Join Section */}
      <section className="internship-section bg-light-custom">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <h2 className="section-title">Why Join Our Internship Program?</h2>
              <p className="text-muted mb-4">
                Our internship program is built for students and fresh graduates who want more than just theory.
              </p>
              <div className="benefits-list">
                {BENEFITS.map((b, i) => (
                  <div key={i} className="benefit-item">
                    <span className="benefit-icon">{b.icon}</span>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-muted fst-italic">
                This is a learning-first, growth-focused internship designed to help you transition into a professional developer.
              </p>
            </Col>
            <Col lg={6}>
              <div className="why-join-visual">
                <div className="visual-card">
                  <div className="visual-stat">
                    <span className="stat-number">3</span>
                    <span className="stat-label">Domains</span>
                  </div>
                  <div className="visual-stat">
                    <span className="stat-number">1–3</span>
                    <span className="stat-label">Months</span>
                  </div>
                  <div className="visual-stat">
                    <span className="stat-number">✅</span>
                    <span className="stat-label">Certificate</span>
                  </div>
                  <div className="visual-stat">
                    <span className="stat-number">🌐</span>
                    <span className="stat-label">Online / Offline</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Skills Section */}
      <section className="internship-section">
        <Container>
          <h2 className="section-title text-center">Skills You'll Gain</h2>
          <p className="section-subtitle text-center">Practical, industry-relevant skills across all domains</p>
          <Row className="g-4 mt-2">
            {DOMAINS.map((domain) => (
              <Col md={4} key={domain.id}>
                <Card className="skills-card h-100">
                  <Card.Header style={{ background: domain.color, color: '#fff' }}>
                    <span className="me-2">{domain.icon}</span>
                    {domain.title.split('(')[0].trim()}
                  </Card.Header>
                  <Card.Body>
                    <ul className="skills-list">
                      {domain.skills.map((skill, i) => (
                        <li key={i}>
                          <span className="skill-check">✓</span> {skill}
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Program Details */}
      <section className="internship-section bg-light-custom">
        <Container>
          <h2 className="section-title text-center">Program Details</h2>
          <Row className="justify-content-center mt-4">
            <Col md={8}>
              <Card className="details-card">
                <Card.Body>
                  <Row className="g-3">
                    {[
                      { icon: '⏱️', label: 'Duration', value: '1 – 3 Months' },
                      { icon: '🖥️', label: 'Mode', value: 'Offline / Online' },
                      { icon: '📅', label: 'Start Date', value: 'Rolling Admissions' },
                      { icon: '🏆', label: 'Certification', value: 'Yes (on successful completion)' },
                    ].map((d, i) => (
                      <Col sm={6} key={i}>
                        <div className="detail-item">
                          <span className="detail-icon">{d.icon}</span>
                          <div>
                            <div className="detail-label">{d.label}</div>
                            <div className="detail-value">{d.value}</div>
                          </div>
                        </div>
                      </Col>
                    ))}
                    <Col sm={12}>
                      <div className="detail-item">
                        <span className="detail-icon">🎓</span>
                        <div>
                          <div className="detail-label">Eligibility</div>
                          <div className="detail-value">Students · Fresh Graduates · Self-learners</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <p className="text-center mt-4 text-muted fw-semibold">
            Who Should Apply: BCA / BSC CS / BE / MCA / Diploma in CS
          </p>
        </Container>
      </section>

      {/* Application Form */}
      <section className="internship-section">
        <Container>
          <h2 className="section-title text-center">Apply for Internship</h2>
          <p className="section-subtitle text-center">Fill out the form below to apply for this internship</p>
          <Row className="justify-content-center mt-4">
            <Col md={8} lg={6}>
              {submitted ? (
                <Alert variant="success" className="text-center p-4">
                  <h5>🎉 Application Submitted!</h5>
                  <p className="mb-0">Thank you for applying. We'll get back to you soon.</p>
                </Alert>
              ) : (
                <Card className="apply-card">
                  <Card.Body className="p-4">
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                      <Row className="g-3">
                        <Col sm={6}>
                          <Form.Group>
                            <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group>
                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group>
                            <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
                            <Form.Control name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXXXXXXX" />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group>
                            <Form.Label>College <span className="text-danger">*</span></Form.Label>
                            <Form.Control name="college" value={formData.college} onChange={handleChange} placeholder="College name" />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group>
                            <Form.Label>Year <span className="text-danger">*</span></Form.Label>
                            <Form.Select name="year" value={formData.year} onChange={handleChange}>
                              <option value="">Select year</option>
                              <option>1st Year</option>
                              <option>2nd Year</option>
                              <option>3rd Year</option>
                              <option>4th Year</option>
                              <option>Graduate</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group>
                            <Form.Label>Course / Branch <span className="text-danger">*</span></Form.Label>
                            <Form.Control name="branch" value={formData.branch} onChange={handleChange} placeholder="e.g. BCA, BE CS" />
                          </Form.Group>
                        </Col>
                        <Col sm={12}>
                          <Form.Group>
                            <Form.Label>Your Skills <span className="text-danger">*</span></Form.Label>
                            <Form.Control as="textarea" rows={3} name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. React, Node.js, Python..." />
                          </Form.Group>
                        </Col>
                        <Col sm={12}>
                          <Button type="submit" variant="primary" size="lg" className="w-100 apply-btn">
                            Submit Application
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="internship-section bg-light-custom">
        <Container>
          <h2 className="section-title text-center">Need Help?</h2>
          <p className="section-subtitle text-center">Have questions about the internship? Feel free to reach out.</p>
          <Row className="justify-content-center g-4 mt-2">
            <Col md={4} className="text-center">
              <div className="contact-card">
                <div className="contact-icon">📧</div>
                <div className="contact-label">Email</div>
                <a href="mailto:internships@nighan2.com" className="contact-value">internships@nighan2.com</a>
              </div>
            </Col>
            <Col md={4} className="text-center">
              <div className="contact-card">
                <div className="contact-icon">💬</div>
                <div className="contact-label">WhatsApp</div>
                <a href="https://wa.me/917483127180" className="contact-value" target="_blank" rel="noreferrer">+91 7483127180</a>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default InternshipList;
