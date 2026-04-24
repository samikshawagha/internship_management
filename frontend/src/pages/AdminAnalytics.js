import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { crudService } from '../services/crudService';
import {
  Container, Row, Col, Card, Button, Badge, Table, 
  Form, Alert, Spinner, Modal, ProgressBar, Tabs, Tab
} from 'react-bootstrap';
import { FaChartLine, FaUsers, FaBuilding, FaBriefcase, FaFileAlt, FaDownload, FaCalendarAlt } from 'react-icons/fa';

const AdminAnalytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Load all data
      const [usersResponse, internshipsResponse, applicationsResponse, reportsResponse] = await Promise.all([
        crudService.getAllUsers(),
        crudService.getInternships(),
        crudService.getAllApplications(),
        crudService.getAllReports()
      ]);

      const users = usersResponse.data;
      const internships = internshipsResponse.data;
      const applications = applicationsResponse.data;
      const reports = reportsResponse.data;

      // Calculate comprehensive analytics
      const calculatedAnalytics = calculateAnalytics(users, internships, applications, reports);
      setAnalytics(calculatedAnalytics);
      
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (users, internships, applications, reports) => {
    const now = new Date();
    const periodStart = getPeriodStart(selectedPeriod);

    // Filter data by period
    const periodUsers = users.filter(u => new Date(u.createdAt) >= periodStart);
    const periodInternships = internships.filter(i => new Date(i.postedDate) >= periodStart);
    const periodApplications = applications.filter(a => new Date(a.appliedDate) >= periodStart);

    // User Analytics
    const totalUsers = users.length;
    const students = users.filter(u => u.role === 'student');
    const companies = users.filter(u => u.role === 'company');
    const admins = users.filter(u => u.role === 'admin');
    
    const newUsersThisPeriod = periodUsers.length;
    const userGrowthRate = totalUsers > 0 ? ((newUsersThisPeriod / totalUsers) * 100).toFixed(1) : 0;

    // Internship Analytics
    const totalInternships = internships.length;
    const openInternships = internships.filter(i => i.status === 'open');
    const closedInternships = internships.filter(i => i.status === 'closed');
    const newInternshipsThisPeriod = periodInternships.length;

    // Application Analytics
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(a => a.status === 'pending');
    const acceptedApplications = applications.filter(a => a.status === 'accepted');
    const rejectedApplications = applications.filter(a => a.status === 'rejected');
    const newApplicationsThisPeriod = periodApplications.length;

    const applicationSuccessRate = totalApplications > 0 ? 
      ((acceptedApplications.length / totalApplications) * 100).toFixed(1) : 0;

    // Company Performance
    const companyPerformance = companies.map(company => {
      const companyInternships = internships.filter(i => i.company === company.fullName);
      const companyApplications = applications.filter(a => 
        companyInternships.some(i => i.id === a.internshipId)
      );
      
      return {
        company: company.fullName,
        internships: companyInternships.length,
        applications: companyApplications.length,
        accepted: companyApplications.filter(a => a.status === 'accepted').length,
        avgResponseTime: Math.floor(Math.random() * 14) + 1 // Mock data
      };
    }).sort((a, b) => b.applications - a.applications);

    // Popular Skills
    const skillCounts = {};
    internships.forEach(internship => {
      if (internship.skills && Array.isArray(internship.skills)) {
        internship.skills.forEach(skill => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      }
    });

    const popularSkills = Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));

    // Monthly Trends
    const monthlyTrends = calculateMonthlyTrends(users, internships, applications);

    // Geographic Distribution
    const locationCounts = {};
    internships.forEach(internship => {
      const location = internship.location || 'Unknown';
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    const topLocations = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }));

    // System Health Metrics
    const systemHealth = {
      activeUsers: users.filter(u => {
        // Mock active user calculation (users who applied in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return applications.some(a => a.studentId === u.id && new Date(a.appliedDate) >= thirtyDaysAgo);
      }).length,
      avgApplicationsPerUser: students.length > 0 ? (totalApplications / students.length).toFixed(1) : 0,
      avgInternshipsPerCompany: companies.length > 0 ? (totalInternships / companies.length).toFixed(1) : 0,
      platformUtilization: ((totalApplications / (totalInternships * students.length || 1)) * 100).toFixed(1)
    };

    return {
      // User metrics
      totalUsers,
      students: students.length,
      companies: companies.length,
      admins: admins.length,
      newUsersThisPeriod,
      userGrowthRate,

      // Internship metrics
      totalInternships,
      openInternships: openInternships.length,
      closedInternships: closedInternships.length,
      newInternshipsThisPeriod,

      // Application metrics
      totalApplications,
      pendingApplications: pendingApplications.length,
      acceptedApplications: acceptedApplications.length,
      rejectedApplications: rejectedApplications.length,
      newApplicationsThisPeriod,
      applicationSuccessRate,

      // Performance data
      companyPerformance,
      popularSkills,
      monthlyTrends,
      topLocations,
      systemHealth,

      // Reports
      totalReports: reports.length
    };
  };

  const getPeriodStart = (period) => {
    const now = new Date();
    switch (period) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'quarter':
        return new Date(now.setMonth(now.getMonth() - 3));
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(0);
    }
  };

  const calculateMonthlyTrends = (users, internships, applications) => {
    const trends = {};
    const months = [];
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      months.push(monthKey);
      trends[monthKey] = { users: 0, internships: 0, applications: 0 };
    }

    // Count data for each month
    users.forEach(user => {
      const monthKey = new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (trends[monthKey]) trends[monthKey].users++;
    });

    internships.forEach(internship => {
      const monthKey = new Date(internship.postedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (trends[monthKey]) trends[monthKey].internships++;
    });

    applications.forEach(application => {
      const monthKey = new Date(application.appliedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (trends[monthKey]) trends[monthKey].applications++;
    });

    return months.map(month => ({
      month,
      ...trends[month]
    }));
  };

  const exportAnalytics = (format) => {
    const exportData = {
      generatedAt: new Date().toISOString(),
      period: selectedPeriod,
      analytics: analytics
    };

    let content = '';
    let filename = '';

    if (format === 'json') {
      content = JSON.stringify(exportData, null, 2);
      filename = `admin-analytics-${selectedPeriod}-${Date.now()}.json`;
    } else if (format === 'csv') {
      // Create CSV for key metrics
      const csvData = [
        ['Metric', 'Value'],
        ['Total Users', analytics.totalUsers],
        ['Students', analytics.students],
        ['Companies', analytics.companies],
        ['Total Internships', analytics.totalInternships],
        ['Total Applications', analytics.totalApplications],
        ['Success Rate', `${analytics.applicationSuccessRate}%`],
        ['User Growth Rate', `${analytics.userGrowthRate}%`]
      ];
      
      content = csvData.map(row => row.join(',')).join('\n');
      filename = `admin-analytics-${selectedPeriod}-${Date.now()}.csv`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportModal(false);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 text-muted">Loading analytics...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col md={8}>
          <h1 className="fw-bold mb-2">📊 Admin Analytics</h1>
          <p className="text-muted">Comprehensive system analytics and insights</p>
        </Col>
        <Col md={4} className="text-end">
          <div className="d-flex gap-2 justify-content-end">
            <Form.Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-auto"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </Form.Select>
            <Button variant="success" onClick={() => setShowExportModal(true)}>
              <FaDownload className="me-2" />
              Export
            </Button>
            <Button variant="primary" onClick={() => navigate('/admin-dashboard')}>
              ← Dashboard
            </Button>
          </div>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        {/* Overview Tab */}
        <Tab eventKey="overview" title="📈 Overview">
          {/* Key Metrics */}
          <Row className="mb-4 g-3">
            <Col lg={3} md={6}>
              <Card className="text-center border-0 shadow-sm h-100">
                <Card.Body style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <FaUsers className="display-6 mb-3" />
                  <div className="display-6 fw-bold">{analytics.totalUsers || 0}</div>
                  <div>Total Users</div>
                  <small className="opacity-75">+{analytics.newUsersThisPeriod} this {selectedPeriod}</small>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="text-center border-0 shadow-sm h-100">
                <Card.Body style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                  <FaBriefcase className="display-6 mb-3" />
                  <div className="display-6 fw-bold">{analytics.totalInternships || 0}</div>
                  <div>Total Internships</div>
                  <small className="opacity-75">+{analytics.newInternshipsThisPeriod} this {selectedPeriod}</small>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="text-center border-0 shadow-sm h-100">
                <Card.Body style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
                  <FaFileAlt className="display-6 mb-3" />
                  <div className="display-6 fw-bold">{analytics.totalApplications || 0}</div>
                  <div>Total Applications</div>
                  <small className="opacity-75">+{analytics.newApplicationsThisPeriod} this {selectedPeriod}</small>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="text-center border-0 shadow-sm h-100">
                <Card.Body style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                  <FaChartLine className="display-6 mb-3" />
                  <div className="display-6 fw-bold">{analytics.applicationSuccessRate || 0}%</div>
                  <div>Success Rate</div>
                  <small className="opacity-75">Platform average</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* User Distribution */}
          <Row className="mb-4 g-4">
            <Col lg={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0 fw-bold">👥 User Distribution</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Students</span>
                      <Badge bg="primary">{analytics.students}</Badge>
                    </div>
                    <ProgressBar 
                      now={analytics.totalUsers ? (analytics.students / analytics.totalUsers * 100) : 0} 
                      variant="primary"
                      className="mb-3"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Companies</span>
                      <Badge bg="success">{analytics.companies}</Badge>
                    </div>
                    <ProgressBar 
                      now={analytics.totalUsers ? (analytics.companies / analytics.totalUsers * 100) : 0} 
                      variant="success"
                      className="mb-3"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Admins</span>
                      <Badge bg="danger">{analytics.admins}</Badge>
                    </div>
                    <ProgressBar 
                      now={analytics.totalUsers ? (analytics.admins / analytics.totalUsers * 100) : 0} 
                      variant="danger"
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0 fw-bold">📊 Application Status</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Pending</span>
                      <Badge bg="warning">{analytics.pendingApplications}</Badge>
                    </div>
                    <ProgressBar 
                      now={analytics.totalApplications ? (analytics.pendingApplications / analytics.totalApplications * 100) : 0} 
                      variant="warning"
                      className="mb-3"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Accepted</span>
                      <Badge bg="success">{analytics.acceptedApplications}</Badge>
                    </div>
                    <ProgressBar 
                      now={analytics.totalApplications ? (analytics.acceptedApplications / analytics.totalApplications * 100) : 0} 
                      variant="success"
                      className="mb-3"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Rejected</span>
                      <Badge bg="danger">{analytics.rejectedApplications}</Badge>
                    </div>
                    <ProgressBar 
                      now={analytics.totalApplications ? (analytics.rejectedApplications / analytics.totalApplications * 100) : 0} 
                      variant="danger"
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* System Health */}
          <Row className="mb-4">
            <Col lg={12}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-info text-white">
                  <h5 className="mb-0 fw-bold">🏥 System Health Metrics</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-4">
                    <Col md={3}>
                      <div className="text-center p-3 bg-light rounded">
                        <div className="h4 fw-bold text-primary">{analytics.systemHealth?.activeUsers || 0}</div>
                        <small>Active Users (30 days)</small>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center p-3 bg-light rounded">
                        <div className="h4 fw-bold text-success">{analytics.systemHealth?.avgApplicationsPerUser || 0}</div>
                        <small>Avg Applications/User</small>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center p-3 bg-light rounded">
                        <div className="h4 fw-bold text-warning">{analytics.systemHealth?.avgInternshipsPerCompany || 0}</div>
                        <small>Avg Internships/Company</small>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center p-3 bg-light rounded">
                        <div className="h4 fw-bold text-info">{analytics.systemHealth?.platformUtilization || 0}%</div>
                        <small>Platform Utilization</small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Company Performance Tab */}
        <Tab eventKey="companies" title="🏢 Companies">
          <Row>
            <Col lg={12}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0 fw-bold">🏢 Company Performance Analysis</h5>
                </Card.Header>
                <Card.Body>
                  {analytics.companyPerformance && analytics.companyPerformance.length > 0 ? (
                    <div className="table-responsive">
                      <Table hover>
                        <thead>
                          <tr>
                            <th>Company</th>
                            <th>Internships Posted</th>
                            <th>Applications Received</th>
                            <th>Acceptances</th>
                            <th>Success Rate</th>
                            <th>Avg Response Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.companyPerformance.map((company, index) => (
                            <tr key={index}>
                              <td className="fw-bold">{company.company}</td>
                              <td>{company.internships}</td>
                              <td>
                                <Badge bg="info">{company.applications}</Badge>
                              </td>
                              <td>
                                <Badge bg="success">{company.accepted}</Badge>
                              </td>
                              <td>
                                <Badge bg={company.applications > 0 && (company.accepted / company.applications) > 0.3 ? 'success' : 'warning'}>
                                  {company.applications > 0 ? 
                                    ((company.accepted / company.applications) * 100).toFixed(1) : 0}%
                                </Badge>
                              </td>
                              <td>{company.avgResponseTime} days</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">No company data available</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Skills & Trends Tab */}
        <Tab eventKey="trends" title="📈 Trends">
          <Row className="g-4">
            <Col lg={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0 fw-bold">🔥 Popular Skills</h5>
                </Card.Header>
                <Card.Body>
                  {analytics.popularSkills && analytics.popularSkills.length > 0 ? (
                    analytics.popularSkills.map((skillData, index) => (
                      <div key={skillData.skill} className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-medium">
                            <Badge bg="light" text="dark" className="me-2">{index + 1}</Badge>
                            {skillData.skill}
                          </span>
                          <Badge bg="primary">{skillData.count}</Badge>
                        </div>
                        <ProgressBar 
                          now={(skillData.count / Math.max(...analytics.popularSkills.map(s => s.count))) * 100} 
                          variant="success"
                          style={{ height: '8px' }}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-muted text-center py-4">No skills data available</p>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-warning text-dark">
                  <h5 className="mb-0 fw-bold">📍 Top Locations</h5>
                </Card.Header>
                <Card.Body>
                  {analytics.topLocations && analytics.topLocations.length > 0 ? (
                    analytics.topLocations.map((locationData, index) => (
                      <div key={locationData.location} className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-medium">
                            <Badge bg="light" text="dark" className="me-2">{index + 1}</Badge>
                            {locationData.location}
                          </span>
                          <Badge bg="warning">{locationData.count}</Badge>
                        </div>
                        <ProgressBar 
                          now={(locationData.count / Math.max(...analytics.topLocations.map(l => l.count))) * 100} 
                          variant="warning"
                          style={{ height: '8px' }}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-muted text-center py-4">No location data available</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Monthly Trends */}
          <Row className="mt-4">
            <Col lg={12}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-info text-white">
                  <h5 className="mb-0 fw-bold">📅 Monthly Trends (Last 6 Months)</h5>
                </Card.Header>
                <Card.Body>
                  {analytics.monthlyTrends && analytics.monthlyTrends.length > 0 ? (
                    <div className="table-responsive">
                      <Table hover>
                        <thead>
                          <tr>
                            <th>Month</th>
                            <th>New Users</th>
                            <th>New Internships</th>
                            <th>New Applications</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.monthlyTrends.map((trend) => (
                            <tr key={trend.month}>
                              <td className="fw-bold">{trend.month}</td>
                              <td>
                                <Badge bg="primary">{trend.users}</Badge>
                              </td>
                              <td>
                                <Badge bg="success">{trend.internships}</Badge>
                              </td>
                              <td>
                                <Badge bg="info">{trend.applications}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">No trend data available</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      {/* Export Modal */}
      <Modal show={showExportModal} onHide={() => setShowExportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>📊 Export Analytics</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Choose the format to export your analytics data:</p>
          <div className="d-grid gap-2">
            <Button variant="primary" onClick={() => exportAnalytics('json')}>
              Export as JSON
            </Button>
            <Button variant="success" onClick={() => exportAnalytics('csv')}>
              Export as CSV
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExportModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminAnalytics;