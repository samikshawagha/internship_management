import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Alert, ListGroup } from 'react-bootstrap';
import { dummyCompanyDashboardData, dummyCompanyTeamMembers, dummyPerformanceEvaluations, dummyCompanyLeaves } from '../utils/dummyData';
import '../styles/companyhome.css';

const CompanyHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(dummyCompanyDashboardData.summary);
  const [dashboardData] = useState(dummyCompanyDashboardData);
  const [teamMembers] = useState(dummyCompanyTeamMembers);
  const [pendingLeaves] = useState(dummyCompanyLeaves.filter(l => l.status === 'pending'));
  const [performanceData] = useState(dummyPerformanceEvaluations);

  const companyFeatures = [
    {
      icon: '�',
      title: 'Browse Internships',
      description: 'View and manage all internship postings',
      action: () => navigate('/internships'),
      color: 'primary'
    },
    {
      icon: '➕',
      title: 'Post Internship',
      description: 'Create and manage internship opportunities',
      action: () => navigate('/internships/create'),
      color: 'success'
    },
    {
      icon: '👥',
      title: 'Applications',
      description: 'Review and manage student applications',
      action: () => navigate('/internships'),
      color: 'info'
    },
    {
      icon: '📊',
      title: 'Reports',
      description: 'Review reports from your interns',
      action: () => navigate('/reports'),
      color: 'warning'
    },
    {
      icon: '👤',
      title: 'My Profile',
      description: 'Manage your account and settings',
      action: () => navigate('/company-profile'),
      color: 'secondary'
    },
    {
      icon: '⚙️',
      title: 'Settings',
      description: 'Configure company preferences',
      action: () => alert('Settings coming soon!'),
      color: 'dark'
    }
  ];

  const recentActivity = [
    { type: 'application', message: 'New application from Alice Johnson', time: '2 hours ago', icon: '📝' },
    { type: 'report', message: 'Bob Smith submitted a progress report', time: '1 day ago', icon: '📊' },
    { type: 'internship', message: 'Your Data Science internship is now open', time: '1 day ago', icon: '🎉' },
    { type: 'application', message: 'Carol Davis applied for Data Science Internship', time: '2 days ago', icon: '📝' },
  ];

  const benefits = [
    {
      icon: '🎓',
      title: 'Quality Talent',
      description: 'Access vetted student candidates with relevant skills'
    },
    {
      icon: '💰',
      title: 'Cost-Effective',
      description: 'Find affordable talent for short-term projects'
    },
    {
      icon: '📈',
      title: 'Team Growth',
      description: 'Identify potential full-time employees from interns'
    },
    {
      icon: '🚀',
      title: 'Quick Onboarding',
      description: 'Streamlined process from posting to hiring'
    },
    {
      icon: '🤝',
      title: 'Network Building',
      description: 'Build relationships with talented students and universities'
    },
    {
      icon: '📊',
      title: 'Data Insights',
      description: 'Track application trends and hiring analytics'
    }
  ];

  return (
    <Container fluid className="company-home py-5" style={{ backgroundColor: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
          {/* Welcome Section */}
          <div className="welcome-section mb-5">
            <Row className="align-items-center">
              <Col md={8}>
                <h1 className="fw-bold mb-3" style={{ fontSize: '2.8rem', color: '#1a1a2e' }}>
                  🏢 Welcome Back, {user?.fullName}!
                </h1>
                <p className="fs-5 text-muted mb-4">
                  Manage your internship program, review applications, and connect with talented students.
                </p>
                <div className="d-flex gap-2 flex-wrap">
                  <Button 
                    variant="success" 
                    size="lg"
                    className="fw-bold"
                    onClick={() => navigate('/internships/create')}
                    style={{ borderRadius: '10px' }}
                  >
                    ➕ Post New Internship
                  </Button>
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="fw-bold"
                    onClick={() => navigate('/internships')}
                    style={{ borderRadius: '10px' }}
                  >
                    🔍 Browse Internships
                  </Button>
                </div>
              </Col>
              <Col md={4} className="text-center">
                <Badge bg="info" className="badge-xl" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                  🌟 Trusted by 180+ Companies
                </Badge>
              </Col>
            </Row>
          </div>

          {/* Quick Stats */}
          <Row className="mb-5 g-4">
            <Col sm={6} lg={3}>
              <Card className="stat-card border-0 shadow-sm" style={{ borderRadius: '15px', backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Card.Body className="text-center">
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
                  <p className="mb-2 small">Active Internships</p>
                  <h3 className="fw-bold mb-0">{stats.totalInternships}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6} lg={3}>
              <Card className="stat-card border-0 shadow-sm" style={{ borderRadius: '15px', backgroundImage: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <Card.Body className="text-center">
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
                  <p className="mb-2 small">Active Interns</p>
                  <h3 className="fw-bold mb-0">{stats.activeInterns}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6} lg={3}>
              <Card className="stat-card border-0 shadow-sm" style={{ borderRadius: '15px', backgroundImage: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                <Card.Body className="text-center">
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
                  <p className="mb-2 small">Completed</p>
                  <h3 className="fw-bold mb-0">{stats.completedInternships}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6} lg={3}>
              <Card className="stat-card border-0 shadow-sm" style={{ borderRadius: '15px', backgroundImage: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
                <Card.Body className="text-center">
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐</div>
                  <p className="mb-2 small">Avg Performance</p>
                  <h3 className="fw-bold mb-0">{stats.averagePerformance}/5.0</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Quick Actions */}
          <div className="mb-5">
            <h2 className="fw-bold mb-4" style={{ color: '#1a1a2e' }}>🚀 Quick Actions</h2>
            <Row className="g-4">
              {companyFeatures.map((feature, index) => (
                <Col sm={6} lg={4} key={index}>
                  <Card 
                    className="feature-card border-0 shadow-sm h-100 cursor-pointer"
                    onClick={feature.action}
                    style={{ 
                      borderRadius: '15px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Card.Body className="text-center">
                      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                        {feature.icon}
                      </div>
                      <h5 className="fw-bold mb-2" style={{ color: '#1a1a2e' }}>
                        {feature.title}
                      </h5>
                      <p className="text-muted small mb-3">
                        {feature.description}
                      </p>
                      <Button 
                        variant={feature.color}
                        size="sm"
                        className="fw-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          feature.action();
                        }}
                        style={{ borderRadius: '8px' }}
                      >
                        Go →
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Active Team Members */}
          <div className="mb-5">
            <h2 className="fw-bold mb-4" style={{ color: '#1a1a2e' }}>👥 Active Team Members</h2>
            <Row className="g-4">
              {teamMembers.filter(m => m.status === 'active').map((member) => (
                <Col lg={6} key={member.id}>
                  <Card className="border-0 shadow-sm" style={{ borderRadius: '15px', transition: 'all 0.3s' }} 
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="fw-bold mb-1">{member.name}</h6>
                          <small className="text-muted">{member.internshipTitle}</small>
                        </div>
                        <Badge bg="success">{member.status}</Badge>
                      </div>
                      <Row className="g-3 mt-2">
                        <Col xs={6}>
                          <small className="text-muted">Performance</small>
                          <div className="progress" style={{ height: '8px' }}>
                            <div className="progress-bar" style={{ width: `${(member.performanceScore / 5) * 100}%`, backgroundColor: '#667eea' }}></div>
                          </div>
                          <small className="fw-bold">{member.performanceScore}/5.0 ⭐</small>
                        </Col>
                        <Col xs={6}>
                          <small className="text-muted">Attendance</small>
                          <div className="progress" style={{ height: '8px' }}>
                            <div className="progress-bar" style={{ width: `${member.attendancePercentage}%`, backgroundColor: '#28a745' }}></div>
                          </div>
                          <small className="fw-bold">{member.attendancePercentage}%</small>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Pending Leave Requests */}
          {pendingLeaves.length > 0 && (
            <div className="mb-5">
              <h2 className="fw-bold mb-4" style={{ color: '#1a1a2e' }}>📝 Pending Leave Requests ({pendingLeaves.length})</h2>
              <Row className="g-4">
                {pendingLeaves.map((leave) => (
                  <Col lg={6} key={leave.id}>
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '15px', borderLeft: '5px solid #ffc107' }}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="fw-bold mb-1">{leave.studentName}</h6>
                            <Badge bg="warning" className="text-dark">{leave.leaveType}</Badge>
                          </div>
                          <Button size="sm" variant="success" className="fw-bold">Approve</Button>
                        </div>
                        <small className="text-muted d-block mb-2">
                          📅 {leave.startDate} to {leave.endDate}
                        </small>
                        <small className="text-muted">
                          💬 {leave.reason}
                        </small>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* Recent Activity */}
          <Row className="mb-5 g-4">
            <Col lg={6}>
              <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                <Card.Header className="bg-light border-bottom py-3">
                  <h5 className="mb-0 fw-bold">� Recent Applications</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {dashboardData.recentApplications.map((app, index) => (
                    <div
                      key={index}
                      className="p-3 border-bottom d-flex gap-3 align-items-start justify-content-between"
                      style={{ transition: 'all 0.3s' }}
                    >
                      <div className="flex-grow-1">
                        <p className="mb-1 fw-bold small">{app.studentName}</p>
                        <small className="text-muted">{app.position} • {app.university}</small>
                      </div>
                      <Badge bg={app.status === 'new' ? 'primary' : app.status === 'reviewing' ? 'warning' : 'info'}>
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>

            {/* Upcoming Events */}
            <Col lg={6}>
              <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                <Card.Header className="bg-light border-bottom py-3">
                  <h5 className="mb-0 fw-bold">📅 Upcoming Events</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {dashboardData.upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 border-bottom d-flex gap-3 align-items-start"
                    >
                      <div style={{ fontSize: '1.5rem' }}>
                        {event.type === 'meeting' ? '🤝' : event.type === 'review' ? '⭐' : '📊'}
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-1 fw-bold small">{event.title}</p>
                        <small className="text-muted">{event.date} at {event.time}</small>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts & Analytics Section */}
          <div className="mb-5">
            <h2 className="fw-bold mb-4" style={{ color: '#1a1a2e' }}>📊 Performance & Analytics</h2>
            <Row className="g-4">
              {/* Hiring Performance */}
              <Col lg={6}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                  <Card.Header className="bg-light border-bottom py-3">
                    <h5 className="mb-0 fw-bold">📈 Hiring Performance</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-2">
                        <small className="fw-bold">Applications Processed</small>
                        <small className="text-muted">80%</small>
                      </div>
                      <div className="progress" style={{ height: '10px', borderRadius: '5px' }}>
                        <div 
                          className="progress-bar" 
                          style={{ width: '80%', backgroundColor: '#667eea' }}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-2">
                        <small className="fw-bold">Acceptance Rate</small>
                        <small className="text-muted">65%</small>
                      </div>
                      <div className="progress" style={{ height: '10px', borderRadius: '5px' }}>
                        <div 
                          className="progress-bar" 
                          style={{ width: '65%', backgroundColor: '#84fab0' }}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-2">
                        <small className="fw-bold">Internship Completion</small>
                        <small className="text-muted">92%</small>
                      </div>
                      <div className="progress" style={{ height: '10px', borderRadius: '5px' }}>
                        <div 
                          className="progress-bar" 
                          style={{ width: '92%', backgroundColor: '#20c997' }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="d-flex justify-content-between mb-2">
                        <small className="fw-bold">Report Submission</small>
                        <small className="text-muted">75%</small>
                      </div>
                      <div className="progress" style={{ height: '10px', borderRadius: '5px' }}>
                        <div 
                          className="progress-bar" 
                          style={{ width: '75%', backgroundColor: '#ffc107' }}
                        />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Application Distribution */}
              <Col lg={6}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                  <Card.Header className="bg-light border-bottom py-3">
                    <h5 className="mb-0 fw-bold">👥 Application Distribution</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row className="text-center">
                      <Col sm={6} className="mb-3">
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📥</div>
                        <p className="text-muted small mb-1">Pending</p>
                        <h4 className="fw-bold mb-0" style={{ color: '#ffc107' }}>8</h4>
                      </Col>
                      <Col sm={6} className="mb-3">
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
                        <p className="text-muted small mb-1">Approved</p>
                        <h4 className="fw-bold mb-0" style={{ color: '#28a745' }}>14</h4>
                      </Col>
                      <Col sm={6} className="mb-3">
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>❌</div>
                        <p className="text-muted small mb-1">Rejected</p>
                        <h4 className="fw-bold mb-0" style={{ color: '#dc3545' }}>2</h4>
                      </Col>
                      <Col sm={6} className="mb-3">
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏳</div>
                        <p className="text-muted small mb-1">In Review</p>
                        <h4 className="fw-bold mb-0" style={{ color: '#17a2b8' }}>6</h4>
                      </Col>
                    </Row>
                    <hr />
                    <div className="text-center">
                      <small className="text-muted">Total Applications: 24</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Key Metrics */}
            <Row className="g-4 mt-0">
              <Col lg={12}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                  <Card.Header className="bg-light border-bottom py-3">
                    <h5 className="mb-0 fw-bold">📌 Key Metrics Overview</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col sm={6} md={3} className="mb-3">
                        <div style={{ textAlign: 'center' }}>
                          <p className="text-muted small mb-2">Avg. Applications/Internship</p>
                          <h3 className="fw-bold mb-0" style={{ color: '#667eea' }}>4.8</h3>
                        </div>
                      </Col>
                      <Col sm={6} md={3} className="mb-3">
                        <div style={{ textAlign: 'center' }}>
                          <p className="text-muted small mb-2">Time to Hire</p>
                          <h3 className="fw-bold mb-0" style={{ color: '#f093fb' }}>12 days</h3>
                        </div>
                      </Col>
                      <Col sm={6} md={3} className="mb-3">
                        <div style={{ textAlign: 'center' }}>
                          <p className="text-muted small mb-2">Offer Acceptance Rate</p>
                          <h3 className="fw-bold mb-0" style={{ color: '#84fab0' }}>78%</h3>
                        </div>
                      </Col>
                      <Col sm={6} md={3} className="mb-3">
                        <div style={{ textAlign: 'center' }}>
                          <p className="text-muted small mb-2">Intern Satisfaction</p>
                          <h3 className="fw-bold mb-0" style={{ color: '#ffa502' }}>4.6/5 ⭐</h3>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Performance Evaluations Summary */}
          <div className="mb-5">
            <h2 className="fw-bold mb-4" style={{ color: '#1a1a2e' }}>⭐ Recent Performance Evaluations</h2>
            <Row className="g-4">
              {performanceData.slice(0, 2).map((eval_) => (
                <Col lg={6} key={eval_.id}>
                  <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="fw-bold mb-1">{eval_.studentName}</h6>
                          <small className="text-muted">{eval_.internshipTitle}</small>
                        </div>
                        <Badge bg={eval_.technicalSkills >= 4.5 ? 'success' : eval_.technicalSkills >= 3.5 ? 'warning' : 'danger'}>
                          {eval_.technicalSkills}/5.0 ⭐
                        </Badge>
                      </div>
                      <div className="row g-2">
                        <div className="col-6">
                          <small className="text-muted d-block">Technical</small>
                          <small className="fw-bold">{eval_.technicalSkills}</small>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">Communication</small>
                          <small className="fw-bold">{eval_.communication}</small>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">Teamwork</small>
                          <small className="fw-bold">{eval_.teamwork}</small>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">Punctuality</small>
                          <small className="fw-bold">{eval_.punctuality}</small>
                        </div>
                      </div>
                      <Button size="sm" variant="outline-primary" className="mt-3 fw-bold w-100" onClick={() => navigate('/company-performance')}>
                        View All Evaluations →
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Benefits Section */}
          <div className="benefits-section mb-5">
            <h2 className="fw-bold mb-4 text-center" style={{ color: '#1a1a2e' }}>
              ✨ Why Use InternHub?
            </h2>
            <Row className="g-4">
              {benefits.map((benefit, index) => (
                <Col sm={6} lg={4} key={index}>
                  <div 
                    className="benefit-card p-4 rounded"
                    style={{ 
                      backgroundColor: '#fff',
                      border: '2px solid #e9ecef',
                      borderRadius: '15px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#667eea';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e9ecef';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                      {benefit.icon}
                    </div>
                    <h6 className="fw-bold mb-2">{benefit.title}</h6>
                    <p className="text-muted small mb-0">{benefit.description}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* Call to Action */}
          <Row className="cta-section">
            <Col md={12}>
              <div 
                className="p-5 rounded text-center"
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '15px',
                  color: '#fff'
                }}
              >
                <h2 className="fw-bold mb-3">🚀 Ready to Find Your Ideal Intern?</h2>
                <p className="mb-4" style={{ fontSize: '1.1rem' }}>
                  Post your first internship opportunity today and connect with talented students
                </p>
                <Button 
                  variant="light" 
                  size="lg"
                  className="fw-bold"
                  onClick={() => navigate('/internships/create')}
                  style={{ borderRadius: '10px' }}
                >
                  ➕ Post Internship Now
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
  );
};

export default CompanyHome;
