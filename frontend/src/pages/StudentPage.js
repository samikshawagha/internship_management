import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { crudService } from '../services/crudService';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Card, Button, Badge, Alert, 
  ListGroup, Modal, Form, Tabs, Tab, ProgressBar,
  Carousel, Spinner
} from 'react-bootstrap';
import { 
  FaBell, FaBookmark, FaCalendarAlt, FaChartLine, 
  FaGraduationCap, FaLightbulb, FaRocket, FaStar,
  FaTrophy, FaUsers, FaEye, FaHeart
} from 'react-icons/fa';

const StudentPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [savedInternships, setSavedInternships] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [studyGroups, setStudyGroups] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadStudentData();
  }, [user?.id]);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      
      // Load student applications for notifications
      const appsResponse = await crudService.getStudentApplications(user?.id);
      const applications = appsResponse.data;

      // Generate notifications based on application status
      const generatedNotifications = generateNotifications(applications);
      setNotifications(generatedNotifications);

      // Load internships for recommendations
      const internshipsResponse = await crudService.getInternships();
      const allInternships = internshipsResponse.data;
      
      // Generate recommendations based on user profile and applications
      const userRecommendations = generateRecommendations(allInternships, applications);
      setRecommendations(userRecommendations);

      // Generate upcoming deadlines
      const deadlines = generateUpcomingDeadlines(allInternships);
      setUpcomingDeadlines(deadlines);

      // Generate achievements
      const userAchievements = generateAchievements(applications);
      setAchievements(userAchievements);

      // Mock saved internships and study groups
      setSavedInternships(allInternships.slice(0, 3));
      setStudyGroups([
        { id: 1, name: 'React Developers', members: 45, topic: 'Frontend Development' },
        { id: 2, name: 'Data Science Club', members: 32, topic: 'Machine Learning' },
        { id: 3, name: 'Startup Founders', members: 28, topic: 'Entrepreneurship' }
      ]);

    } catch (error) {
      console.error('Failed to load student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNotifications = (applications) => {
    const notifications = [];
    const now = new Date();

    applications.forEach(app => {
      const appliedDate = new Date(app.appliedDate);
      const daysSince = Math.floor((now - appliedDate) / (1000 * 60 * 60 * 24));

      if (app.status === 'accepted') {
        notifications.push({
          id: `accepted-${app.id}`,
          type: 'success',
          title: 'Application Accepted! 🎉',
          message: `Congratulations! Your application for ${app.internshipTitle} at ${app.company} has been accepted.`,
          timestamp: app.updatedDate,
          priority: 'high',
          actionText: 'View Details',
          actionUrl: '/my-applications'
        });
      } else if (app.status === 'rejected') {
        notifications.push({
          id: `rejected-${app.id}`,
          type: 'info',
          title: 'Application Update',
          message: `Your application for ${app.internshipTitle} at ${app.company} was not selected. Keep applying!`,
          timestamp: app.updatedDate,
          priority: 'medium',
          actionText: 'Find Similar',
          actionUrl: '/internships'
        });
      } else if (app.status === 'pending' && daysSince > 14) {
        notifications.push({
          id: `pending-${app.id}`,
          type: 'warning',
          title: 'Application Pending',
          message: `Your application for ${app.internshipTitle} has been pending for ${daysSince} days.`,
          timestamp: app.appliedDate,
          priority: 'low',
          actionText: 'Follow Up',
          actionUrl: '/my-applications'
        });
      }
    });

    // Add system notifications
    notifications.push({
      id: 'profile-completion',
      type: 'info',
      title: 'Complete Your Profile',
      message: 'Add more details to your profile to increase your chances of getting hired.',
      timestamp: new Date().toISOString(),
      priority: 'medium',
      actionText: 'Update Profile',
      actionUrl: '/profile'
    });

    return notifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const generateRecommendations = (internships, applications) => {
    const appliedCompanies = applications.map(app => app.company);
    const appliedTitles = applications.map(app => app.internshipTitle.toLowerCase());

    return internships
      .filter(internship => 
        !appliedCompanies.includes(internship.company) &&
        internship.status === 'open'
      )
      .slice(0, 5)
      .map(internship => ({
        ...internship,
        matchScore: Math.floor(Math.random() * 30) + 70, // Mock match score
        reason: getRecommendationReason(internship, appliedTitles)
      }));
  };

  const getRecommendationReason = (internship, appliedTitles) => {
    const reasons = [
      'Based on your previous applications',
      'Matches your skill set',
      'Popular among students like you',
      'High acceptance rate',
      'Great company culture'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const generateUpcomingDeadlines = (internships) => {
    const now = new Date();
    return internships
      .filter(internship => {
        if (!internship.endDate) return false;
        const endDate = new Date(internship.endDate);
        const daysUntil = Math.floor((endDate - now) / (1000 * 60 * 60 * 24));
        return daysUntil > 0 && daysUntil <= 30;
      })
      .slice(0, 5)
      .map(internship => {
        const endDate = new Date(internship.endDate);
        const daysUntil = Math.floor((endDate - now) / (1000 * 60 * 60 * 24));
        return {
          ...internship,
          daysUntil,
          urgency: daysUntil <= 7 ? 'high' : daysUntil <= 14 ? 'medium' : 'low'
        };
      });
  };

  const generateAchievements = (applications) => {
    const achievements = [];
    
    if (applications.length >= 1) {
      achievements.push({
        id: 'first-application',
        title: 'First Application',
        description: 'Submitted your first internship application',
        icon: '🚀',
        earned: true,
        date: applications[0]?.appliedDate
      });
    }

    if (applications.length >= 5) {
      achievements.push({
        id: 'active-applicant',
        title: 'Active Applicant',
        description: 'Applied to 5 or more internships',
        icon: '📝',
        earned: true,
        date: applications[4]?.appliedDate
      });
    }

    if (applications.some(app => app.status === 'accepted')) {
      achievements.push({
        id: 'first-acceptance',
        title: 'First Acceptance',
        description: 'Received your first internship offer',
        icon: '🎉',
        earned: true,
        date: applications.find(app => app.status === 'accepted')?.updatedDate
      });
    }

    // Add potential achievements
    if (applications.length < 10) {
      achievements.push({
        id: 'persistent-applicant',
        title: 'Persistent Applicant',
        description: 'Apply to 10 internships',
        icon: '💪',
        earned: false,
        progress: applications.length,
        target: 10
      });
    }

    return achievements;
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 text-muted">Loading your student dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold mb-2">🎓 Student Hub</h1>
              <p className="text-muted">Your personalized learning and career center</p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary" 
                onClick={() => navigate('/internships')}
                className="d-flex align-items-center gap-2"
              >
                <FaRocket />
                Browse Internships
              </Button>
              <Button 
                variant="primary" 
                onClick={() => navigate('/my-applications')}
                className="d-flex align-items-center gap-2"
              >
                <FaEye />
                My Applications
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        {/* Overview Tab */}
        <Tab eventKey="overview" title="🏠 Overview">
          <Row className="g-4">
            {/* Notifications Card */}
            <Col lg={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">
                    <FaBell className="me-2" />
                    Notifications
                  </h5>
                  <Badge bg="light" text="dark">
                    {notifications.filter(n => !n.read).length} new
                  </Badge>
                </Card.Header>
                <Card.Body className="p-0">
                  {notifications.length > 0 ? (
                    <ListGroup variant="flush">
                      {notifications.slice(0, 5).map((notification) => (
                        <ListGroup.Item 
                          key={notification.id}
                          className={`d-flex justify-content-between align-items-start ${!notification.read ? 'bg-light' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedNotification(notification);
                            setShowNotificationModal(true);
                            markNotificationAsRead(notification.id);
                          }}
                        >
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span>{getNotificationIcon(notification.type)}</span>
                              <h6 className="mb-0 fw-bold">{notification.title}</h6>
                              {!notification.read && <Badge bg="primary" className="ms-auto">New</Badge>}
                            </div>
                            <p className="mb-1 text-muted small">{notification.message}</p>
                            <small className="text-muted">
                              {new Date(notification.timestamp).toLocaleDateString()}
                            </small>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">No notifications yet</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Quick Stats */}
            <Col lg={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0 fw-bold">
                    <FaChartLine className="me-2" />
                    Quick Stats
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <div className="text-center p-3 bg-light rounded">
                        <div className="h3 fw-bold text-primary">{notifications.filter(n => n.type === 'success').length}</div>
                        <small>Acceptances</small>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="text-center p-3 bg-light rounded">
                        <div className="h3 fw-bold text-warning">{notifications.filter(n => n.type === 'warning').length}</div>
                        <small>Pending</small>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="text-center p-3 bg-light rounded">
                        <div className="h3 fw-bold text-info">{savedInternships.length}</div>
                        <small>Saved</small>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="text-center p-3 bg-light rounded">
                        <div className="h3 fw-bold text-success">{achievements.filter(a => a.earned).length}</div>
                        <small>Achievements</small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4 mt-2">
            {/* Recommendations */}
            <Col lg={8}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-info text-white">
                  <h5 className="mb-0 fw-bold">
                    <FaLightbulb className="me-2" />
                    Recommended for You
                  </h5>
                </Card.Header>
                <Card.Body>
                  {recommendations.length > 0 ? (
                    <Carousel indicators={false} controls={true}>
                      {recommendations.map((internship) => (
                        <Carousel.Item key={internship.id}>
                          <div className="p-3">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h5 className="fw-bold">{internship.title}</h5>
                                <p className="text-primary mb-1">{internship.company}</p>
                                <small className="text-muted">{internship.reason}</small>
                              </div>
                              <Badge bg="success">{internship.matchScore}% match</Badge>
                            </div>
                            <p className="text-muted mb-3">{internship.description}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <small className="text-muted">📍 {internship.location}</small>
                                <br />
                                <small className="text-muted">💰 {internship.stipend}</small>
                              </div>
                              <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => navigate(`/internships/${internship.id}`)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">No recommendations available</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Upcoming Deadlines */}
            <Col lg={4}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-warning text-dark">
                  <h5 className="mb-0 fw-bold">
                    <FaCalendarAlt className="me-2" />
                    Upcoming Deadlines
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {upcomingDeadlines.length > 0 ? (
                    <ListGroup variant="flush">
                      {upcomingDeadlines.map((deadline) => (
                        <ListGroup.Item key={deadline.id} className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-bold">{deadline.title}</div>
                            <small className="text-muted">{deadline.company}</small>
                          </div>
                          <Badge bg={getUrgencyColor(deadline.urgency)}>
                            {deadline.daysUntil} days
                          </Badge>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">No upcoming deadlines</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Achievements Tab */}
        <Tab eventKey="achievements" title="🏆 Achievements">
          <Row className="g-4">
            <Col lg={12}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-warning text-dark">
                  <h5 className="mb-0 fw-bold">
                    <FaTrophy className="me-2" />
                    Your Achievements
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-4">
                    {achievements.map((achievement) => (
                      <Col md={6} lg={4} key={achievement.id}>
                        <Card className={`text-center h-100 ${achievement.earned ? 'border-success' : 'border-secondary'}`}>
                          <Card.Body>
                            <div className="display-4 mb-3">{achievement.icon}</div>
                            <h5 className="fw-bold">{achievement.title}</h5>
                            <p className="text-muted">{achievement.description}</p>
                            {achievement.earned ? (
                              <Badge bg="success" className="mb-2">
                                Earned {new Date(achievement.date).toLocaleDateString()}
                              </Badge>
                            ) : (
                              <div>
                                <div className="mb-2">
                                  <small className="text-muted">
                                    Progress: {achievement.progress}/{achievement.target}
                                  </small>
                                </div>
                                <ProgressBar 
                                  now={(achievement.progress / achievement.target) * 100} 
                                  variant="info"
                                />
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Study Groups Tab */}
        <Tab eventKey="groups" title="👥 Study Groups">
          <Row className="g-4">
            <Col lg={12}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-info text-white">
                  <h5 className="mb-0 fw-bold">
                    <FaUsers className="me-2" />
                    Join Study Groups
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-4">
                    {studyGroups.map((group) => (
                      <Col md={6} lg={4} key={group.id}>
                        <Card className="h-100 border-0 shadow-sm">
                          <Card.Body>
                            <h5 className="fw-bold">{group.name}</h5>
                            <p className="text-muted">{group.topic}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                <FaUsers className="me-1" />
                                {group.members} members
                              </small>
                              <Button variant="outline-primary" size="sm">
                                Join Group
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Saved Tab */}
        <Tab eventKey="saved" title="💾 Saved">
          <Row className="g-4">
            <Col lg={12}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-secondary text-white">
                  <h5 className="mb-0 fw-bold">
                    <FaBookmark className="me-2" />
                    Saved Internships
                  </h5>
                </Card.Header>
                <Card.Body>
                  {savedInternships.length > 0 ? (
                    <Row className="g-4">
                      {savedInternships.map((internship) => (
                        <Col md={6} lg={4} key={internship.id}>
                          <Card className="h-100 border-0 shadow-sm">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <Badge bg={internship.status === 'open' ? 'success' : 'secondary'}>
                                  {internship.status}
                                </Badge>
                                <Button variant="link" className="text-danger p-0">
                                  <FaHeart />
                                </Button>
                              </div>
                              <h5 className="fw-bold">{internship.title}</h5>
                              <p className="text-primary">{internship.company}</p>
                              <p className="text-muted small">{internship.description}</p>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">💰 {internship.stipend}</small>
                                <Button 
                                  variant="primary" 
                                  size="sm"
                                  onClick={() => navigate(`/internships/${internship.id}`)}
                                >
                                  Apply Now
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="text-center py-5">
                      <FaBookmark className="display-4 text-muted mb-3" />
                      <h5>No saved internships</h5>
                      <p className="text-muted">Save internships you're interested in to view them here</p>
                      <Button variant="primary" onClick={() => navigate('/internships')}>
                        Browse Internships
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      {/* Notification Detail Modal */}
      <Modal show={showNotificationModal} onHide={() => setShowNotificationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedNotification && getNotificationIcon(selectedNotification.type)} Notification Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNotification && (
            <div>
              <h5 className="fw-bold">{selectedNotification.title}</h5>
              <p>{selectedNotification.message}</p>
              <small className="text-muted">
                Received: {new Date(selectedNotification.timestamp).toLocaleString()}
              </small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNotificationModal(false)}>
            Close
          </Button>
          {selectedNotification?.actionUrl && (
            <Button 
              variant="primary" 
              onClick={() => {
                navigate(selectedNotification.actionUrl);
                setShowNotificationModal(false);
              }}
            >
              {selectedNotification.actionText}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StudentPage;